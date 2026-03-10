'use client';

import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { SupportCard } from '@/components/features/profile/SupportCard';
import { SupportTable } from '@/components/features/profile/SupportTable';
import { Pagination } from '@/components/features/profile/Pagination';
import { EmptySupport } from '@/components/features/profile/EmptySupport';
import { ProfileSubTabs } from '@/components/features/profile/ProfileSubTabs'; // 🔥 Наш новый компонент

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
  const isTestingEmptyState = false;

  const filteredTickets = useMemo(() => {
    if (isTestingEmptyState) return [];

    return MOCK_TICKETS.filter((ticket) => {
      if (activeSubTab === 'Открытые') return ticket.status === 'processing';
      if (activeSubTab === 'Закрытые')
        return ticket.status === 'resolved' || ticket.status === 'rejected';
      return true;
    });
  }, [activeSubTab, isTestingEmptyState]);

  const hasTickets = filteredTickets.length > 0;

  // 🔥 Кнопку вынесли в переменную, чтобы передать в компонент табов
  const newTicketButton = (
    <button className='flex items-center gap-2 text-[12px] sm:text-sm font-bold text-[#FF7600] hover:opacity-80 transition-opacity whitespace-nowrap cursor-pointer'>
      <span className='hidden sm:inline'>Новое обращение</span>
      <div className='w-6 h-6 sm:w-5 sm:h-5 rounded-full bg-[#FF7600] text-white flex items-center justify-center shrink-0'>
        <Plus size={14} strokeWidth={3} />
      </div>
    </button>
  );

  // 🔥 Обрати внимание, как чисто выглядит рендер. Никаких лишних div!
  return (
    <div className='bg-white rounded-[24px] sm:rounded-[40px] shadow-sm p-4 sm:p-8 lg:p-10'>
      <ProfileSubTabs
        tabs={SUB_TABS}
        activeTab={activeSubTab}
        onTabChange={setActiveSubTab}
        rightElement={newTicketButton}
      />

      {hasTickets ? (
        <>
          <div className='flex flex-col gap-4 lg:hidden'>
            {filteredTickets.map((ticket) => (
              <SupportCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
          <SupportTable tickets={filteredTickets} />
          <Pagination />
        </>
      ) : (
        <EmptySupport />
      )}
    </div>
  );
}
