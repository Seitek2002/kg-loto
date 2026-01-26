'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import { clsx } from 'clsx';

interface BaseCardProps {
  children: ReactNode;
  // Визуальные настройки
  gradientFrom?: string;
  gradientTo?: string;
  imageSrc?: string;
  className?: string; // Для доп. отступов если надо
  minHeight?: string;
  theme?: 'dark' | 'white'; // Чтобы управлять цветом текста внутри
}

export const BaseCard = ({
  children,
  gradientFrom = 'from-gray-100',
  gradientTo = 'to-gray-200',
  imageSrc,
  className,
  minHeight = '320px',
  theme = 'dark',
}: BaseCardProps) => {
  const textColor = theme === 'dark' ? 'text-[#2D2D2D]' : 'text-white';

  return (
    <div
      className={clsx(
        'relative w-full rounded-4xl p-6 flex flex-col shadow-xl overflow-hidden',
        !imageSrc && `bg-linear-to-br ${gradientFrom} ${gradientTo}`,
        textColor,
        className,
      )}
      style={{ minHeight }}
    >
      {/* Фоновая картинка (если есть) */}
      {imageSrc && (
        <>
          <Image src={imageSrc} alt='' fill className='object-cover z-0' />
          {/* Затемнение, если текст белый */}
          {theme === 'white' && (
            <div className='absolute inset-0 bg-black/40 z-0' />
          )}
        </>
      )}

      {/* Контент поверх фона */}
      <div className='relative z-10 flex flex-col flex-1 h-full'>
        {children}
      </div>
    </div>
  );
};
