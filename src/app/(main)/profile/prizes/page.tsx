'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Для редиректов
import { PageHeader } from '@/components/ui/PageHeader';
import { PrizeTabs } from '@/components/features/prizes/PrizeTabs';
import { LotteryCard } from '@/components/features/lottery/GameCard';
import { useUserStore, UserTicket } from '@/store/user'; // Импортируем стор

export default function MyPrizesPage() {
  const router = useRouter();

  // 1. Достаем билеты из стора
  const myTickets = useUserStore((state) => state.myTickets);

  // 2. Состояние табов
  const [activeTab, setActiveTab] = useState<'received' | 'waiting'>('waiting');

  // 3. Подготовка данных
  // Фильтруем только выигрышные билеты
  const winningTickets = myTickets.filter((t) => t.status === 'winning');

  // 4. Логика распределения по табам
  // В реальном проекте у билета было бы поле isReceived: boolean.
  // ДЛЯ ДЕМО: Мы покажем все выигрышные билеты во вкладке "Ожидают",
  // чтобы ты мог протестировать сценарии получения приза.
  const filteredPrizes = winningTickets.filter((ticket) => {
    if (activeTab === 'waiting') return true;
    if (activeTab === 'received') return false; // Пока пусто в полученных
    return false;
  });

  // 5. ГЛАВНАЯ ЛОГИКА: Обработка клика
  const handlePrizeClick = (ticket: UserTicket) => {
    // Если выиграл ДЕНЬГИ -> Идем на страницу вывода
    if (ticket.winType === 'money') {
      router.push('/scan/withdraw');
      return;
    }

    // Если выиграл ПРЕДМЕТ (iPhone, Машина) -> Идем на карту (искать филиал)
    if (ticket.winType === 'item') {
      // Можно передать параметр, чтобы карта знала, что мы пришли за призом
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
            // Оборачиваем в div с onClick
            <div
              key={ticket.id}
              onClick={() => handlePrizeClick(ticket)}
              className='cursor-pointer active:scale-[0.98] transition-transform'
            >
              <LotteryCard
                variant='prize'
                ticketStatus={activeTab === 'received' ? 'archive' : 'winning'}
                title={ticket.title}
                description={`Тираж ${ticket.drawNumber}`} // Используем данные билета
                prize={ticket.winAmount || 'ПРИЗ'}
                gradientFrom={ticket.gradientFrom}
                gradientTo={ticket.gradientTo}
                price={ticket.price}
                theme={ticket.theme}
              />
            </div>
          ))
        ) : (
          <div className='flex flex-col items-center justify-center py-20 text-center'>
            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-2xl'>
              🎁
            </div>
            <p className='text-gray-400 font-rubik text-sm max-w-[200px]'>
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
