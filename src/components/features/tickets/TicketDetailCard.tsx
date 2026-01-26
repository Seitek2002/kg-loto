import Link from 'next/link'; // <--- Импортируем Link
import { BaseCard } from '@/components/ui/BaseCard';
import { clsx } from 'clsx';

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
  status: 'winning' | 'losing' | 'waiting';
  gradientFrom: string;
  gradientTo: string;
  theme: 'dark' | 'white';

  pickupBranchId?: string;
}

interface TicketDetailCardProps {
  data: TicketDetailData;
}

export const TicketDetailCard = ({ data }: TicketDetailCardProps) => {
  const isWinning = data.status === 'winning';

  return (
    <BaseCard
      gradientFrom={data.gradientFrom}
      gradientTo={data.gradientTo}
      theme={data.theme}
      minHeight='auto'
      className='pb-8'
    >
      <div className='w-fit mb-4'>
        <div className='flex items-center gap-2 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-full'>
          <div
            className={clsx(
              'w-2 h-2 rounded-full',
              isWinning ? 'bg-green-500' : 'bg-gray-400',
            )}
          />
          <span
            className={clsx(
              'text-[10px] font-bold uppercase font-benzin',
              isWinning ? 'text-green-700' : 'text-gray-600',
            )}
          >
            {isWinning ? 'выигрышный' : 'проигрышный'}
          </span>
        </div>
      </div>

      <h3 className='text-lg font-black font-benzin uppercase mb-6 text-[#2D2D2D]'>
        {data.title}
      </h3>

      <div className='space-y-3 mb-8'>
        <InfoRow label='Номер билета:' value={data.ticketNumber} />
        <InfoRow label='Цена билета:' value={`${data.price} KGS`} />
        <InfoRow label='Дата покупки:' value={data.buyDate} />
        <InfoRow label='Тираж №' value={data.drawId} isUnderline />
        <InfoRow label='Дата тиража:' value={data.drawDate} />
      </div>

      <div className='text-3xl font-black font-benzin uppercase mb-8 text-[#2D2D2D]'>
        {data.prizeAmount}
      </div>

      {isWinning ? (
        <Link
          href={`/map?branch=${data.pickupBranchId || 'main'}`}
          className='w-full'
        >
          <button className='w-full py-4 bg-white rounded-full font-benzin font-bold text-xs uppercase shadow-lg shadow-black/5 active:scale-[0.98] transition-transform text-[#2D2D2D]'>
            ГДЕ ЗАБРАТЬ СВОЙ ВЫИГРЫШ?
          </button>
        </Link>
      ) : (
        <button className='w-full py-4 bg-white rounded-full font-benzin font-bold text-xs uppercase shadow-lg shadow-black/5 active:scale-[0.98] transition-transform text-[#2D2D2D]'>
          КУПИТЬ ЕЩЕ БИЛЕТ • {data.price} СОМ
        </button>
      )}
    </BaseCard>
  );
};

// ... InfoRow без изменений ...
const InfoRow = ({
  label,
  value,
  isUnderline,
}: {
  label: string;
  value: string;
  isUnderline?: boolean;
}) => (
  <div className='flex justify-between items-start text-xs font-rubik leading-tight'>
    <span className='font-bold text-gray-600 w-[45%]'>{label}</span>
    <span
      className={clsx(
        'font-bold text-gray-900 w-[55%] text-right',
        isUnderline && 'underline decoration-gray-400 underline-offset-2',
      )}
    >
      {value}
    </span>
  </div>
);
