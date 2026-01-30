'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { TicketFilters } from '@/components/features/tickets/TicketFilters';
import { PageHeader } from '@/components/ui/PageHeader';
import { useTicketsStore } from '@/store/tickets';
import { LotteryCard } from '@/components/features/lottery/GameCard';
import { LOTTERIES_DB } from '@/data/mock-lotteries';

export default function TicketsPage() {
  const tickets = useTicketsStore((state) => state.tickets);
  const filter = useTicketsStore((state) => state.filter);

  const filteredTickets = useMemo(() => {
    const filtered =
      filter === 'all' ? tickets : tickets.filter((t) => t.status === filter);

    return filtered.map((ticket) => {
      const lotteryInfo = LOTTERIES_DB.find((l) => l.id === ticket.lotteryId);

      if (!lotteryInfo) {
        return { ...LOTTERIES_DB[0], ...ticket };
      }

      return { ...lotteryInfo, ...ticket };
    });
  }, [tickets, filter]);

  return (
    <div className='min-h-screen bg-[#F9F9F9] px-4 pt-2 pb-32'>
      <PageHeader title='БИЛЕТЫ' />

      <div className='mt-4 mb-8'>
        <TicketFilters />
      </div>

      <div className='flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500'>
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <Link
              key={ticket.id}
              href={`/tickets/${ticket.id}`}
              className='block transition-transform active:scale-[0.98]'
            >
              <LotteryCard
                title={ticket.title}
                description={ticket.description}
                prize={ticket.prize}
                price={ticket.price}
                theme={ticket.theme}
                backgroundId={ticket.backgroundId}
                prizeFontId={ticket.prizeFontId}
                ticketStatus={ticket.status}
              />
            </Link>
          ))
        ) : (
          <div className='text-center text-gray-400 font-rubik mt-10'>
            Билетов в этой категории нет
          </div>
        )}
      </div>
    </div>
  );
}
