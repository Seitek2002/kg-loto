'use client';

import { useState, useMemo } from 'react';
import { TicketCard } from '@/components/features/profile/TicketCard';
import { EmptyTickets } from '@/components/features/profile/EmptyTickets';
import { ProfileSubTabs } from '@/components/features/profile/ProfileSubTabs';

const MOCK_TICKETS: Array<{
  id: number;
  prize: string;
  name: string;
  price: number;
  date: string;
  logo: string;
  status: 'winning' | 'unchecked' | 'losing';
}> = [
  {
    id: 1,
    prize: '10 000',
    name: 'Мен миллионер',
    price: 500,
    date: '12.09.2026',
    logo: '/lotteries-logo/1.png',
    status: 'winning',
  },
  {
    id: 2,
    prize: '10 000',
    name: 'Мен миллионер',
    price: 500,
    date: '12.09.2026',
    logo: '/lotteries-logo/1.png',
    status: 'unchecked',
  },
  {
    id: 3,
    prize: '0',
    name: 'Мен миллионер',
    price: 500,
    date: '12.09.2026',
    logo: '/lotteries-logo/1.png',
    status: 'losing',
  },
];

const SUB_TABS = ['Выигрышные', 'Не проверены', 'Все билеты'];

export default function ProfilePage() {
  const [activeSubTab, setActiveSubTab] = useState('Выигрышные');

  // 🔥 ТУМБЛЕР ДЛЯ ТЕСТА
  const isTestingEmptyState = false;

  const filteredTickets = useMemo(() => {
    if (isTestingEmptyState) return [];

    return MOCK_TICKETS.filter((ticket) => {
      if (activeSubTab === 'Выигрышные') return ticket.status === 'winning';
      if (activeSubTab === 'Не проверены') return ticket.status === 'unchecked';
      return true;
    });
  }, [activeSubTab, isTestingEmptyState]);

  const hasTickets = filteredTickets.length > 0;

  // Кнопка "Еще" для десктопа (передаем в табы)
  const moreButtonDesktop = hasTickets ? (
    <button className='hidden cursor-pointer sm:flex items-center gap-2 text-sm font-bold text-[#4B4B4B] hover:text-[#FF7A00] transition-colors'>
      Еще <span>→</span>
    </button>
  ) : undefined;

  return (
    <div className='bg-white rounded-[24px] sm:rounded-[40px] shadow-sm p-4 sm:p-8 lg:p-10'>
      {/* Универсальные вкладки */}
      <ProfileSubTabs
        tabs={SUB_TABS}
        activeTab={activeSubTab}
        onTabChange={setActiveSubTab}
        rightElement={moreButtonDesktop}
      />

      {/* Контент или пустое состояние */}
      {hasTickets ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr'>
          {filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              prizeAmount={ticket.prize}
              ticketName={ticket.name}
              price={ticket.price}
              date={ticket.date}
              logoSrc={ticket.logo}
              status={ticket.status}
            />
          ))}
        </div>
      ) : (
        <EmptyTickets />
      )}

      {/* Кнопка "Еще" для мобилок */}
      {hasTickets && (
        <button className='sm:hidden bg-white w-full mt-6 py-3 flex justify-center items-center gap-2 border border-[#90909080] rounded-full text-sm font-bold text-[#4B4B4B] active:scale-[0.98] transition-all cursor-pointer'>
          Еще <span>→</span>
        </button>
      )}
    </div>
  );
}
