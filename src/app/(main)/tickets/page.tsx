'use client';

import Link from 'next/link';
import { TicketFilters } from '@/components/features/tickets/TicketFilters';
import { PageHeader } from '@/components/ui/PageHeader';
import { useTicketsStore } from '@/store/tickets'; // Импортируем хук стора
import { LotteryCard } from '@/components/features/lottery/GameCard';

export default function TicketsPage() {
  const tickets = useTicketsStore((state) => state.tickets);
  const filter = useTicketsStore((state) => state.filter);

  const filteredTickets = tickets.filter((ticket) => {
    if (filter === 'all') return true;
    return ticket.status === filter;
  });

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
                // Передаем статус, чтобы появился бейдж вместо часов
                ticketStatus={ticket.status}
                gradientFrom={ticket.gradientFrom}
                gradientTo={ticket.gradientTo}
                imageSrc={ticket.imageSrc}
                theme={ticket.theme}
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
