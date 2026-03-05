'use client';

import { useState, useMemo } from 'react';
import { clsx } from 'clsx';
import { ProfileHeader } from '@/components/features/profile/ProfileHeader';
import { TicketCard } from '@/components/features/profile/TicketCard';

// Моковые данные для призов
const MOCK_PRIZES = [
  {
    id: 1,
    prize: '10 000',
    name: 'Мен миллионер',
    price: 500,
    date: '12.09.2026',
    logo: '/lotteries-logo/1.png',
    prizeStatus: 'received', // 'received' | 'waiting' | 'processing'
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

// Функция для генерации пропсов бейджика на основе статуса
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

  // Логика фильтрации призов
  const filteredPrizes = useMemo(() => {
    return MOCK_PRIZES.filter((prize) => {
      if (activeSubTab === 'Получены') return prize.prizeStatus === 'received';
      if (activeSubTab === 'Ожидают') return prize.prizeStatus === 'waiting';
      if (activeSubTab === 'В обработке')
        return prize.prizeStatus === 'processing';
      return true;
    });
  }, [activeSubTab]);

  return (
    <div className='min-h-screen bg-[#F5F5F5] pt-4 md:pt-6 pb-24 font-rubik'>
      <div className='max-w-380 mx-auto px-4 sm:px-6 lg:px-8'>
        <ProfileHeader />

        <div className='bg-white rounded-3xl sm:rounded-[40px] shadow-sm p-4 sm:p-8 lg:p-10'>
          {/* Под-вкладки */}
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

          {/* Сетка ПРИЗОВ */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr'>
            {filteredPrizes.map((prize) => (
              <TicketCard
                key={prize.id}
                prizeAmount={prize.prize}
                ticketName={prize.name}
                price={prize.price}
                date={prize.date}
                logoSrc={prize.logo}
                status='winning' // Оставляем выигрышный вид (с "Ваш приз")
                badge={getBadgeProps(prize.prizeStatus)} // 🔥 Передаем бейджик
                showButton={false} // 🔥 Отключаем кнопку для призов
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
