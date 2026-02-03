import Image from 'next/image';
import { ReactNode } from 'react';
import { clsx } from 'clsx';
import { BACKGROUND_VARIANTS } from '@/config/lottery-styles';

interface BaseCardProps {
  children: ReactNode;
  backgroundId?: string; // Приходит с бека (например "red-gradient")
  imageSrc?: string; // Для обратной совместимости (если картинка задана url)

  // Старые градиенты можно оставить как fallback, или удалить
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

  const bgPath = backgroundId
    ? BACKGROUND_VARIANTS[backgroundId] || BACKGROUND_VARIANTS['default']
    : imageSrc;

  return (
    <div
      className={clsx(
        'relative w-full rounded-4xl p-6 flex flex-col shadow-xl overflow-hidden',
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
            className='z-0 object-center object-fill'
            priority
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
