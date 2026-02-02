'use client';

import { Clock } from 'lucide-react';
import { clsx } from 'clsx';
import { BaseCard } from '@/components/ui/BaseCard';
import { FONT_VARIANTS } from '@/config/lottery-styles'; // Убедись, что создал этот файл

// Типы статусов
type CardStatus = 'winning' | 'losing' | 'pending' | 'archive';

interface LotteryCardProps {
  // Основные данные
  title: string;
  description: string;
  price?: number;
  prize: string;
  time?: string;

  backgroundId?: string;
  prizeFontId?: string;

  theme?: 'white' | 'dark';

  // Логика состояния
  ticketStatus?: CardStatus;
  variant?: 'lottery' | 'prize';
}

export function LotteryCard({
  title,
  description,
  price,
  prize,
  time = '14:56',

  backgroundId,
  prizeFontId = 'default',
  theme = 'white',

  ticketStatus,
  variant = 'lottery',
}: LotteryCardProps) {
  const isDark = theme === 'dark';
  const descriptionColor = isDark ? 'text-gray-700' : 'text-white/90';
  const buttonClass = isDark
    ? 'bg-gray-900 text-white hover:bg-gray-800'
    : 'bg-white text-gray-900 hover:bg-gray-50';

  // 2. Выбор шрифта для приза из конфига
  const prizeFontClass = FONT_VARIANTS[prizeFontId] || FONT_VARIANTS['default'];

  // 3. Конфигурация бейджей статуса
  const getStatusConfig = (status: CardStatus) => {
    switch (status) {
      case 'winning':
        return {
          text: 'выигрышный',
          dot: 'bg-green-500',
          textCol: 'text-green-600',
        };
      case 'losing':
        return {
          text: 'проигрышный',
          dot: 'bg-red-500',
          textCol: 'text-red-500',
        };
      case 'pending':
        return {
          text: 'не проверен',
          dot: 'bg-blue-400',
          textCol: 'text-blue-500',
        };
      case 'archive':
        return { text: 'архив', dot: 'bg-gray-400', textCol: 'text-gray-500' };
      default:
        return { text: '', dot: '', textCol: '' };
    }
  };

  const badgeWrapperClass =
    'flex items-center gap-2 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20';

  // 4. Логика текста на кнопке
  const getButtonContent = () => {
    if (variant === 'prize') {
      if (ticketStatus === 'winning') return 'ЗАБРАТЬ ВЫИГРЫШ';
      if (ticketStatus === 'pending') return 'ОЖИДАЕТ ТИРАЖА';
      if (ticketStatus === 'losing') return 'К СОЖАЛЕНИЮ, МИМО';
      return 'ПОДРОБНЕЕ';
    }
    return `Играть • ${price} сом`;
  };

  return (
    <BaseCard
      backgroundId={backgroundId} // Передаем ID фона в BaseCard
      theme={theme}
      className='mb-0'
    >
      {/* --- ВЕРХНИЙ БЕЙДЖ (Время или Статус) --- */}
      <div className='w-fit mb-4'>
        {ticketStatus ? (
          <div className={badgeWrapperClass}>
            <div
              className={clsx(
                'w-2 h-2 rounded-full',
                getStatusConfig(ticketStatus).dot,
              )}
            />
            <span
              className={clsx(
                'text-[10px] font-bold uppercase font-benzin',
                getStatusConfig(ticketStatus).textCol,
              )}
            >
              {getStatusConfig(ticketStatus).text}
            </span>
          </div>
        ) : (
          <div className={badgeWrapperClass}>
            <Clock size={14} className='text-gray-900' strokeWidth={2.5} />
            <span className='font-bold text-sm tracking-wide text-gray-900'>
              {time}
            </span>
          </div>
        )}
      </div>

      {/* --- ЗАГОЛОВОК И ОПИСАНИЕ --- */}
      <div className='mb-auto'>
        <h3 className='text-sm lg:text-xl font-black uppercase tracking-wide mb-3 font-benzin opacity-100'>
          {title}
        </h3>
        <p
          className={clsx(
            'text-xs lg:text-lg leading-relaxed font-medium font-rubik',
            descriptionColor,
          )}
        >
          {description}
        </p>
      </div>

      {/* --- СУММА ПРИЗА (С КАСТОМНЫМ ШРИФТОМ) --- */}
      <div className={clsx('mt-6 mb-6')}>
        <span
          className={clsx(
            'block leading-none uppercase tracking-tight drop-shadow-sm text-[32px]',
            'font-black', // Базовая жирность
            prizeFontClass, // 🔥 Применяем класс шрифта из конфига (rubik, benzin и т.д.)
          )}
        >
          {prize}
        </span>
      </div>

      {/* --- КНОПКА ДЕЙСТВИЯ --- */}
      <button
        className={clsx(
          'max-w-max rounded-full py-4 px-6 transition-all shadow-lg',
          buttonClass,
        )}
      >
        <span className='font-extrabold text-xs lg:text-base uppercase'>
          {getButtonContent()}
        </span>
      </button>
    </BaseCard>
  );
}
