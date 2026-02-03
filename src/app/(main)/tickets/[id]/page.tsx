'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  TicketDetailCard,
  TicketDetailData,
} from '@/components/features/tickets/TicketDetailCard';
import { TicketRulesCard } from '@/components/features/tickets/TicketRulesCard';
import { PopularTickets } from '@/app/(main)/sections/PopularTickets';

import { useTicketsStore } from '@/store/tickets';
import { LOTTERIES_DB } from '@/data/mock-lotteries';
import { BACKGROUND_VARIANTS } from '@/config/lottery-styles';

export default function TicketDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const userTicket = useTicketsStore((state) =>
    state.tickets.find((t) => t.id === id),
  );

  const ticketData: TicketDetailData | null = useMemo(() => {
    if (!userTicket) return null;
    const lotteryInfo = LOTTERIES_DB.find((l) => l.id === userTicket.lotteryId);
    const design = lotteryInfo || LOTTERIES_DB[0];

    return {
      id: userTicket.id,
      title: design.title,
      ticketNumber: userTicket.ticketNumber,
      price: design.price,
      buyDate: userTicket.purchaseDate,
      drawId: '000175',
      drawDate: '25 января 2026',
      location: 'г. Бишкек',
      drawTime: design.time,
      prizeAmount: design.prize,
      status: userTicket.status,
      theme: design.theme,
      backgroundId: design.backgroundId,
      prizeFontId: design.prizeFontId,
    };
  }, [userTicket]);

  const bgImage = ticketData
    ? BACKGROUND_VARIANTS[ticketData.backgroundId || '1'] ||
      BACKGROUND_VARIANTS['default']
    : '';

  if (!ticketData) {
    return (
      <div className='p-10 text-center text-gray-400'>Билет не найден</div>
    );
  }

  return (
    <div className='min-h-screen bg-[#F9F9F9] pt-2 pb-20 overflow-hidden'>
      <div className='max-w-300 mx-auto px-4'>
        <div className='mb-6'>
          <PageHeader title='БИЛЕТ' />
        </div>

        <div
          className='absolute w-full inset-0 h-screen z-0 pointer-events-none hidden lg:block rounded-[40px] opacity-90 blur-md'
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div className='relative grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 lg:mt-20'>
          <div className='relative z-10'>
            <TicketDetailCard data={ticketData} />
          </div>

          <div className='relative z-10 h-full'>
            <TicketRulesCard data={ticketData} />
          </div>
        </div>

        <div className='mt-16'>
          <h3 className='text-xl font-black font-benzin uppercase text-[#2D2D2D] mb-6'>
            Смотрите также
          </h3>
          <PopularTickets />
        </div>

        <div className='mt-8 text-center lg:hidden'>
          <p className='text-xs font-bold font-rubik text-[#2D2D2D]'>
            Правила игры?{' '}
            <Link href='/rules' className='text-[#FFD600] hover:underline'>
              Смотреть правила
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
