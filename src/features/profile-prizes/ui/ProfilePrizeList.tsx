"use client";

import { useMemo, useState } from "react";

import { Loader2 } from "lucide-react";

import {
  MyTicketDto,
  useDownloadTicketPdf,
  useMyTickets,
} from "@/entities/ticket/api";
import { EmptyPrizes } from "@/entities/ticket/ui/EmptyPrizes";
import { MyTicketCard } from "@/entities/ticket/ui/MyTicketCard";

import { ErrorModal } from "@/shared/ui/ErrorModal";

export const ProfilePrizeList = () => {
  const { data: tickets, isLoading } = useMyTickets();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const {
    mutate: downloadPdf,
    isPending: isDownloading,
    variables: downloadingTicketId,
  } = useDownloadTicketPdf();

  const handleDownload = (ticketId: string) => {
    downloadPdf(ticketId, { onError: () => setIsErrorOpen(true) });
  };

  // Приз — это выигрышный билет, пришедший с бэкенда (GET /me/balance/tickets/).
  // Бэк не отдаёт отдельный статус получения приза (получен/ожидает/в обработке),
  // поэтому бейдж не показываем, чтобы не выдумывать данные.
  const prizes = useMemo(() => {
    if (!tickets) return [];

    return tickets
      .filter((t: MyTicketDto) => t.status === "winning")
      .map((t: MyTicketDto) => {
        const drawNumberStr =
          String(t.drawId ?? "")
            .split("-")
            .pop() || "";

        return {
          id: t.ticketId || t.ticketNumber,
          prize: t.prizeAmount ? String(t.prizeAmount) : "0",
          // drawName — человекочитаемое название тиража; t.name раньше дублировал
          // технический drawCode (например "TIRAGE_5_36")
          name: t.drawName || t.name || `Тираж №${drawNumberStr}`,
          price: Number(t.price) || 0,
          date:
            t.purchaseDateDisplay ||
            (t.purchaseDate
              ? new Date(t.purchaseDate).toLocaleDateString("ru-RU")
              : "Скоро"),
          logo: t.logo || undefined,
          canDownload: !!t.barcodeValue,
        };
      });
  }, [tickets]);

  const hasPrizes = prizes.length > 0;
  const moreButtonDesktop = hasPrizes ? (
    <button className="hidden cursor-pointer sm:flex items-center gap-2 text-sm font-bold text-[#4B4B4B] hover:text-[#FF7600] transition-colors">
      Еще <span>→</span>
    </button>
  ) : undefined;

  return (
    <div className="bg-white rounded-3xl sm:rounded-[40px] shadow-sm p-4 sm:p-8 lg:p-10 min-h-100">
      <div className="flex justify-end mb-6 sm:mb-8">{moreButtonDesktop}</div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64 text-[#FF7600]">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      ) : hasPrizes ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr">
            {prizes.map((prize) => (
              <MyTicketCard
                key={prize.id}
                prizeAmount={prize.prize}
                ticketName={prize.name}
                price={prize.price}
                date={prize.date}
                logoSrc={prize.logo}
                status="winning"
                showButton={false}
                canDownload={prize.canDownload}
                isDownloading={
                  isDownloading && downloadingTicketId === prize.id
                }
                onDownload={() => handleDownload(prize.id)}
              />
            ))}
          </div>
          <button className="sm:hidden bg-white w-full mt-6 py-3 flex justify-center items-center gap-2 border border-[#90909080] rounded-full text-sm font-bold text-[#4B4B4B] active:scale-[0.98] transition-all cursor-pointer">
            Еще <span>→</span>
          </button>
        </>
      ) : (
        <EmptyPrizes />
      )}

      <ErrorModal
        isOpen={isErrorOpen}
        onClose={() => setIsErrorOpen(false)}
        title="Не удалось скачать билет"
        message="Билет не найден или ещё не оплачен. Попробуйте позже."
      />
    </div>
  );
};
