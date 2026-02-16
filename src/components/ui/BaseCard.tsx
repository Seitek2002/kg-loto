'use client';

import Image from 'next/image';
import { ReactNode } from 'react';
import { clsx } from 'clsx';

// import { Player } from '@lottiefiles/react-lottie-player';
import dynamic from 'next/dynamic';
import { BACKGROUND_VARIANTS } from '@/config/lottery-styles';

const LottiePlayer = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
  { ssr: false },
);

interface BaseCardProps {
  children: ReactNode;
  backgroundId?: string;
  imageSrc?: string;
  lottieSrc?: string;
  className?: string;
  // minHeight?: string;
  theme?: 'dark' | 'white';
  aspectRatio?: string;
}

export const BaseCard = ({
  children,
  backgroundId,
  imageSrc,
  lottieSrc,
  className,
  theme = 'dark',
  aspectRatio = '4/3',
}: BaseCardProps) => {
  const textColor = theme === 'dark' ? 'text-[#2D2D2D]' : 'text-white';

  const bgPath = imageSrc
    ? imageSrc
    : backgroundId
      ? BACKGROUND_VARIANTS[backgroundId] || BACKGROUND_VARIANTS['default']
      : null;

  return (
    <div
      className={clsx(
        'relative w-full rounded-4xl flex flex-col shadow-xl overflow-hidden',
        !bgPath && !lottieSrc && 'bg-gray-200',
        textColor,
        className,
      )}
      style={{ aspectRatio }}
    >
      {/* 🔥 2. НОВЫЙ LOTTIE ПЛЕЕР С SVG РЕНДЕРОМ */}
      {lottieSrc ? (
        <div className='absolute top-0 right-0 z-0 w-full'>
          <LottiePlayer
            src={lottieSrc}
            loop
            autoplay
            renderer='svg' // <--- Вместо canvas используем svg
            style={{ width: '100%', height: 'auto' }}
            rendererSettings={{
              preserveAspectRatio: 'xMidYMid slice', // Это аналог object-fit: cover для Lottie
            }}
          />
        </div>
      ) : (
        /* СТАТИЧНАЯ КАРТИНКА (Если нет анимации) */
        bgPath && (
          <>
            <Image
              src={bgPath}
              alt='card background'
              fill
              className='z-0 object-cover'
              priority
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
          </>
        )
      )}

      {/* Затемнение для светлой темы */}
      {(bgPath || lottieSrc) && theme === 'white' && (
        <div className='absolute inset-0 bg-black/10 z-0' />
      )}

      <div className='relative z-10 flex flex-col flex-1 h-full'>
        {children}
      </div>
    </div>
  );
};
