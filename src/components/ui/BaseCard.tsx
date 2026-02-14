// src/components/ui/BaseCard.tsx
import Image from 'next/image';
import { ReactNode } from 'react';
import { clsx } from 'clsx';
import { DotLottieReact } from '@lottiefiles/dotlottie-react'; // 🔥 Импорт Lottie плеера
import { BACKGROUND_VARIANTS } from '@/config/lottery-styles';

interface BaseCardProps {
  children: ReactNode;
  backgroundId?: string;
  imageSrc?: string;
  lottieSrc?: string; // 🔥 Новый проп для анимации
  className?: string;
  minHeight?: string;
  theme?: 'dark' | 'white';
}

export const BaseCard = ({
  children,
  backgroundId,
  imageSrc,
  lottieSrc,
  className,
  minHeight = '320px',
  theme = 'dark',
}: BaseCardProps) => {
  const textColor = theme === 'dark' ? 'text-[#2D2D2D]' : 'text-white';

  const bgPath = imageSrc 
    ? imageSrc 
    : (backgroundId ? BACKGROUND_VARIANTS[backgroundId] || BACKGROUND_VARIANTS['default'] : null);

  return (
    <div
      className={clsx(
        'relative w-full rounded-4xl p-6 flex flex-col shadow-xl overflow-hidden',
        !bgPath && !lottieSrc && 'bg-gray-200',
        textColor,
        className,
      )}
      style={{ height: minHeight }}
    >
      {/* 🔥 1. АНИМАЦИЯ (Приоритет) */}
      {lottieSrc ? (
        <div className="absolute inset-0 z-0">
          <DotLottieReact
            src={lottieSrc}
            loop
            autoplay
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      ) : (
        /* 2. СТАТИЧНАЯ КАРТИНКА (Если нет анимации) */
        bgPath && (
          <>
            <Image
              src={bgPath}
              alt='card background'
              fill
              className='z-0 object-cover'
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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