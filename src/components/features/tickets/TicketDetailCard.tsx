import { clsx } from 'clsx';
import { BaseCard } from '@/components/ui/BaseCard'; // Импортируем BaseCard для фона
import { FONT_VARIANTS } from '@/config/lottery-styles'; // Импортируем шрифты

// Обновленный интерфейс данных
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
  status: string; // 'winning' | 'losing' | 'pending'

  // 🔥 НОВЫЕ ПОЛЯ ДИЗАЙНА (Вместо gradientFrom/To)
  backgroundId?: string;
  prizeFontId?: string;
  theme?: 'dark' | 'white';
}

interface TicketDetailCardProps {
  data: TicketDetailData;
}

export const TicketDetailCard = ({ data }: TicketDetailCardProps) => {
  // Настройка цветов текста в зависимости от темы
  const isDark = data.theme === 'dark';
  const labelColor = isDark ? 'text-gray-600' : 'text-white/60';
  const valueColor = isDark ? 'text-[#2D2D2D]' : 'text-white';
  const borderColor = isDark ? 'border-gray-300/50' : 'border-white/20';

  // Логика шрифта для приза
  const prizeFontClass =
    FONT_VARIANTS[data.prizeFontId || 'default'] || 'font-benzin';

  // Конфиг статуса
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

  // Используем BaseCard для отрисовки фона (картинки)
  return (
    <BaseCard
      backgroundId={data.backgroundId}
      theme={data.theme}
      minHeight='auto'
      className='pb-8'
    >
      {/* --- СТАТУС --- */}
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

      {/* --- ЗАГОЛОВОК --- */}
      <h2
        className={clsx(
          'text-2xl font-black font-benzin uppercase mb-8 leading-tight',
          valueColor,
        )}
      >
        {data.title}
      </h2>

      {/* --- ИНФОРМАЦИЯ О БИЛЕТЕ --- */}
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

        {/* Разделитель */}
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

      {/* --- ПРИЗ --- */}
      <div className='mb-8'>
        <span
          className={clsx(
            'block text-[40px] leading-none uppercase tracking-tight',
            'font-black', // Базовая жирность
            prizeFontClass, // Кастомный шрифт (Rubik, Benzin и т.д.)
            valueColor,
          )}
        >
          {data.prizeAmount}
        </span>
      </div>

      {/* --- КНОПКА (ТОЛЬКО ДЛЯ ВЫИГРЫШНЫХ) --- */}
      {data.status === 'winning' && (
        <button className='w-full h-14 bg-white text-[#2D2D2D] rounded-full font-bold font-benzin uppercase text-xs shadow-lg active:scale-[0.98] transition-transform hover:bg-gray-50'>
          ГДЕ ЗАБРАТЬ СВОЙ ВЫИГРЫШ?
        </button>
      )}
    </BaseCard>
  );
};

// Вспомогательный компонент для строки
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
