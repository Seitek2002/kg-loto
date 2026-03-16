'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

export interface WinnerType {
  id: number;
  name: string;
  date: string;
  amount: string;
  currency: string;
  logo: string;
  isYellow: boolean;
  isTextPrize?: boolean; // 🔥 Добавили новый флаг
}

// Парсер теперь не нужен для цвета, так как мы определяем цвет по флагу isYellow

const TearableTicket = ({
  winner,
  isActive,
  onClick,
  audioRefs,
}: {
  winner: WinnerType;
  isActive: boolean;
  onClick: () => void;
  audioRefs: React.MutableRefObject<HTMLAudioElement[]>;
}) => {
  const [bgIndex, setBgIndex] = useState(0);

  const playRipSound = () => {
    if (audioRefs.current.length === 0) return;

    const randomIndex = Math.floor(Math.random() * 4);
    const originalAudio = audioRefs.current[randomIndex];

    const soundClone = originalAudio.cloneNode() as HTMLAudioElement;
    soundClone.volume = 0.3;

    soundClone.play().catch((error) => {
      console.warn('Audio playback failed:', error);
    });
  };

  const handleClick = () => {
    setBgIndex(Math.floor(Math.random() * 4) + 1);
    if (!isActive) {
      playRipSound();
    }
    onClick();
  };

  // Цвет суммы зависит от флага isYellow
  const amountColorClass = winner.isYellow
    ? 'text-[#FFD600]'
    : 'text-[#E97625]';

  return (
    <div
      onMouseEnter={handleClick}
      className={clsx(
        // Убрал overflow-hidden отсюда, так как он ломал тень билета
        'relative flex items-center justify-center w-full h-full cursor-pointer transition-transform duration-300 transform-gpu',
        isActive ? 'scale-105' : 'scale-100',
      )}
    >
      <Image
        src={`/tickets/ticket-${bgIndex}.png`}
        alt='ticket'
        fill
        className='object-cover pointer-events-none'
      />

      {/* 🔥 Жестко ограничиваем контейнер логотипа, чтобы он не вылазил за края билета */}
      <div className='absolute left-4 right-4 top-4 bottom-4 opacity-10 pointer-events-none flex items-center justify-center overflow-hidden'>
        <img
          src={winner.logo}
          alt='logo'
          className='w-full h-full object-contain'
        />
      </div>

      <div className='relative z-10 text-center px-4 w-full'>
        <div className='text-base font-medium text-[#4b4b4b] truncate'>
          {winner.name}
        </div>

        <div
          className={clsx(
            'flex items-end justify-center gap-1 my-3 font-black uppercase line-clamp-2',
            amountColorClass,
            // Если текст длинный (вещевой приз), делаем шрифт меньше, чтобы влезло
            winner.isTextPrize ? 'text-2xl leading-tight' : 'text-4xl',
          )}
        >
          {winner.amount}
          {winner.currency && (
            <span className='text-2xl underline'>{winner.currency}</span>
          )}
        </div>

        <div className='text-sm text-[#4b4b4b]'>{winner.date}</div>
      </div>
    </div>
  );
};

export const WinnersMarquee = ({ winners }: { winners: WinnerType[] }) => {
  const duplicated = [...winners, ...winners];
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const audioRefs = useRef<HTMLAudioElement[]>([]);

  useEffect(() => {
    audioRefs.current = [1, 2, 3, 4].map((i) => {
      const audio = new Audio(`/paper-rip/paper-rip-${i}.mp3`);
      audio.preload = 'auto';
      return audio;
    });
  }, []);

  return (
    <div className='relative'>
      <div className='marquee flex py-4'>
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
              audioRefs={audioRefs}
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        .marquee {
          animation: scroll 10s linear infinite;
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
