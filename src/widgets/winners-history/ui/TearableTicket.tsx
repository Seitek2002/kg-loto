"use client";

import { useState } from "react";

import Image from "next/image";

import { clsx } from "clsx";

import { WinnerType } from "@/entities/winner/model/types";

interface TearableTicketProps {
  winner: WinnerType;
  isActive: boolean;
  onClick: () => void;
  audioRefs: React.MutableRefObject<HTMLAudioElement[]>;
}

export const TearableTicket = ({
  winner,
  isActive,
  onClick,
  audioRefs,
}: TearableTicketProps) => {
  const [bgIndex, setBgIndex] = useState(0);

  const playRipSound = () => {
    if (audioRefs.current.length === 0) return;
    const randomIndex = Math.floor(Math.random() * 4);
    const originalAudio = audioRefs.current[randomIndex];
    const soundClone = originalAudio.cloneNode() as HTMLAudioElement;
    soundClone.volume = 0.3;
    soundClone.play().catch((e) => console.warn("Audio play failed:", e));
  };

  const handleClick = () => {
    setBgIndex(Math.floor(Math.random() * 4) + 1);
    if (!isActive) playRipSound();
    onClick();
  };

  const amountColorClass = winner.isYellow
    ? "text-[#FFD600]"
    : "text-[#E97625]";

  return (
    <div
      onMouseEnter={handleClick}
      className={clsx(
        "relative flex items-center justify-center w-full h-full cursor-pointer transition-transform duration-300 transform-gpu",
        isActive ? "scale-105" : "scale-100",
      )}
    >
      <Image
        src={`/tickets/ticket-${bgIndex}.png`}
        alt="ticket"
        fill
        sizes="320px"
        className="object-cover pointer-events-none"
      />

      <div className="absolute left-4 right-4 top-4 bottom-4 opacity-10 pointer-events-none flex items-center justify-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={winner.logo}
          alt="logo"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="relative z-10 text-center px-4 w-full">
        <div className="text-base font-medium text-[#4b4b4b] truncate">
          {winner.name}
        </div>

        <div
          className={clsx(
            "flex items-end justify-center gap-1 my-3 font-black uppercase line-clamp-2",
            amountColorClass,
            winner.isTextPrize ? "text-2xl leading-tight" : "text-4xl",
          )}
        >
          {winner.amount}
          {winner.currency && (
            <span className="text-2xl underline">{winner.currency}</span>
          )}
        </div>

        <div className="text-sm text-[#4b4b4b]">{winner.date}</div>
      </div>
    </div>
  );
};
