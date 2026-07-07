"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { CartDrawer } from "@/widgets/cart-drawer";
import { DrawArchiveBlock } from "@/widgets/draw-archive-block";
import { DrawRulesBlock } from "@/widgets/draw-rules-block";
import { PopularTicketsWidget } from "@/widgets/popular-tickets/ui/PopularTicketsWidget";
import { WinnersSlider } from "@/widgets/winners-slider";

import { useCartStore } from "@/entities/cart/model/cartStore";
import {
  TicketDto,
  getTicketNumbers,
  isTicketAvailable,
} from "@/entities/ticket/api";
import { useCurrentDraw, useTickets } from "@/entities/ticket/api/ticketApi";
import { DrawTicketCard } from "@/entities/ticket/ui/DrawTicketCard";

import { cn } from "@/shared/lib/utils";
import { Skeleton } from "@/shared/ui/Skeleton";

const DrawTimer = ({
  drawDate,
  drawTime,
}: {
  drawDate?: string;
  drawTime?: string;
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!drawDate || !drawTime) return;

    const targetDate = new Date(`${drawDate}T${drawTime}`);

    const updateTimer = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer(); // Вызываем сразу, чтобы не было задержки в 1 сек
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [drawDate, drawTime]);

  return (
    <div className="flex justify-center gap-4 w-full">
      <div className="flex flex-col bg-white/10 backdrop-blur-md rounded-xl p-2 items-center min-w-17.5">
        <span className="text-[12px] font-medium mb-1">Дней</span>
        <span className="text-[32px] font-black leading-none">
          {timeLeft.days}
        </span>
      </div>
      <div className="flex flex-col bg-white/10 backdrop-blur-md rounded-xl p-2 items-center min-w-30">
        <span className="text-[12px] font-medium mb-1">Часов</span>
        <span className="text-[32px] font-black leading-none tabular-nums">
          {`${String(timeLeft.hours).padStart(2, "0")}:${String(timeLeft.minutes).padStart(2, "0")}:${String(timeLeft.seconds).padStart(2, "0")}`}
        </span>
      </div>
    </div>
  );
};

