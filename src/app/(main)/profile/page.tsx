'use client';

import { useState, useMemo } from 'react';
import { clsx } from 'clsx';
import { ProfileHeader } from '@/components/features/profile/ProfileHeader';
import { TicketCard } from '@/components/features/profile/TicketCard';

// 🔥 Добавил статусы, чтобы можно было проверить фильтрацию визуально
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

  // 🔥 Логика фильтрации
  const filteredTickets = useMemo(() => {
    return MOCK_TICKETS.filter((ticket) => {
      if (activeSubTab === 'Выигрышные') return ticket.status === 'winning';
      if (activeSubTab === 'Не проверены') return ticket.status === 'unchecked';
      return true; // Для "Все билеты" показываем весь массив
    });
  }, [activeSubTab]);

  return (
    <div className='min-h-screen bg-[#F5F5F5] pt-4 md:pt-6 pb-24 font-rubik'>
      <div className='max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8'>
        <ProfileHeader />

        <div className='bg-white rounded-[24px] sm:rounded-[40px] shadow-sm p-4 sm:p-8 lg:p-10'>
          {/* Под-вкладки и кнопка "Еще" (Desktop) */}
          <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 border-b border-[#909090] pb-6.5'>
            <div className='flex items-center gap-4 sm:gap-8.5 overflow-x-auto scrollbar-hide'>
              {SUB_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveSubTab(tab)}
                  className={clsx(
                    'text-[12px] sm:text-base transition-colors whitespace-nowrap cursor-pointer',
                    activeSubTab === tab
                      ? 'text-[#4B4B4B] font-semibold'
                      : 'text-[#4B4B4B]',
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button className='hidden cursor-pointer sm:flex items-center gap-2 text-sm font-bold text-[#4B4B4B] hover:text-[#FF7A00] transition-colors'>
              Еще <span>→</span>
            </button>
          </div>

          {/* Сетка билетов с отфильтрованными данными */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr'>
            {filteredTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                prizeAmount={ticket.prize}
                ticketName={ticket.name}
                price={ticket.price}
                date={ticket.date}
                logoSrc={ticket.logo}
                status={ticket.status} // 🔥 Прокидываем статус
              />
            ))}
          </div>
        </div>

        <button className='sm:hidden bg-white w-full mt-6 py-3 flex justify-center items-center gap-2 border border-[#90909080] rounded-full text-sm font-bold text-[#4B4B4B] active:scale-[0.98] transition-all'>
          Еще <span>→</span>
        </button>
      </div>
    </div>
  );
}
