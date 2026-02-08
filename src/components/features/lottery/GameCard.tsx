'use client';

import { Clock } from 'lucide-react';
import { clsx } from 'clsx';
import { BaseCard } from '@/components/ui/BaseCard';
import { FONT_VARIANTS } from '@/config/lottery-styles';

// --- ТИПЫ ---
type CardStatus = 'winning' | 'losing' | 'pending' | 'archive';
type CardVariant = 'lottery' | 'prize';

interface LotteryCardProps {
  // Контент
  title: string;
  description?: string;
  prize: string;
  price?: number; // Цена (для покупки)
  time?: string; // Время тиража

  // Дизайн
  backgroundId?: string;
  prizeFontId?: string;
  theme?: 'white' | 'dark';

  // Состояние (для уже купленных билетов)
  ticketStatus?: CardStatus;
  variant?: CardVariant;
}

// --- КОНФИГ СТАТУСОВ ---
const STATUS_CONFIG: Record<
  CardStatus,
  { text: string; dot: string; textCol: string }
> = {
  winning: {
    text: 'ВЫИГРЫШ',
    dot: 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]',
    textCol: 'text-green-600',
  },
  losing: {
    text: 'БЕЗ ВЫИГРЫША',
    dot: 'bg-red-500',
    textCol: 'text-red-500',
  },
  pending: {
    text: 'ОЖИДАЕТ ТИРАЖА',
    dot: 'bg-blue-500 animate-pulse',
    textCol: 'text-blue-500',
  },
  archive: {
    text: 'АРХИВ',
    dot: 'bg-gray-400',
    textCol: 'text-gray-500',
  },
};

export function LotteryCard({
  title,
  description,
  price,
  prize,
  time,

  backgroundId,
  prizeFontId = 'default',
  theme = 'white',

  ticketStatus,
  variant = 'lottery',
}: LotteryCardProps) {
  const isDark = theme === 'dark';

  // Цветовые схемы в зависимости от темы
  const colors = {
    title: isDark ? 'text-[#1F1F1F]' : 'text-white',
    desc: isDark ? 'text-[#4B4B4B]' : 'text-white/80',
    prize: isDark ? 'text-[#1F1F1F]' : 'text-white drop-shadow-md',
    button: isDark
      ? 'bg-[#1F1F1F] text-white hover:bg-black'
      : 'bg-white text-[#1F1F1F] hover:bg-gray-100',
  };

  // Получаем конфиг статуса, если он есть
  const statusConfig = ticketStatus ? STATUS_CONFIG[ticketStatus] : null;

  // Текст кнопки
  const getButtonText = () => {
    if (variant === 'prize') {
      if (ticketStatus === 'winning') return 'ЗАБРАТЬ ПРИЗ';
      if (ticketStatus === 'losing') return 'ПОДРОБНЕЕ';
      return 'СМОТРЕТЬ БИЛЕТ';
    }
    return price ? `ИГРАТЬ • ${price} с` : 'ИГРАТЬ';
  };

  return (
    <BaseCard
      backgroundId={backgroundId}
      theme={theme}
      className='h-full min-h-[320px] flex flex-col justify-between p-6 transition-all duration-300 hover:shadow-xl group'
    >
      {/* --- ВЕРХНЯЯ ЧАСТЬ: Статус или Время --- */}
      <div className='flex justify-between items-start mb-4'>
        {/* Если есть статус (купленный билет) */}
        {statusConfig ? (
          <div className='flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-white/40'>
            <div className={clsx('w-2 h-2 rounded-full', statusConfig.dot)} />
            <span
              className={clsx(
                'text-[10px] font-bold font-benzin uppercase',
                statusConfig.textCol,
              )}
            >
              {statusConfig.text}
            </span>
          </div>
        ) : (
          // Если статуса нет (карточка покупки), показываем время тиража
          time && (
            <></>
            // <div className='flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm'>
            //   <Clock size={12} className='text-black' strokeWidth={3} />
            //   <span className='text-[10px] font-bold font-benzin text-black'>
            //     {time}
            //   </span>
            // </div>
          )
        )}
      </div>

      {/* --- СРЕДНЯЯ ЧАСТЬ: Инфо --- */}
      <div className='flex flex-col gap-1 mb-6'>
        <h3
          className={clsx(
            'text-xl font-black font-benzin uppercase leading-tight',
            colors.title,
          )}
        >
          {title}
        </h3>
        {description && (
          <p
            className={clsx(
              'text-xs font-medium font-rubik leading-relaxed max-w-[90%]',
              colors.desc,
            )}
          >
            {description}
          </p>
        )}
      </div>

      {/* --- ПРИЗ (Самое крупное) --- */}
      <div className='mb-8'>
        <span
          className={clsx(
            'block leading-none uppercase tracking-tight break-words',
            // Если шрифт не задан, ставим размер по дефолту
            prizeFontId === 'default' ? 'text-4xl' : '',
            colors.prize,
            FONT_VARIANTS[prizeFontId] || FONT_VARIANTS['default'],
          )}
        >
          {prize}
        </span>
      </div>

      {/* --- КНОПКА --- */}
      <div className='mt-auto'>
        <button
          className={clsx(
            'w-auto px-8 py-4 rounded-full shadow-lg transition-transform active:scale-95',
            'font-benzin font-bold text-xs uppercase tracking-wider',
            colors.button,
          )}
        >
          {getButtonText()}
        </button>
      </div>
    </BaseCard>
  );
}
