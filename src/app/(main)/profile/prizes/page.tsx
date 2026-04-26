'use client';

import { useState, useMemo } from 'react';
import { TicketCard } from '@/components/features/profile/TicketCard';
import { EmptyPrizes } from '@/components/features/profile/EmptyPrizes';
import { ProfileSubTabs } from '@/components/features/profile/ProfileSubTabs';

const MOCK_PRIZES = [
  {
    id: 1,
    prize: '10 000',
    name: 'Мен миллионер',
    price: 500,
    date: '12.09.2026',
    logo: '/lotteries-logo/1.png',
    prizeStatus: 'received',
  },
  {
    id: 2,
    prize: '10 000',
    name: 'Мен миллионер',
    price: 500,
    date: '12.09.2026',
    logo: '/lotteries-logo/1.png',
    prizeStatus: 'received',
  },
  {
    id: 3,
    prize: '5 000',
    name: 'Уйго белек',
    price: 300,
    date: '10.09.2026',
    logo: '/lotteries-logo/1.png',
    prizeStatus: 'waiting',
  },
  {
    id: 4,
    prize: '50 000',
    name: 'Оной',
    price: 1000,
    date: '08.09.2026',
    logo: '/lotteries-logo/1.png',
    prizeStatus: 'processing',
  },
];

const SUB_TABS = ['Получены', 'Ожидают', 'В обработке'];

const getBadgeProps = (status: string) => {
  switch (status) {
    case 'received':
      return { text: 'Получен', variant: 'success' as const };
    case 'waiting':
      return { text: 'Ожидает получения', variant: 'waiting' as const };
    case 'processing':
      return { text: 'В обработке', variant: 'processing' as const };
    default:
      return undefined;
  }
};

export default function PrizesPage() {
  const [activeSubTab, setActiveSubTab] = useState('Получены');

  // 🔥 ТУМБЛЕР ДЛЯ ТЕСТА
  const isTestingEmptyState = false;

  const filteredPrizes = useMemo(() => {
    if (isTestingEmptyState) return [];

    return MOCK_PRIZES.filter((prize) => {
      if (activeSubTab === 'Получены') return prize.prizeStatus === 'received';
      if (activeSubTab === 'Ожидают') return prize.prizeStatus === 'waiting';
      if (activeSubTab === 'В обработке')
        return prize.prizeStatus === 'processing';
      return true;
    });
  }, [activeSubTab, isTestingEmptyState]);

  const hasPrizes = filteredPrizes.length > 0;

  // Кнопка "Еще" для десктопа
  const moreButtonDesktop = hasPrizes ? (
    <button className='hidden cursor-pointer sm:flex items-center gap-2 text-sm font-bold text-[#4B4B4B] hover:text-[#FF7A00] transition-colors'>
      Еще <span>→</span>
    </button>
  ) : undefined;

  return (
    <div className='bg-white rounded-3xl sm:rounded-[40px] shadow-sm p-4 sm:p-8 lg:p-10'>
      <ProfileSubTabs
        tabs={SUB_TABS}
        activeTab={activeSubTab}
        onTabChange={setActiveSubTab}
        rightElement={moreButtonDesktop}
      />

      {hasPrizes ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr'>
          {filteredPrizes.map((prize) => (
            <TicketCard
              key={prize.id}
              prizeAmount={prize.prize}
              ticketName={prize.name}
              price={prize.price}
              date={prize.date}
              logoSrc={prize.logo}
              status='winning'
              badge={getBadgeProps(prize.prizeStatus)}
              showButton={false}
            />
          ))}
        </div>
      ) : (
        <EmptyPrizes />
      )}

      {/* Кнопка "Еще" для мобилок */}
      {hasPrizes && (
        <button className='sm:hidden bg-white w-full mt-6 py-3 flex justify-center items-center gap-2 border border-[#90909080] rounded-full text-sm font-bold text-[#4B4B4B] active:scale-[0.98] transition-all cursor-pointer'>
          Еще <span>→</span>
        </button>
      )}
    </div>
  );
}
