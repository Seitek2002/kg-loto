import type { MetadataRoute } from "next";

import type { NewsItem } from "@/entities/news/model/types";

import { LotteryItem } from "@/entities/lottery/model/types";

import { SITE_URL } from "@/shared/config/seo";

const API = process.env.NEXT_PUBLIC_API_URL || "https://kgloto.com/api/v1";

// Пересобираем карту сайта раз в час — новости и список лотерей меняются нечасто
export const revalidate = 3600;

const safeJson = async (path: string) => {
  try {
    const res = await fetch(`${API}${path}`, {
      headers: { "Accept-Language": "ru" },
      next: { revalidate },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

const abs = (path: string) => new URL(path, SITE_URL).toString();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPaths: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/lottery", priority: 0.8 },
    { path: "/draw-tickets", priority: 0.8 },
    { path: "/news", priority: 0.6 },
    { path: "/winners", priority: 0.6 },
    { path: "/map", priority: 0.5 },
  ];

  const entries: MetadataRoute.Sitemap = staticPaths.map(({ path, priority }) => ({
    url: abs(path),
    lastModified: now,
    changeFrequency: "daily",
    priority,
  }));

  // Лотереи: /lotteries/ отдаёт и моментальные, и тиражные — разводим по маршрутам
  const lotteriesJson = await safeJson("/lotteries/");
  const lotteries: LotteryItem[] = lotteriesJson?.data || [];
  for (const lottery of lotteries) {
    if (lottery.lotteryType === "draw") {
      if (lottery.billingLotteryId) {
        entries.push({
          url: abs(`/draw-tickets/${lottery.billingLotteryId}`),
          lastModified: now,
          changeFrequency: "daily",
          priority: 0.9,
        });
      }
    } else {
      entries.push({
        url: abs(`/lottery/${lottery.id}`),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  // Новости
  const newsJson = await safeJson("/news/");
  const news: NewsItem[] = newsJson?.data?.results || [];
  for (const item of news) {
    if (!item.slug) continue;
    entries.push({
      url: abs(`/news/${item.slug}`),
      lastModified: item.publishedAt ? new Date(item.publishedAt) : now,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  return entries;
}
