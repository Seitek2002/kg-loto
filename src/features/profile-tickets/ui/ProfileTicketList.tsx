"use client";

import { useMemo, useState } from "react";

import { Loader2 } from "lucide-react";

import { MyTicketDto, useMyTickets } from "@/entities/ticket/api";
import { EmptyTickets } from "@/entities/ticket/ui/EmptyTickets";
import { MyTicketCard } from "@/entities/ticket/ui/MyTicketCard";

import { ProfileSubTabs } from "@/shared/ui/ProfileSubTabs";

const SUB_TABS = ["Все билеты", "Выигрышные", "Не проверены"];

export const ProfileTicketList = () => {
  const [activeSubTab, setActiveSubTab] = useState("Все билеты");
  const { data: tickets, isLoading } = useMyTickets();

  // 1. Трансформируем DTO с бэкенда в удобный формат для UI
  const mappedTickets = useMemo(() => {
    if (!tickets) return [];

    return tickets.map((t: MyTicketDto) => {
      // Маппинг статусов (на бэке "sold", в UI "unchecked")
      let mappedStatus: "winning" | "unchecked" | "losing" = "unchecked";
      if (t.status === "winning") mappedStatus = "winning";
      if (t.status === "losing") mappedStatus = "losing";

      // Достаем номер тиража (например, из "draw-20260410-001" -> "001")
      const drawNumberStr = t.drawId?.split("-").pop() || "";

      return {
        id: t.ticketId || t.ticketNumber,
        prize: t.prizeAmount ? String(t.prizeAmount) : "0",
        name: t.name || `Тираж №${drawNumberStr}`,
        price: Number(t.price) || 0,
        date:
          t.purchaseDateDisplay ||
          (t.purchaseDate
            ? new Date(t.purchaseDate).toLocaleDateString("ru-RU")
            : "Скоро"),
        logo: t.logo || "/images/draw-tickets/super-jackpot-logo.png",
        status: mappedStatus,
        combination: t.combination || [],
        drawNumber: drawNumberStr,
        drawDateDisplay: t.drawDateDisplay, // Добавили из твоего нового интерфейса
      };
    });
  }, [tickets]);

  // 2. Фильтруем билеты в зависимости от выбранного таба
  const filteredTickets = useMemo(() => {
    return mappedTickets.filter((ticket) => {
      if (activeSubTab === "Выигрышные") return ticket.status === "winning";
      if (activeSubTab === "Не проверены") return ticket.status === "unchecked";
      return true; // Для "Все билеты"
    });
  }, [activeSubTab, mappedTickets]);

  const hasTickets = filteredTickets.length > 0;

  // Кнопка "Еще" для десктопа (пока как заглушка/ui-элемент)
  const moreButtonDesktop = hasTickets ? (
    <button className="hidden cursor-pointer sm:flex items-center gap-2 text-sm font-bold text-[#4B4B4B] hover:text-[#FF7600] transition-colors">
      Еще <span>→</span>
    </button>
  ) : undefined;

  return (
    <div className="bg-white rounded-3xl sm:rounded-[40px] shadow-sm p-4 sm:p-8 lg:p-10 min-h-100">
      <ProfileSubTabs
        tabs={SUB_TABS}
        activeTab={activeSubTab}
        onTabChange={setActiveSubTab}
        rightElement={moreButtonDesktop}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64 text-[#FF7600]">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      ) : hasTickets ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr">
            {filteredTickets.map((ticket) => (
              <MyTicketCard
                key={ticket.id}
                prizeAmount={ticket.prize}
                ticketName={ticket.name}
                price={ticket.price}
                date={ticket.date}
                logoSrc={ticket.logo}
                status={ticket.status}
                showButton={ticket.status !== "losing"}
                drawNumber={ticket.drawNumber}
                combination={ticket.combination}
                drawDateDisplay={ticket.drawDateDisplay}
                onAction={() => console.log("Клик по билету", ticket.id)}
              />
            ))}
          </div>

          {/* Кнопка "Еще" для мобилок */}
          <button className="sm:hidden bg-white w-full mt-6 py-3 flex justify-center items-center gap-2 border border-[#90909080] rounded-full text-sm font-bold text-[#4B4B4B] active:scale-[0.98] transition-all cursor-pointer">
            Еще <span>→</span>
          </button>
        </>
      ) : (
        <EmptyTickets />
      )}
    </div>
  );
};
