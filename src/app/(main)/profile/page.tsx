'use client';

import { useState, useMemo, useEffect } from 'react';
import { TicketCard } from '@/components/features/profile/TicketCard';
import { EmptyTickets } from '@/components/features/profile/EmptyTickets';
import { ProfileSubTabs } from '@/components/features/profile/ProfileSubTabs';
import { useMyTickets } from '@/hooks/useTickets'; // 🔥 Подключаем наш хук
import { Loader2 } from 'lucide-react';

interface RawTicket {
  id?: string | number;
  ticketId?: string;
  ticket_number?: string;
  is_winning?: boolean;
  status?: string;
  win_amount?: string | number;
  prize_amount?: string | number;
  prize?: string | number;
  lottery_name?: string;
  lottery?: {
    name?: string;
    logo?: string;
  };
  price?: number;
  draw_date?: string;
  created_at?: string;
  lottery_logo?: string;
  // Добавляем индексную сигнатуру на случай, если бэкенд пришлет еще какие-то поля
  [key: string]: unknown;
}

interface MappedTicket {
  id: string | number;
  prize: string;
  name: string;
  price: number;
  date: string;
  logo: string;
  status: 'winning' | 'unchecked' | 'losing';
}

const SUB_TABS = ['Выигрышные', 'Не проверены', 'Все билеты'];

export default function ProfilePage() {
  const [activeSubTab, setActiveSubTab] = useState('Выигрышные');

  // 🔥 Запрашиваем билеты (передаем страницу 1 и лимит 50)
  const { data, isLoading } = useMyTickets(1, 50);

  // Для отладки: выведет в консоль то, что реально пришло с сервера
  useEffect(() => {
    if (data) console.log('Билеты с API:', data);
  }, [data]);

  // 🔥 Превращаем данные с бэкенда в формат, который понимает TicketCard
  const mappedTickets: MappedTicket[] = useMemo(() => {
    if (!data) return [];

    // Бэкенд может отдавать массив напрямую, либо оборачивать в data / results
    const ticketsArray = Array.isArray(data)
      ? data
      : data.data || data.results || [];

    return ticketsArray.map((t: RawTicket) => {
      // Логика определения статуса (зависит от того, что присылает бэкенд)
      let mappedStatus: 'winning' | 'unchecked' | 'losing' = 'unchecked';

      // Предполагаем, что бэкенд присылает is_winning или статус
      if (t.is_winning === true || t.status === 'winning') {
        mappedStatus = 'winning';
      } else if (t.is_winning === false || t.status === 'losing') {
        mappedStatus = 'losing';
      }

      return {
        id: t.id || t.ticketId || t.ticket_number,
        // Ищем поле с призом (win_amount, prize_amount или prize)
        prize: t.win_amount || t.prize_amount || t.prize || '0',
        // Ищем название лотереи
        name: t.lottery_name || t.lottery?.name || 'Лотерея',
        price: t.price || 0,
        date: t.draw_date || t.created_at || 'Скоро',
        logo: t.lottery_logo || t.lottery?.logo || '/lotteries-logo/1.png',
        status: mappedStatus,
      };
    });
  }, [data]);

  // Фильтруем уже отформатированные билеты по вкладкам
  const filteredTickets = useMemo(() => {
    return mappedTickets.filter((ticket: MappedTicket) => {
      if (activeSubTab === 'Выигрышные') return ticket.status === 'winning';
      if (activeSubTab === 'Не проверены') return ticket.status === 'unchecked';
      return true; // Для "Все билеты"
    });
  }, [activeSubTab, mappedTickets]);

  const hasTickets = filteredTickets.length > 0;

  const moreButtonDesktop = hasTickets ? (
    <button className='hidden cursor-pointer sm:flex items-center gap-2 text-sm font-bold text-[#4B4B4B] hover:text-[#FF7A00] transition-colors'>
      Еще <span>→</span>
    </button>
  ) : undefined;

  return (
    <div className='bg-white rounded-[24px] sm:rounded-[40px] shadow-sm p-4 sm:p-8 lg:p-10 min-h-[400px]'>
      {/* Универсальные вкладки */}
      <ProfileSubTabs
        tabs={SUB_TABS}
        activeTab={activeSubTab}
        onTabChange={setActiveSubTab}
        rightElement={moreButtonDesktop}
      />

      {/* 🔥 Показываем лоадер, пока данные грузятся */}
      {isLoading ? (
        <div className='flex justify-center items-center h-64 text-[#FF7600]'>
          <Loader2 className='w-10 h-10 animate-spin' />
        </div>
      ) : hasTickets ? (
        <>
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

          {/* Кнопка "Еще" для мобилок */}
          <button className='sm:hidden bg-white w-full mt-6 py-3 flex justify-center items-center gap-2 border border-[#90909080] rounded-full text-sm font-bold text-[#4B4B4B] active:scale-[0.98] transition-all cursor-pointer'>
            Еще <span>→</span>
          </button>
        </>
      ) : (
        <EmptyTickets />
      )}
    </div>
  );
}
