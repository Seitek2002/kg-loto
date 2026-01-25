'use client';

import Image from 'next/image';
import Link from 'next/link';
import { clsx } from 'clsx';

export interface ArticleCardProps {
  id: number;
  title: string;
  description?: string;
  buttonText: string;
  imageSrc?: string;

  // --- Настройки внешнего вида ---
  // 'dark' = темный текст (для светлых фонов)
  // 'light' = белый текст (для темных/цветных фонов)
  theme: 'dark' | 'light';

  // Где стоит кнопка?
  buttonAlign: 'center' | 'left';

  // Где стоит описание?
  descriptionPosition?: 'top' | 'bottom';
}

export const ArticleCard = ({
  title,
  description,
  buttonText,
  imageSrc,
  theme,
  buttonAlign,
  descriptionPosition = 'bottom', // по дефолту снизу
}: ArticleCardProps) => {
  // Базовые цвета текста
  const titleColor = theme === 'dark' ? 'text-[#1F1F1F]' : 'text-white';
  const descColor = theme === 'dark' ? 'text-[#4B4B4B]' : 'text-white/90';

  // Цвет кнопки
  const btnClass =
    theme === 'dark'
      ? 'bg-[#F0F0F0] text-black hover:bg-[#E5E5E5]'
      : 'bg-white text-black hover:bg-white/90';

  return (
    <div className='relative w-full h-[460px] rounded-[32px] p-8 flex flex-col justify-between overflow-hidden bg-white border border-gray-100/50 shadow-sm transition-transform hover:scale-[1.01]'>
      {/* 1. ФОНОВАЯ КАРТИНКА (Если есть) */}
      {imageSrc && (
        <>
          <Image
            src={imageSrc}
            alt={title}
            fill
            className='object-cover z-0'
            sizes='(max-width: 768px) 100vw, 33vw'
          />
          {/* Легкое затемнение для белого текста, если нужно */}
          {theme === 'light' && (
            <div className='absolute inset-0 bg-black/20 z-0' />
          )}
        </>
      )}

      {/* 2. КОНТЕНТ (Z-10 поверх картинки) */}

      {/* ВЕРХНЯЯ ЧАСТЬ: Заголовок + (опционально) Описание */}
      <div className='relative z-10 flex flex-col gap-4'>
        <h3
          className={clsx(
            'text-xl font-black font-benzin uppercase leading-tight',
            titleColor,
          )}
        >
          {title}
        </h3>

        {/* Если описание должно быть сверху (как на синей карточке) */}
        {description && descriptionPosition === 'top' && (
          <p
            className={clsx(
              'text-sm font-medium font-rubik leading-relaxed max-w-[90%]',
              descColor,
            )}
          >
            {description}
          </p>
        )}
      </div>

      {/* НИЖНЯЯ ЧАСТЬ: (опционально) Описание + Кнопка */}
      <div
        className={clsx(
          'relative z-10 flex flex-col gap-6',
          buttonAlign === 'center' ? 'items-center' : 'items-start',
        )}
      >
        {/* Если описание должно быть снизу (как на белой карточке) */}
        {description && descriptionPosition === 'bottom' && (
          <p
            className={clsx(
              'text-sm font-medium font-rubik leading-relaxed',
              descColor,
            )}
          >
            {description}
          </p>
        )}

        <Link href='#' className='w-full sm:w-auto'>
          <button
            className={clsx(
              'px-8 py-4 rounded-full font-benzin font-bold text-xs uppercase tracking-wider shadow-lg transition-all active:scale-95',
              btnClass,
              buttonAlign === 'center'
                ? 'w-full sm:w-auto'
                : 'w-full sm:w-auto',
            )}
          >
            {buttonText}
          </button>
        </Link>
      </div>
    </div>
  );
};
