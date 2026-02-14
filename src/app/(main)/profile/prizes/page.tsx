'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/ui/PageHeader';
import { PrizeTabs } from '@/components/features/prizes/PrizeTabs';
import { LotteryCard } from '@/components/features/lottery/LotteryCard';
import { useUserStore, UserTicket } from '@/store/user';

export default function MyPrizesPage() {
  const router = useRouter();
  const myTickets = useUserStore((state) => state.myTickets);
  const [activeTab, setActiveTab] = useState<'received' | 'waiting'>('waiting');

  const winningTickets = myTickets.filter((t) => t.status === 'winning');

  const filteredPrizes = winningTickets.filter(() => {
    if (activeTab === 'waiting') return true;
    if (activeTab === 'received') return false;
    return false;
  });

  const handlePrizeClick = (ticket: UserTicket) => {
    if (ticket.winType === 'money') {
      router.push('/scan/withdraw');
      return;
    }
    if (ticket.winType === 'item') {
      router.push('/map?mode=pickup');
      return;
    }
  };

  return (
    <div className='min-h-screen bg-[#F9F9F9] px-4 pt-2 pb-10'>
      <PageHeader title='МОИ ПРИЗЫ' />

      <div className='mt-6 mb-8'>
        <PrizeTabs activeTab={activeTab} onChange={setActiveTab} />
      </div>

      <div className='flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500'>
        {filteredPrizes.length > 0 ? (
          filteredPrizes.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => handlePrizeClick(ticket)}
              className='cursor-pointer active:scale-[0.98] transition-transform'
            >
              <LotteryCard
                variant='prize'
                ticketStatus={activeTab === 'received' ? 'archive' : 'winning'}
                title={ticket.title}
                description={`Тираж ${ticket.drawNumber}`}
                prize={ticket.winAmount || 'ПРИЗ'}
                price={ticket.price}
                theme={ticket.theme}
                backgroundId={ticket.backgroundId}
                prizeFontId={ticket.prizeFontId}
              />
            </div>
          ))
        ) : (
          <div className='flex flex-col items-center justify-center py-20 text-center'>
            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-2xl'>
              🎁
            </div>
            <p className='text-gray-400 font-rubik text-sm max-w-50'>
              {activeTab === 'received'
                ? 'Вы еще не получали призов'
                : 'У вас нет призов, ожидающих получения'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
