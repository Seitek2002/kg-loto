import Image from 'next/image';
import { ReactNode } from 'react';
import { clsx } from 'clsx';
import { BACKGROUND_VARIANTS } from '@/config/lottery-styles';

interface BaseCardProps {
  children: ReactNode;
  backgroundId?: string; // Локальный ID (fallback)
  imageSrc?: string; // 🔥 Ссылка с сервера (приоритет)
  className?: string;
  minHeight?: string;
  theme?: 'dark' | 'white';
}

export const BaseCard = ({
  children,
  backgroundId,
  imageSrc,
  className,
  minHeight = '320px',
  theme = 'dark',
}: BaseCardProps) => {
  const textColor = theme === 'dark' ? 'text-[#2D2D2D]' : 'text-white';

  // 🔥 ЛОГИКА ИЗМЕНЕНА: Сначала проверяем imageSrc, потом backgroundId
  const bgPath = imageSrc
    ? imageSrc
    : backgroundId
      ? BACKGROUND_VARIANTS[backgroundId] || BACKGROUND_VARIANTS['default']
      : null;

  return (
    <div
      className={clsx(
        'relative w-full rounded-[32px] p-6 flex flex-col shadow-xl overflow-hidden', // поправил rounded-4xl на стандартный rounded-[32px] если tailwind ругается
        !bgPath && 'bg-gray-200',
        textColor,
        className,
      )}
      style={{ height: minHeight }}
    >
      {/* ФОНОВАЯ КАРТИНКА */}
      {bgPath && (
        <>
          <Image
            src={bgPath}
            alt='card background'
            fill
            className='z-0 object-cover' // object-cover лучше заполняет контейнер
            priority
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' // Оптимизация загрузки
          />

          {theme === 'white' && (
            <div className='absolute inset-0 bg-black/10 z-0' />
          )}
        </>
      )}

      <div className='relative z-10 flex flex-col flex-1 h-full'>
        {children}
      </div>
    </div>
  );
};
