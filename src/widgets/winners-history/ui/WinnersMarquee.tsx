"use client";

import { useEffect, useRef, useState } from "react";

import { clsx } from "clsx";

import { WinnerType } from "@/entities/winner/model/types";

import { TearableTicket } from "./TearableTicket";

export const WinnersMarquee = ({ winners }: { winners: WinnerType[] }) => {
  const duplicated = [...winners, ...winners];
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const audioRefs = useRef<HTMLAudioElement[]>([]);

  useEffect(() => {
    audioRefs.current = [1, 2, 3, 4].map((i) => {
      const audio = new Audio(`/paper-rip/paper-rip-${i}.mp3`);
      audio.preload = "auto";
      return audio;
    });
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      {/* 🔥 Заменили <style jsx> на inline styles, чтобы не было конфликтов в App Router */}
      <style suppressHydrationWarning>{`
        .winners-marquee-track {
          animation: winners-scroll 10s linear infinite;
        }
        .winners-marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes winners-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>

      <div className="winners-marquee-track flex py-4">
        {duplicated.map((winner, idx) => (
          <div
            key={`${winner.id}-${idx}`}
            className={clsx(
              "transition-all duration-300 shrink-0 h-37.25",
              activeIndex === idx ? "min-w-[320px]" : "min-w-68",
            )}
          >
            <TearableTicket
              winner={winner}
              isActive={activeIndex === idx}
              onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
              audioRefs={audioRefs}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