export const DrawTicketManager = ({ lotteryId }: { lotteryId: string }) => {
  const [activeTab, setActiveTab] = useState("tickets");

  const { data, isLoading: isDrawLoading } = useCurrentDraw(lotteryId);
  const currentDraw = data?.draw;
  const rules = data?.rules || [];
  // 🔥 Вытаскиваем наши мета-картинки из ответа
  const metaAssets = data?.metaAssets;

  const { toggleItem, items } = useCartStore();
  const basketIds = items.map((item) => item.id);

  const { data: ticketsData, isLoading: isTicketsLoading } = useTickets({
    lotteryId,
    drawId: currentDraw?.drawId || "",
    limit: 30,
  });

  // Статусы LTT произвольные (реальный статус доступного билета — "at_web_service"),
  // поэтому фильтруем чёрным списком через isTicketAvailable
  const availableTickets =
    ticketsData?.tickets?.filter((t: TicketDto) => isTicketAvailable(t)) || [];

  // Параметры игровой сетки (36 для 5/36, 42 для 5/42) — приходят вместе с билетами
  const game = ticketsData?.game;

  const isLoading = isDrawLoading || isTicketsLoading;

  // 🔥 Логотип лотереи: берем из API, либо используем дефолтный как в webview
  const displayLogo =
    metaAssets?.lotteryLogo ||
    metaAssets?.logo ||
    "/images/draw-tickets/super-jackpot-logo.png";

  return (
    <>
      {/* --- HERO SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mt-6">
        <div className="lg:col-span-2 relative min-h-65 sm:min-h-87.5 lg:min-h-105 rounded-3xl lg:rounded-4xl overflow-hidden flex flex-col justify-between shadow-sm">
          {/* 🔥 ДИНАМИЧЕСКИЙ ФОН */}
          <Image
            src={
              metaAssets?.backgroundImage ||
              "/images/draw-tickets/big-block-bg.png"
            }
            alt="Background"
            fill
            unoptimized
            className="object-cover z-0"
            priority
          />
          <div className="relative z-10 flex flex-col items-left self-start pt-6 sm:pt-10 lg:pt-16 pl-4 sm:pl-8 lg:pl-16">
            {/* 🔥 ДИНАМИЧЕСКИЙ ЛОГОТИП (с размерами из webview) */}
            <div className="relative w-25 h-18.75 sm:h-25 mb-2 sm:mb-4">
              <Image
                src={displayLogo}
                alt="Lottery Logo"
                fill
                className="object-contain object-left"
                unoptimized
                priority
              />
            </div>

            <div className="text-white text-[13px] sm:text-sm lg:text-xl font-bold mb-1 drop-shadow-md">
              Суперприз от
            </div>
            <div className="text-[#E2FF5A] text-[32px] sm:text-4xl lg:text-[64px] leading-none font-black font-benzin">
              {isDrawLoading ? (
                <Skeleton className="w-50 h-10 mt-2" />
              ) : (
                currentDraw?.jackpotAmountDisplay || "0 с"
              )}
            </div>
          </div>
          <div className="relative z-10 mx-3 mb-3 p-1.5 bg-white/20 backdrop-blur-md rounded-[14px] border border-white/30 flex items-center justify-between gap-1">
            {[
              { id: "tickets", label: "Билеты" },
              { id: "rules", label: "Правила" },
              { id: "archive", label: "Архив" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 py-2.5 rounded-[10px] text-[13px] font-bold transition-all",
                  activeTab === tab.id
                    ? "bg-white text-[#4B4B4B]"
                    : "text-white",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div
          className={cn(
            "flex-col gap-4 lg:gap-6",
            activeTab === "tickets" ? "flex" : "hidden lg:flex",
          )}
        >
          <div className="bg-white rounded-3xl lg:rounded-4xl p-6 lg:p-8 shadow-sm flex flex-col justify-center flex-1">
            <h2 className="text-[20px] lg:text-[26px] font-bold text-[#4B4B4B] text-center mb-6">
              {isDrawLoading ? (
                <Skeleton className="h-8 w-3/4 mx-auto" />
              ) : (
                currentDraw?.title || "Тираж закрыт"
              )}
            </h2>
            <div className="flex flex-col gap-4 text-[13px] lg:text-[16px]">
              <div className="flex justify-between items-center">
                <span className="text-[#737373] font-medium">Дата тиража:</span>
                <span className="text-[#4B4B4B] font-bold">
                  {currentDraw?.drawDateHuman || "-"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#737373] font-medium">
                  Суперприз от:
                </span>
                <span className="text-[#4B4B4B] font-bold">
                  {currentDraw?.jackpotAmountDisplay || "-"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#737373] font-medium">Место:</span>
                <span className="text-[#4B4B4B] font-bold">
                  {currentDraw?.location || "Бишкек"}
                </span>
              </div>
            </div>
          </div>

          <div className="relative h-32.5 sm:h-37.5 lg:h-45 rounded-3xl lg:rounded-4xl overflow-hidden flex flex-col items-center justify-center shadow-sm">
            {/* 🔥 ДИНАМИЧЕСКИЙ ФОН ТАЙМЕРА */}
            <Image
              src={
                metaAssets?.timerBackgroundImage ||
                "/images/draw-tickets/timer-block-bg.png"
              }
              alt="Timer Background"
              fill
              unoptimized
              className="object-cover z-0"
            />
            <div className="relative z-10 flex flex-col items-center w-full px-4 text-white">
              <span className="text-[16px] lg:text-[22px] font-bold mb-3">
                До розыгрыша
              </span>

              <DrawTimer
                drawDate={currentDraw?.drawDate}
                drawTime={currentDraw?.drawTime}
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT TABS --- */}
      {activeTab === "tickets" && (
        <div className="mt-12 lg:mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-3xl" />
              ))
            ) : !currentDraw ? (
              <div className="col-span-full text-center py-20 bg-white rounded-3xl">
                Тираж закрыт
              </div>
            ) : availableTickets.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-white rounded-3xl">
                Билеты раскуплены
              </div>
            ) : (
              availableTickets.map((ticket: TicketDto) => {
                const cartId = ticket.shortId || ticket.ticketId;
                const numbers = getTicketNumbers(ticket);
                const gridCount = ticket.combinations?.length ?? 1;
                const span = gridCount >= 2 ? "md:col-span-2" : "";
                return (
                  <div key={ticket.ticketId} className={span}>
                    <DrawTicketCard
                      ticketNumber={ticket.ticketNumber}
                      price={ticket.price}
                      selectedNumbers={numbers}
                      combinations={ticket.combinations}
                      maxNumber={game?.maxNumber}
                      gridCols={game?.gridCols}
                      isInBasket={basketIds.includes(cartId)}
                      onToggle={() =>
                        toggleItem({
                          id: cartId,
                          price: ticket.price,
                          type: "other",
                          ticketNumber: ticket.ticketNumber,
                          combination: numbers,
                          lotteryId,
                          drawId: currentDraw.drawId,
                          name: `Тираж №${currentDraw.drawNumber}`,
                        })
                      }
                    />
                  </div>
                );
              })
            )}
          </div>
          <WinnersSlider title="История победителей" lotteryId={lotteryId} />
        </div>
      )}

      {activeTab === "rules" && (
        <div className="mt-12 lg:mt-16 text-gray-500 py-10">
          <DrawRulesBlock rules={rules} />
          <PopularTicketsWidget
            title="Другие лотереи"
            currentLotteryId={lotteryId}
          />
        </div>
      )}

      {activeTab === "archive" && (
        <div className="mt-12 lg:mt-16 text-center text-gray-500 py-10">
          <DrawArchiveBlock lotteryId={lotteryId} />
        </div>
      )}

      <CartDrawer />
    </>
  );
};
