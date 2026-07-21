import type { Metadata } from "next";
import Link from "next/link";

import { DrawTicketManager } from "@/widgets/draw-ticket-manager";

import type { LotteryItem } from "@/entities/lottery/model/types";

import { buildMetadata } from "@/shared/config/seo";

interface PageProps {
  params: Promise<{ id: string }>;
}

const API = process.env.NEXT_PUBLIC_API_URL || "https://kgloto.com/api/v1";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  // Пытаемся подтянуть человекочитаемое имя лотереи по коду тиража (id вида
  // "T_5_36"). Best-effort: если не вышло — используем общий заголовок.
  let name = "";
  try {
    const res = await fetch(`${API}/lotteries/`, {
      headers: { "Accept-Language": "ru" },
      next: { revalidate: 600 },
    });
    if (res.ok) {
      const json = await res.json();
      const match = (json.data as LotteryItem[] | undefined)?.find(
        (l) => l.billingLotteryId === id,
      );
      name = match?.title || "";
    }
  } catch {
    // молча откатываемся на общий заголовок
  }

  return buildMetadata({
    title: name
      ? `${name} — купить билеты | KGLOTO`
      : "Тиражная лотерея — купить билеты | KGLOTO",
    description: name
      ? `Купите билеты лотереи «${name}» онлайн на KGLOTO. Быстрая покупка, билет приходит на WhatsApp.`
      : "Купите билеты тиражной лотереи онлайн на KGLOTO. Быстрая покупка, билет приходит на WhatsApp.",
    path: `/draw-tickets/${id}`,
  });
}

export default async function DrawTicketsDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-rubik pb-20">
      <div className="max-w-360 mx-auto px-4 pt-6">
        <nav className="flex items-center gap-2 text-[12px] md:text-[14px] font-medium text-[#737373] mb-6">
          <Link href="/" className="hover:text-[#4B4B4B] transition-colors">
            Главная
          </Link>
          <span>/</span>
          <Link
            href="/draw-tickets"
            className="hover:text-[#4B4B4B] transition-colors"
          >
            Тиражные лотереи
          </Link>
          <span>/</span>
          <span className="text-[#4B4B4B] font-bold">Детали лотереи</span>
        </nav>
        {/* Наш умный виджет, куда мы передаем полученный id */}
        <DrawTicketManager lotteryId={id} />
      </div>
    </div>
  );
}
