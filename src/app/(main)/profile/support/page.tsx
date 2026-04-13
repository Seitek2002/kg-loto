'use client';

import { useState, useMemo } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { SupportCard } from '@/components/features/profile/SupportCard';
import { SupportTable } from '@/components/features/profile/SupportTable';
import { Pagination } from '@/components/features/profile/Pagination';
import { EmptySupport } from '@/components/features/profile/EmptySupport';
import { ProfileSubTabs } from '@/components/features/profile/ProfileSubTabs';
import { useTickets } from '@/hooks/useSupport'; // 🔥 Подключаем наш хук
import { NewTicketModal } from '@/components/features/profile/settings/NewTicketModal';

const SUB_TABS = ['Все', 'Открытые', 'Закрытые'];

// Маппинг статусов с бэкенда на наши "Открытые/Закрытые"
const OPEN_STATUSES = ['new', 'in_progress', 'waiting_client', 'escalated'];
const CLOSED_STATUSES = ['resolved', 'closed'];

export default function SupportPage() {
  const [activeSubTab, setActiveSubTab] = useState('Все');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔥 Делаем запрос на сервер
  const { data: tickets = [], isLoading, isError } = useTickets();

  const filteredTickets = useMemo(() => {
    return tickets
      .filter((ticket) => {
        if (activeSubTab === 'Открытые')
          return OPEN_STATUSES.includes(ticket.status);
        if (activeSubTab === 'Закрытые')
          return CLOSED_STATUSES.includes(ticket.status);
        return true;
      })
      .map((ticket) => ({
        // 🔥 Маппим данные с бэкенда под формат, который ждут SupportCard и SupportTable
        id: ticket.ticketNumber || String(ticket.id),
        date:
          ticket.createdAtDisplay ||
          new Date(ticket.createdAt).toLocaleDateString(),
        message: ticket.description,
        reply: ticket.answer || 'Дождитесь ответа',
        status: ticket.status,
      }));
  }, [activeSubTab, tickets]);

  const hasTickets = filteredTickets.length > 0;

  const newTicketButton = (
    <button
      onClick={() => setIsModalOpen(true)}
      className='flex items-center gap-2 text-[12px] sm:text-sm font-bold text-[#FF7600] hover:opacity-80 transition-opacity whitespace-nowrap cursor-pointer'
    >
      <span className='hidden sm:inline'>Новое обращение</span>
      <div className='w-6 h-6 sm:w-5 sm:h-5 rounded-full bg-[#FF7600] text-white flex items-center justify-center shrink-0'>
        <Plus size={14} strokeWidth={3} />
      </div>
    </button>
  );

  return (
    <div className='bg-white rounded-[24px] sm:rounded-[40px] shadow-sm p-4 sm:p-8 lg:p-10 min-h-[400px]'>
      <ProfileSubTabs
        tabs={SUB_TABS}
        activeTab={activeSubTab}
        onTabChange={setActiveSubTab}
        rightElement={newTicketButton}
      />

      {/* Индикатор загрузки */}
      {isLoading ? (
        <div className='flex justify-center items-center h-64 text-[#FF7600]'>
          <Loader2 className='w-10 h-10 animate-spin' />
        </div>
      ) : hasTickets ? (
        <>
          <div className='flex flex-col gap-4 lg:hidden'>
            {filteredTickets.map((ticket) => (
              <SupportCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
          <SupportTable tickets={filteredTickets} />
          <Pagination />{' '}
          {/* Пагинацию потом подключим, когда бэкенд будет отдавать ее параметры в meta */}
        </>
      ) : (
        <EmptySupport />
      )}

      <NewTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
