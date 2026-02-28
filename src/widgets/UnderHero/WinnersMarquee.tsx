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
}

// 🔥 Вспомогательная функция для парсинга суммы из строки "10 000" в число 10000
const parseAmount = (amountStr: string) => {
  // Убираем все пробелы и преобразуем в число
  return Number(amountStr.replace(/\s+/g, ''));
};

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
      console.warn('Audio playback failed (usually iOS restriction):', error);
    });
  };

  const handleClick = () => {
    setBgIndex(Math.floor(Math.random() * 4) + 1);
    if (!isActive) {
      playRipSound();
    }
    onClick();
  };

  // 🔥 Вычисляем числовое значение суммы
  const numericAmount = parseAmount(winner.amount);
  
  // 🔥 Определяем цвет на основе ТЗ дизайнера
  // Если меньше 10000 -> серый (#4b4b4b)
  // Иначе -> желтый или оранжевый в зависимости от isYellow
  const amountColorClass = 
    numericAmount < 10000 
      ? 'text-[#4b4b4b]' 
      : (winner.isYellow ? 'text-[#FFD600]' : 'text-[#E97625]');

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
        className='object-cover pointer-events-none'
      />

      <div className='absolute inset-0 opacity-10 pointer-events-none'>
        <img
          src={winner.logo}
          alt='logo'
          className='w-full h-full object-contain'
        />
      </div>

      <div className='relative z-10 text-center'>
        <div className='text-base font-medium text-[#4b4b4b]'>
          {winner.name}
        </div>

        <div
          className={clsx(
            'text-4xl font-black flex items-end justify-center gap-1 my-3',
            amountColorClass // 🔥 Применяем вычисленный цвет
          )}
        >
          {winner.amount}
          <span className='text-2xl underline'>{winner.currency}</span>
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
    <div className='overflow-hidden relative'>
      <div className='marquee flex'>
        {duplicated.map((winner, idx) => (
          <div
            key={`${winner.id}-${idx}`}
            className={clsx(
              'transition-all duration-300 flex-shrink-0 h-[185px]',
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