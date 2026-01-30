'use client';

import { useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import { BaseCard } from '@/components/ui/BaseCard';
import { FONT_VARIANTS } from '@/config/lottery-styles';

export interface TicketDetailData {
  id: string;
  title: string;
  ticketNumber: string;
  price: number;
  buyDate: string;

  drawId: string;
  drawDate: string;
  location: string;
  drawTime: string;

  prizeAmount: string;
  status: string;

  backgroundId?: string;
  prizeFontId?: string;
  theme?: 'dark' | 'white';
}

interface TicketDetailCardProps {
  data: TicketDetailData;
}

export const TicketDetailCard = ({ data }: TicketDetailCardProps) => {
  const router = useRouter(); // Инициализируем роутер

  // Настройка цветов
  const isDark = data.theme === 'dark';
  const labelColor = isDark ? 'text-gray-600' : 'text-white/60';
  const valueColor = isDark ? 'text-[#2D2D2D]' : 'text-white';
  const borderColor = isDark ? 'border-gray-300/50' : 'border-white/20';

  const prizeFontClass =
    FONT_VARIANTS[data.prizeFontId || 'default'] || 'font-benzin';

  // Логика бейджей
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'winning':
        return {
          text: 'ВЫИГРЫШНЫЙ',
          bg: 'bg-green-100',
          textCol: 'text-green-600',
          dot: 'bg-green-500',
        };
      case 'losing':
        return {
          text: 'ПРОИГРЫШНЫЙ',
          bg: 'bg-red-100',
          textCol: 'text-red-500',
          dot: 'bg-red-500',
        };
      case 'pending':
        return {
          text: 'НЕ ПРОВЕРЕН',
          bg: 'bg-blue-100',
          textCol: 'text-blue-500',
          dot: 'bg-blue-500',
        };
      default:
        return {
          text: 'АРХИВ',
          bg: 'bg-gray-100',
          textCol: 'text-gray-500',
          dot: 'bg-gray-400',
        };
    }
  };

  const statusConfig = getStatusBadge(data.status);

  // 🔥 ЛОГИКА КЛИКА ПО КНОПКЕ
  const handleClaimPrize = () => {
    // Простая проверка: если в призе есть "KGS", значит это деньги
    const isMoney =
      data.prizeAmount.toUpperCase().includes('KGS') ||
      data.prizeAmount.toUpperCase().includes('СОМ');

    if (isMoney) {
      // Если деньги -> идем выводить
      router.push('/scan/withdraw');
    } else {
      // Если вещь (iPhone, Машина) -> идем на карту искать филиал
      router.push('/map?branch=1');
    }
  };

  return (
    <BaseCard
      backgroundId={data.backgroundId}
      theme={data.theme}
      minHeight='auto'
      className='pb-8'
    >
      {/* СТАТУС */}
      <div
        className={clsx(
          'w-fit flex items-center gap-2 px-3 py-1.5 rounded-full mb-6',
          isDark ? 'bg-white/80' : 'bg-black/20 backdrop-blur-md',
        )}
      >
        <div className={clsx('w-2 h-2 rounded-full', statusConfig.dot)} />
        <span
          className={clsx(
            'text-[10px] font-bold font-benzin uppercase',
            isDark ? 'text-gray-800' : 'text-white',
          )}
        >
          {statusConfig.text}
        </span>
      </div>

      {/* ЗАГОЛОВОК */}
      <h2
        className={clsx(
          'text-2xl font-black font-benzin uppercase mb-8 leading-tight',
          valueColor,
        )}
      >
        {data.title}
      </h2>

      {/* ИНФОРМАЦИЯ */}
      <div className='flex flex-col gap-4 mb-10'>
        <Row
          label='Номер билета:'
          value={data.ticketNumber}
          lColor={labelColor}
          vColor={valueColor}
        />
        <Row
          label='Цена билета:'
          value={`${data.price} KGS`}
          lColor={labelColor}
          vColor={valueColor}
        />
        <Row
          label='Дата покупки:'
          value={data.buyDate}
          lColor={labelColor}
          vColor={valueColor}
        />

        <div className={clsx('h-px w-full my-1', borderColor)} />

        <Row
          label='Тираж №:'
          value={data.drawId}
          lColor={labelColor}
          vColor={valueColor}
        />
        <Row
          label='Дата тиража:'
          value={data.drawDate}
          lColor={labelColor}
          vColor={valueColor}
        />
        <Row
          label='Место:'
          value={data.location}
          lColor={labelColor}
          vColor={valueColor}
        />
        <Row
          label='Время:'
          value={data.drawTime}
          lColor={labelColor}
          vColor={valueColor}
        />
      </div>

      {/* ПРИЗ */}
      <div className='mb-8'>
        <span
          className={clsx(
            'block text-[40px] leading-none uppercase tracking-tight',
            'font-black',
            prizeFontClass,
            valueColor,
          )}
        >
          {data.prizeAmount}
        </span>
      </div>

      {/* КНОПКА (С обработчиком onClick) */}
      {data.status === 'winning' && (
        <button
          onClick={handleClaimPrize} // 🔥 Подключили функцию
          className='w-full h-14 bg-white text-[#2D2D2D] rounded-full font-bold font-benzin uppercase text-xs shadow-lg active:scale-[0.98] transition-transform hover:bg-gray-50'
        >
          ГДЕ ЗАБРАТЬ СВОЙ ВЫИГРЫШ?
        </button>
      )}
    </BaseCard>
  );
};

const Row = ({
  label,
  value,
  lColor,
  vColor,
}: {
  label: string;
  value: string;
  lColor: string;
  vColor: string;
}) => (
  <div className='flex justify-between items-center'>
    <span className={clsx('text-xs font-bold font-rubik', lColor)}>
      {label}
    </span>
    <span className={clsx('text-xs font-bold font-rubik text-right', vColor)}>
      {value}
    </span>
  </div>
);
