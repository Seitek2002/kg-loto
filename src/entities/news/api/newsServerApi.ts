import { cookies } from "next/headers";

import { NewsItem } from "../model/types";

interface PaginatedNewsResponse {
  data: {
    results: NewsItem[];
  };
}

interface SingleNewsResponse {
  data: NewsItem;
}

export const getNewsList = async (): Promise<NewsItem[]> => {
  try {
    const cookieStore = await cookies();
    const locale = cookieStore.get("NEXT_LOCALE")?.value || "ru";
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://kgloto.com/api/v1";

    const res = await fetch(`${baseUrl}/news/`, {
      headers: { "Accept-Language": locale },
      next: { revalidate: 300 }, // Кеш 5 минут
    });

    if (!res.ok) return [];
    const json: PaginatedNewsResponse = await res.json();
    return json.data?.results || [];
  } catch (error) {
    console.error("News List Fetch Error:", error);
    return [];
  }
};

export const getNewsBySlug = async (slug: string): Promise<NewsItem | null> => {
  try {
    const cookieStore = await cookies();
    const locale = cookieStore.get("NEXT_LOCALE")?.value || "ru";
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://kgloto.com/api/v1";

    const res = await fetch(`${baseUrl}/news/${slug}/`, {
      headers: { "Accept-Language": locale },
      next: { revalidate: 300 },
    });

    if (!res.ok) return null;
    const json: SingleNewsResponse = await res.json();
    return json.data || null;
  } catch (error) {
    console.error("Single News Fetch Error:", error);
    return null;
  }
};
