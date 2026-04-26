'use client';

import { useState, useMemo, useEffect } from 'react';
import { TicketCard } from '@/components/features/profile/TicketCard';
import { EmptyTickets } from '@/components/features/profile/EmptyTickets';
import { ProfileSubTabs } from '@/components/features/profile/ProfileSubTabs';
import { Loader2 } from 'lucide-react';
import { MyTicketDto, useMyTickets } from '@/entities/ticket/api';

interface MappedTicket {
  id: string | number;
  prize: string;
  name: string;
  price: number;
  date: string;
  logo: string;
  status: 'winning' | 'unchecked' | 'losing';
}

const SUB_TABS = ['Все билеты', 'Выигрышные', 'Не проверены'];

export default function ProfilePage() {
  const [activeSubTab, setActiveSubTab] = useState('Все билеты');

  // 🔥 Запрашиваем билеты (передаем страницу 1 и лимит 50)
  const { data, isLoading } = useMyTickets();

  // Для отладки: выведет в консоль то, что реально пришло с сервера
  useEffect(() => {
    if (data) console.log('Билеты с API:', data);
  }, [data]);

  // 🔥 Превращаем данные с бэкенда в формат, который понимает TicketCard
  const mappedTickets: MappedTicket[] = useMemo(() => {
    // Если данных нет, возвращаем пустой массив
    if (!data) return [];

    // Так как ticketApi.getMyTickets уже возвращает массив MyTicketDto[],
    // TypeScript теперь понимает, что data — это массив.
    return data.map((t: MyTicketDto) => {
      let mappedStatus: 'winning' | 'unchecked' | 'losing' = 'unchecked';

      if (t.status === 'winning') {
        mappedStatus = 'winning';
      } else if (t.status === 'losing') {
        mappedStatus = 'losing';
      } else if (t.status === 'sold') {
        // Если куплен, но еще не разыгран
        mappedStatus = 'unchecked';
      }

      return {
        id: t.ticketId || t.ticketNumber,
        prize: t.prizeAmount ? String(t.prizeAmount) : '0',
        name: `Лотерея (Тираж ${t.drawId})`, // Бэкенд пока не отдает красивое имя в этом эндпоинте, используем заглушку
        price: t.price || 0,
        date: t.purchaseDate
          ? new Date(t.purchaseDate).toLocaleDateString('ru-RU')
          : 'Скоро',
        logo: '/lotteries-logo/1.png', // Бэкенд пока не отдает логотип в этом эндпоинте
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
