"use client";

import { useMemo, useState } from "react";

import { Loader2 } from "lucide-react";

import {
  MyTicketDto,
  TicketCheckResultResponse,
  useCheckTicketResult,
  useDownloadTicketPdf,
  useMyTickets,
} from "@/entities/ticket/api";
import { EmptyTickets } from "@/entities/ticket/ui/EmptyTickets";
import { MyTicketCard } from "@/entities/ticket/ui/MyTicketCard";

import { ErrorModal } from "@/shared/ui/ErrorModal";
import { ProfileSubTabs } from "@/shared/ui/ProfileSubTabs";

import { TicketCheckResultModal } from "./TicketCheckResultModal";

const SUB_TABS = ["Все билеты", "Выигрышные", "Не проверены"];

export const ProfileTicketList = () => {
  const [activeSubTab, setActiveSubTab] = useState("Все билеты");
  const { data: tickets, isLoading, refetch } = useMyTickets();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const {
    mutate: downloadPdf,
    isPending: isDownloading,
    variables: downloadingTicketId,
  } = useDownloadTicketPdf();

  const handleDownload = (ticketId: string) => {
    downloadPdf(ticketId, { onError: () => setIsErrorOpen(true) });
  };

  const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);
  const [checkResult, setCheckResult] =
    useState<TicketCheckResultResponse | null>(null);
  const [checkErrorMessage, setCheckErrorMessage] = useState<string | null>(
    null,
  );
  // Бэк отвечает 409 { code: "draw_not_completed" }, если тираж ещё не прошёл —
  // по факту (а не по документации бэка, где обещали 200 с is_winning: false)
  const [isDrawPending, setIsDrawPending] = useState(false);
  const { mutate: checkTicket, isPending: isChecking } = useCheckTicketResult();

  const handleCheck = (ticketId: string) => {
    setIsCheckModalOpen(true);
    setCheckResult(null);
    setCheckErrorMessage(null);
    setIsDrawPending(false);

    checkTicket(ticketId, {
      onSuccess: (res) => {
        setCheckResult(res);
        // Билет мог сменить статус (проигрышный -> помечен как проверенный) —
        // обновляем список, чтобы бейджи/кнопки в карточках были актуальны
        refetch();
      },
      onError: (err) => {
        const data = (
          err as { response?: { data?: { detail?: unknown; code?: unknown } } }
        )?.response?.data;

        if (data?.code === "draw_not_completed") {
          setIsDrawPending(true);
          return;
        }

        setCheckErrorMessage(
          typeof data?.detail === "string"
            ? data.detail
            : "Не удалось проверить билет. Попробуйте ещё раз.",
        );
      },
    });
  };

  // 1. Трансформируем DTO с бэкенда в удобный формат для UI
  const mappedTickets = useMemo(() => {
    if (!tickets) return [];

    // Получаем текущее время один раз для всего цикла
    const now = new Date().getTime();

    return tickets.map((t: MyTicketDto) => {
      // Маппинг статусов (на бэке "sold", в UI "unchecked")
      let mappedStatus: "winning" | "unchecked" | "losing" = "unchecked";
      if (t.status === "winning") mappedStatus = "winning";
      if (t.status === "losing") mappedStatus = "losing";

      // drawId теперь число (ltt_id); поддерживаем и старые строковые id
      const drawNumberStr =
        String(t.drawId ?? "")
          .split("-")
          .pop() || "";

      // 🔥 Логика: Наступила ли дата розыгрыша?
      // Если даты нет (например, моментальная лотерея), считаем, что проверять можно сразу (true)
      const isDrawPassed = t.drawDate
        ? new Date(t.drawDate).getTime() <= now
        : true;

      // 🔥 Показываем кнопку, только если билет не проигрышный.
      // Но если статус "unchecked", прячем её до наступления даты розыгрыша.
      let showButton = mappedStatus !== "losing";
      if (mappedStatus === "unchecked" && !isDrawPassed) {
        showButton = false;
      }

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
        logo: t.logo,
        status: mappedStatus,
        // combinations — реальный контракт LTT (по одной "сетке" на элемент,
        // у мультибилетов их несколько); combination — устаревшее поле-фоллбек
        combinations:
          t.combinations && t.combinations.length > 0
            ? t.combinations
            : t.combination
              ? [t.combination]
              : [],
        drawNumber: drawNumberStr,
        drawDateDisplay: t.drawDateDisplay,
        showButton, // <-- Передаем вычисленный флаг
        // PDF доступен только для реальных LTT-билетов (у мок-билетов barcodeValue пустой)
        canDownload: !!t.barcodeValue,
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
                logoSrc={ticket.logo || undefined}
                status={ticket.status}
                showButton={ticket.showButton} // 🔥 Прокидываем флаг в карточку
                drawNumber={ticket.drawNumber}
                combinations={ticket.combinations}
                drawDateDisplay={ticket.drawDateDisplay}
                onAction={() => handleCheck(ticket.id)}
                canDownload={ticket.canDownload}
                isDownloading={
                  isDownloading && downloadingTicketId === ticket.id
                }
                onDownload={() => handleDownload(ticket.id)}
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

      <ErrorModal
        isOpen={isErrorOpen}
        onClose={() => setIsErrorOpen(false)}
        title="Не удалось скачать билет"
        message="Билет не найден или ещё не оплачен. Попробуйте позже."
      />

      <TicketCheckResultModal
        isOpen={isCheckModalOpen}
        onClose={() => setIsCheckModalOpen(false)}
        isLoading={isChecking}
        result={checkResult}
        errorMessage={checkErrorMessage}
        isDrawPending={isDrawPending}
      />
    </div>
  );
};
