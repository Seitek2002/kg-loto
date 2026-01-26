'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  TicketDetailCard,
  TicketDetailData,
} from '@/components/features/tickets/TicketDetailCard';

// МОКОВЫЕ ДАННЫЕ (В реальности придут с бэкенда по ID)
const ticketsDB: Record<string, TicketDetailData> = {
  '1': {
    id: '1',
    title: 'НАЗВАНИЕ ЛОТЕРЕИ',
    ticketNumber: '1021 9110 0000 2476 4783',
    price: 100,
    buyDate: '22 января 2026',
    drawId: '000175',
    drawDate: '25 января 2026',
    location: 'г. Бишкек',
    drawTime: '00:30 BSK',
    prizeAmount: '1 000 000 KGS',
    status: 'winning',
    // 🔥 Вот откуда наследуется цвет (как на скрине)
    gradientFrom: 'from-[#E0C3FC]',
    gradientTo: 'to-[#8EC5FC]',
    theme: 'dark',
  },
  '2': {
    id: '2',
    title: 'LUCKY DROP',
    ticketNumber: '5555 3333 1111 0000',
    price: 200,
    buyDate: '20 января 2026',
    drawId: '000999',
    drawDate: '01 февраля 2026',
    location: 'Online',
    drawTime: '12:00 BSK',
    prizeAmount: 'IPHONE 16 PRO',
    status: 'winning',
    // Другой билет - другой цвет (например, желтый)
    gradientFrom: 'from-yellow-200',
    gradientTo: 'to-orange-300',
    theme: 'dark',
  },
};

export default function TicketDetailPage() {
  const params = useParams();
  const id = params.id as string;

  // Ищем билет
  const ticket = ticketsDB[id];

  if (!ticket) {
    return <div className='p-10 text-center'>Билет не найден</div>;
  }

  return (
    <div className='min-h-screen bg-[#F9F9F9] px-4 pt-2 pb-10'>
      {/* 1. Хедер (БИЛЕТ) */}
      <PageHeader title='БИЛЕТ' />

      {/* 2. Карточка */}
      <div className='mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500'>
        <TicketDetailCard data={ticket} />
      </div>

      {/* 3. Подвал (Правила) */}
      <div className='mt-8 text-center'>
        <p className='text-xs font-bold font-rubik text-[#2D2D2D]'>
          Правила игры?{' '}
          <Link href='/rules' className='text-[#FFD600] hover:underline'>
            Смотреть правила
          </Link>
        </p>
      </div>
    </div>
  );
}
