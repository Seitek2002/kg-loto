"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  CurrentLotteryDto,
  useCurrentLotteries,
} from "@/entities/lottery/api/lotteryClientApi";
import { useCurrentDraw } from "@/entities/ticket/api/ticketApi";

import { cn } from "@/shared/lib/utils";

type CountdownState = "loading" | "default" | "urgent" | "finished";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Склонение единиц времени: 1 день / 2 дня / 5 дней
const plural = (n: number, forms: [string, string, string]) => {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return forms[0];
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return forms[1];
  return forms[2];
};

const pad = (n: number) => String(n).padStart(2, "0");

const useCountdown = (targetIso: string | null) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!targetIso) return;
    const target = new Date(targetIso).getTime();

    const tick = () => {
      const ms = target - Date.now();
      if (ms <= 0) {
        setIsFinished(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setIsFinished(false);
      setTimeLeft({
        days: Math.floor(ms / 86400000),
        hours: Math.floor((ms % 86400000) / 3600000),
        minutes: Math.floor((ms % 3600000) / 60000),
        seconds: Math.floor((ms % 60000) / 1000),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetIso]);

  return { timeLeft, isFinished };
};

const TimerTile = ({
  value,
  label,
  isDays,
  isUrgent,
}: {
  value: number;
  label: string;
  isDays?: boolean;
  isUrgent: boolean;
}) => {
  if (isDays && isUrgent) return null;

  return (
    <div className="bg-[#EAF5FE] border border-[#B8DFFB] rounded-xl w-24 py-4 flex flex-col items-center">
      <div
        className={cn(
          "font-benzin font-black text-[38px] leading-none tabular-nums",
          isUrgent || isDays ? "text-[#F08000]" : "text-[#13223F]",
        )}
      >
        {pad(value)}
      </div>
      <div className="text-[12px] text-[#5A6B85] mt-1.5">{label}</div>
    </div>
  );
};

export const HeroCountdownBlock = () => {
  const { data: lotteries, isLoading: isLotteriesLoading } =
    useCurrentLotteries();

  const firstLottery: CurrentLotteryDto | undefined = lotteries?.[0];

  const { data: drawData, isLoading: isDrawLoading } = useCurrentDraw(
    firstLottery?.lotteryId || "",
  );
  const draw = drawData?.draw;

  const targetIso =
    draw?.drawDate && draw?.drawTime
      ? `${draw.drawDate}T${draw.drawTime}`
      : null;

  const { timeLeft, isFinished } = useCountdown(targetIso);

  const isLoading = isLotteriesLoading || (!!firstLottery && isDrawLoading);

  const state: CountdownState = isLoading
    ? "loading"
    : isFinished
      ? "finished"
      : timeLeft.days === 0
        ? "urgent"
        : "default";

  // Нет активных тиражных лотерей — блоку показывать нечего
  if (!isLoading && !firstLottery) return null;

  const info = firstLottery?.lotteryInfo;
  const prizeText = info?.prizeText || "-";
  const lotteryHref = `/draw-tickets`;

  const title =
    state === "finished"
      ? "Первый тираж состоялся!"
      : state === "urgent"
        ? "Розыгрыш уже сегодня!"
        : "До розыгрыша первого тиража осталось";

  return (
    <section className="max-w-[1160px] mx-auto px-4 py-4">
      <div className="bg-white border border-[#DCE6F2] rounded-2xl px-4 py-10 sm:px-7 text-center">
        <span className="inline-block bg-[#FFF7DB] border border-[#FBC600] rounded-full px-4 py-1 text-[12px] font-semibold text-[#8A6D00] tracking-wide uppercase mb-4">
          Первый тираж
        </span>

        {isLoading ? (
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-7 w-3/4 max-w-100 bg-gray-200 rounded-lg" />
            <div className="h-5 w-1/2 max-w-70 bg-gray-200 rounded-lg" />
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="w-24 h-19.5 bg-gray-200 rounded-xl"
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            <h2 className="font-benzin text-[22px] sm:text-[28px] font-bold text-[#13223F] leading-tight mb-1.5">
              {title}
            </h2>

            {state === "finished" ? (
              <p className="text-[16px] text-[#5A6B85] mb-6">
                Первый тираж состоялся!{" "}
                <Link
                  href="/winners"
                  className="text-[#2EA6F7] font-semibold hover:underline"
                >
                  Смотреть результаты и видео розыгрыша
                </Link>
              </p>
            ) : (
              <>
                <p className="text-[16px] text-[#5A6B85] mb-6">
                  Суперприз —{" "}
                  <strong className="text-[#F08000] text-[22px] font-bold whitespace-nowrap">
                    {prizeText}
                  </strong>
                </p>

                <div
                  className="flex justify-center gap-3 mb-7 flex-wrap"
                  role="timer"
                  aria-live="off"
                  aria-label="Время до розыгрыша"
                >
                  <TimerTile
                    value={timeLeft.days}
                    label={plural(timeLeft.days, ["день", "дня", "дней"])}
                    isDays
                    isUrgent={state === "urgent"}
                  />
                  <TimerTile
                    value={timeLeft.hours}
                    label={plural(timeLeft.hours, ["час", "часа", "часов"])}
                    isUrgent={state === "urgent"}
                  />
                  <TimerTile
                    value={timeLeft.minutes}
                    label={plural(timeLeft.minutes, [
                      "минута",
                      "минуты",
                      "минут",
                    ])}
                    isUrgent={state === "urgent"}
                  />
                  <TimerTile
                    value={timeLeft.seconds}
                    label={plural(timeLeft.seconds, [
                      "секунда",
                      "секунды",
                      "секунд",
                    ])}
                    isUrgent={state === "urgent"}
                  />
                </div>
              </>
            )}

            <div className="flex justify-center items-center gap-4 flex-wrap">
              <Link
                href={lotteryHref}
                className="inline-block bg-[#F08000] hover:bg-[#D97300] active:scale-[0.98] text-white text-[17px] font-semibold px-10 py-3.5 rounded-[10px] transition-all"
              >
                Купить билет за {firstLottery?.ticketPrice ?? 100} сом
              </Link>
              <span className="text-[13px] text-[#5A6B85]">
                📲 Билет придёт на WhatsApp
              </span>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
