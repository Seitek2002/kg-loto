"use client";

import { useMemo } from "react";

import { useQueries } from "@tanstack/react-query";
import { Radio } from "lucide-react";

import { ticketApi, useMyTickets } from "@/entities/ticket/api";
import { useAuthStore } from "@/entities/user/model/authStore";

// Чисто информационный блок на главной: "Ваш билет #... участвует в
// розыгрыше, смотрите в прямом эфире ..." — не привязан к проверке билета,
// показывается для купленных, но ещё не разыгранных билетов
export const MyTicketsAnnouncement = () => {
  const user = useAuthStore((state) => state.user);
  const { data: tickets } = useMyTickets(!!user);

  const upcomingTickets = useMemo(() => {
    if (!tickets) return [];
    const now = Date.now();

    return tickets.filter(
      (t) =>
        t.status === "sold" &&
        !!t.ticketNumber &&
        !!t.drawDate &&
        new Date(t.drawDate).getTime() > now,
    );
  }, [tickets]);

  const lotteryIds = useMemo(
    () => Array.from(new Set(upcomingTickets.map((t) => t.lotteryId))),
    [upcomingTickets],
  );

  // Телетрансляция лежит на тираже, а не на билете — подтягиваем отдельно
  // по каждой уникальной лотерее среди билетов пользователя
  const drawQueries = useQueries({
    queries: lotteryIds.map((lotteryId) => ({
      queryKey: ["currentDraw", lotteryId],
      queryFn: () => ticketApi.getCurrentDraw(lotteryId),
      enabled: !!lotteryId,
    })),
  });

  const tvBroadcastByLottery = useMemo(() => {
    const map: Record<string, string | undefined> = {};
    lotteryIds.forEach((lotteryId, idx) => {
      map[lotteryId] = drawQueries[idx]?.data?.draw?.tvBroadcast;
    });
    return map;
  }, [lotteryIds, drawQueries]);

  if (!user || upcomingTickets.length === 0) return null;

  return (
    <section className="max-w-[1160px] mx-auto px-4 mb-6 flex flex-col gap-2">
      {upcomingTickets.map((ticket) => {
        const tvBroadcast = tvBroadcastByLottery[ticket.lotteryId];

        return (
          <div
            key={ticket.ticketId}
            className="flex items-center gap-3 bg-white border border-[#DCE6F2] rounded-2xl px-5 py-3 text-[14px] text-[#4B4B4B]"
          >
            <Radio size={18} className="text-[#F08000] shrink-0" />
            <span>
              Ваш билет{" "}
              <span className="font-bold">#{ticket.ticketNumber}</span>{" "}
              участвует в розыгрыше, смотрите в прямом эфире
              {tvBroadcast ? ` ${tvBroadcast}` : ""}
              {ticket.drawDateDisplay ? `, ${ticket.drawDateDisplay}` : ""}
            </span>
          </div>
        );
      })}
    </section>
  );
};
