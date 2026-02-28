'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useState, useCallback } from 'react';

const RECENT_WINNERS = [
  {
    id: 1,
    name: 'Азамат Д.',
    date: 'Сегодня',
    amount: '700',
    currency: 'С',
    logo: '/lotteries-logo/1.png',
    isYellow: false,
  },
  {
    id: 2,
    name: 'Айнура С.',
    date: 'Сегодня',
    amount: '7 105 000',
    currency: 'С',
    logo: '/lotteries-logo/2.png',
    isYellow: false,
  },
  {
    id: 3,
    name: 'Бектур А.',
    date: 'Вчера',
    amount: '700 000',
    currency: 'С',
    logo: '/lotteries-logo/3.png',
    isYellow: true,
  },
  {
    id: 4,
    name: 'Нурлан К.',
    date: 'Вчера',
    amount: '3 000',
    currency: 'С',
    logo: '/lotteries-logo/1.png',
    isYellow: false,
  },
  {
    id: 5,
    name: 'Гульзат М.',
    date: 'Вчера',
    amount: '6 700',
    currency: 'С',
    logo: '/lotteries-logo/2.png',
    isYellow: true,
  },
  {
    id: 6,
    name: 'Руслан Т.',
    date: 'Сегодня',
    amount: '15 000',
    currency: 'С',
    logo: '/lotteries-logo/3.png',
    isYellow: false,
  },
  {
    id: 7,
    name: 'Эрмек Б.',
    date: 'Вчера',
    amount: '50 000',
    currency: 'С',
    logo: '/lotteries-logo/1.png',
    isYellow: false,
  },
];

const TearableTicket = ({
  winner,
  isActive,
  onClick,
}: {
  winner: (typeof RECENT_WINNERS)[number];
  isActive: boolean;
  onClick: () => void;
}) => {
  const [bgIndex, setBgIndex] = useState(0);

  // 🔥 Функция для проигрывания рандомного звука
  const playRipSound = useCallback(() => {
    // 1. Выбираем случайное число от 1 до 4
    const randomSoundIndex = Math.floor(Math.random() * 4) + 1;
    // 2. Формируем путь к файлу (согласно твоему скрину структуры папок)
    const audioPath = `/paper-rip/paper-rip-${randomSoundIndex}.mp3`;

    // 3. Создаем объект Audio и запускаем
    const audio = new Audio(audioPath);

    // Слегка уменьшаем громкость, чтобы звук не "бил" по ушам
    audio.volume = 0.5;

    // Запускаем звук (игнорируем ошибки, если браузер блокирует автоплей до взаимодействия)
    audio.play().catch((error) => {
      console.warn('Audio playback failed:', error);
    });
  }, []);

  const handleClick = () => {
    // Меняем фон на один из рваных (от 1 до 4)
    setBgIndex(Math.floor(Math.random() * 4) + 1);

    // Проигрываем звук ТОЛЬКО если билет еще не оторван (чтобы не спамить звуком при повторном клике на активный билет)
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

const UnderHero = () => {
  const duplicated = [...RECENT_WINNERS, ...RECENT_WINNERS];
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className='max-w-300 mx-auto px-4 relative mt-12 overflow-hidden'>
      <h2 className='text-2xl md:text-3xl font-black font-benzin uppercase text-[#1C2035] mb-8'>
        Недавние победители
      </h2>

      <div className='overflow-hidden relative'>
        <div className='marquee flex'>
          {duplicated.map((winner, idx) => (
            <div
              key={idx}
              className={clsx(
                'transition-all duration-300 flex-shrink-0 h-[149px]',
                activeIndex === idx ? 'min-w-[320px]' : 'min-w-[272px]',
              )}
            >
              <TearableTicket
                winner={winner}
                isActive={activeIndex === idx}
                onClick={() => setActiveIndex(idx)} // Если хочешь, чтобы повторный клик возвращал билет на место: setActiveIndex(activeIndex === idx ? null : idx)
              />
            </div>
          ))}
        </div>
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
    </section>
  );
};

export default UnderHero;
