'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useState, useCallback } from 'react';

// Вынесли тип, чтобы TS не ругался
export interface WinnerType {
  id: number;
  name: string;
  date: string;
  amount: string;
  currency: string;
  logo: string;
  isYellow: boolean;
}

const TearableTicket = ({
  winner,
  isActive,
  onClick,
}: {
  winner: WinnerType;
  isActive: boolean;
  onClick: () => void;
}) => {
  const [bgIndex, setBgIndex] = useState(0);

  const playRipSound = useCallback(() => {
    const randomSoundIndex = Math.floor(Math.random() * 4) + 1;
    const audioPath = `/paper-rip/paper-rip-${randomSoundIndex}.mp3`;
    const audio = new Audio(audioPath);
    audio.volume = 0.5;

    audio.play().catch((error) => {
      console.warn('Audio playback failed:', error);
    });
  }, []);

  const handleClick = () => {
    setBgIndex(Math.floor(Math.random() * 4) + 1);
    if (!isActive) {
      playRipSound();
    }
    onClick();
  };

  return (
    <div
      onClick={handleClick}
      className={clsx(
        'relative flex items-center justify-center w-full h-full cursor-pointer transition-transform duration-300 transform-gpu',
        isActive ? 'scale-105' : 'scale-100',
      )}
    >
      <Image
        src={`/tickets/ticket-${bgIndex}.png`}
        alt='ticket'
        fill
        className='object-contain pointer-events-none'
      />

      <div className='absolute inset-0 opacity-10 pointer-events-none'>
        <img
          src={winner.logo}
          alt='logo'
          className='w-full h-full object-contain'
        />
      </div>

      <div className='relative z-10 text-center'>
        <div className='text-sm font-bold'>{winner.date}</div>

        <div
          className={clsx(
            'text-4xl font-black flex items-end justify-center gap-1',
            winner.isYellow ? 'text-[#FFD600]' : 'text-[#E97625]',
          )}
        >
          {winner.amount}
          <span className='text-2xl underline'>{winner.currency}</span>
        </div>

        <div className='text-sm font-bold'>{winner.name}</div>
      </div>
    </div>
  );
};

// Главный клиентский компонент, который принимает данные от сервера
export const WinnersMarquee = ({ winners }: { winners: WinnerType[] }) => {
  const duplicated = [...winners, ...winners];
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className='overflow-hidden relative'>
      <div className='marquee flex'>
        {duplicated.map((winner, idx) => (
          <div
            key={`${winner.id}-${idx}`}
            className={clsx(
              'transition-all duration-300 flex-shrink-0 h-[149px]',
              activeIndex === idx ? 'min-w-[320px]' : 'min-w-[272px]',
            )}
          >
            <TearableTicket
              winner={winner}
              isActive={activeIndex === idx}
              onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        .marquee {
          animation: scroll 30s linear infinite;
        }
        .marquee:hover {
          animation-play-state: paused;
        }
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};
