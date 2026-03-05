'use client';

import { useState, useMemo } from 'react';
import { clsx } from 'clsx';
import { Plus } from 'lucide-react';
import { ProfileHeader } from '@/components/features/profile/ProfileHeader';
import { SupportCard } from '@/components/features/profile/SupportCard';
import { SupportTable } from '@/components/features/profile/SupportTable';
import { Pagination } from '@/components/features/profile/Pagination';

// Моковые данные тикетов
const MOCK_TICKETS = [
  {
    id: 'T2357912',
    date: '04.03.2026',
    message:
      'turpis quis dignissim, eu sodales. ipsum tincidunt elit Praesent u sod...',
    reply:
      'Commodo elit nisi sed luctus dui. nisl. nibh elementum lacus, Lorem ex eget dolor quam felis...',
    status: 'resolved',
  },
  {
    id: 'T2357913',
    date: '04.03.2026',
    message:
      'turpis quis dignissim, eu sodales. ipsum tincidunt elit Praesent u sod...',
    reply:
      'quis dignissim, eu sodales. ipsum tincidunt elit Praesent u sodales. ipsum tincidunt elit P',
    status: 'resolved',
  },
  {
    id: 'T2357914',
    date: '04.03.2026',
    message:
      'turpis quis dignissim, eu sodales. ipsum tincidunt elit Praesent u sod...',
    reply: 'Дождитесь ответа',
    status: 'processing',
  },
  {
    id: 'T2357915',
    date: '04.03.2026',
    message:
      'turpis quis dignissim, eu sodales. ipsum tincidunt elit Praesent u sod...',
    reply: 'Дождитесь ответа',
    status: 'processing',
  },
  {
    id: 'T2357916',
    date: '04.03.2026',
    message:
      'turpis quis dignissim, eu sodales. ipsum tincidunt elit Praesent u sod...',
    reply: 'Вопрос не относится к тематике сервиса',
    status: 'rejected',
  },
  {
    id: 'T2357917',
    date: '04.03.2026',
    message:
      'turpis quis dignissim, eu sodales. ipsum tincidunt elit Praesent u sod...',
    reply: 'Дождитесь ответа',
    status: 'resolved',
  },
];

const SUB_TABS = ['Все', 'Открытые', 'Закрытые'];

export default function SupportPage() {
  const [activeSubTab, setActiveSubTab] = useState('Все');

  const filteredTickets = useMemo(() => {
    return MOCK_TICKETS.filter((ticket) => {
      if (activeSubTab === 'Открытые') return ticket.status === 'processing';
      if (activeSubTab === 'Закрытые')
        return ticket.status === 'resolved' || ticket.status === 'rejected';
      return true;
    });
  }, [activeSubTab]);

  return (
    <div className='min-h-screen bg-[#F5F5F5] pt-4 md:pt-6 pb-24 font-rubik'>
      <div className='max-w-380 mx-auto px-4 sm:px-6 lg:px-8'>
        <ProfileHeader />

        <div className='bg-white rounded-3xl sm:rounded-[40px] shadow-sm p-4 sm:p-8 lg:p-10'>
          {/* ВЕРХНЯЯ ПАНЕЛЬ С ВКЛАДКАМИ И КНОПКОЙ */}
          <div className='flex flex-row items-center justify-between gap-4 mb-6 sm:mb-8 border-b border-[#909090] pb-6.5'>
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

            <button className='flex items-center gap-2 text-[12px] sm:text-sm font-bold text-[#FF7600] hover:opacity-80 transition-opacity whitespace-nowrap cursor-pointer'>
              <span className='hidden sm:inline'>Новое обращение</span>
              <div className='w-6 h-6 sm:w-5 sm:h-5 rounded-full bg-[#FF7600] text-white flex items-center justify-center shrink-0'>
                <Plus size={14} strokeWidth={3} />
              </div>
            </button>
          </div>

          {/* МОБИЛЬНАЯ ВЕРСИЯ */}
          <div className='flex flex-col gap-4 lg:hidden'>
            {filteredTickets.map((ticket) => (
              <SupportCard key={ticket.id} ticket={ticket} />
            ))}
          </div>

          {/* ДЕСКТОПНАЯ ВЕРСИЯ */}
          <SupportTable tickets={filteredTickets} />

          {/* ПАГИНАЦИЯ */}
          <Pagination />
        </div>
      </div>
    </div>
  );
}
