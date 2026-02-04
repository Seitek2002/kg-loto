'use client';

import { notFound, useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/ui/PageHeader';
import { Hero } from '@/app/(main)/sections/Hero';
import { CheckLottery } from '@/app/(main)/sections/CheckLottery';
import { WinnersHistory } from '@/app/(main)/sections/WinnersHistory';
import { LotteryConditions } from '@/components/features/lottery/LotteryConditions';
import { PrizeTierCard } from '@/components/features/lottery/PrizeTierCard';
import { getLotteryById } from '@/data/mock-lotteries';

// 🔥 Импорты стора
import { useTicketsStore, UserTicket } from '@/store/tickets';

export default function LotteryDetailPage() {
  const params = useParams();
  const router = useRouter(); // 🔥 Нужен роутер
  const id = params.id as string;

  const lottery = getLotteryById(id);

  // 🔥 Достаем билеты и функцию добавления
  const { tickets, addTicket } = useTicketsStore();

  if (!lottery) {
    return notFound();
  }

  // 🔥 ГЛАВНАЯ ЛОГИКА
  const handleBuyOrViewTicket = () => {
    const lotteryIdNum = Number(id);

    // 1. Проверяем, есть ли уже билет этой лотереи
    // (Для упрощения берем первый попавшийся, если их несколько)
    const existingTicket = tickets.find((t) => t.lotteryId === lotteryIdNum);

    if (existingTicket) {
      // Если есть -> идем смотреть его
      router.push(`/tickets/${existingTicket.id}`);
    } else {
      // Если нет -> "Покупаем" (Создаем новый)
      const newTicketId = Date.now().toString(); // Генерируем ID

      const newTicket: UserTicket = {
        id: newTicketId,
        lotteryId: lotteryIdNum,
        status: 'pending', // Пока не разыгран
        ticketNumber: Math.floor(100000 + Math.random() * 900000).toString(), // Случайный номер
        purchaseDate: new Date().toLocaleDateString('ru-RU'), // Сегодняшняя дата
      };

      // Сохраняем в Zustand
      addTicket(newTicket);

      // Идем смотреть новый билет
      router.push(`/tickets/${newTicketId}`);
    }
  };

  return (
    <div className='min-h-screen bg-[#F9F9F9] pb-10'>
      <div className='absolute top-4 left-4 z-20'>
        <PageHeader title='' />
      </div>

      <Hero />

      <div className='px-4 mt-8 flex flex-col gap-2'>
        <CheckLottery />

        <LotteryConditions />

        {lottery.prizeTiers && lottery.prizeTiers.length > 0 && (
          <section className='mb-12'>
            <h2 className='text-xs text-gray-500 font-rubik mb-4 uppercase'>
              Призовой фонд лотереи «{lottery.title}»
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {lottery.prizeTiers?.map((tier, idx) => (
                // 🔥 Оборачиваем в div или кнопку для клика
                <div
                  key={idx}
                  onClick={handleBuyOrViewTicket}
                  className='cursor-pointer active:scale-[0.98] transition-transform'
                >
                  <PrizeTierCard
                    category={tier.category}
                    description={tier.description}
                    amount={tier.amount}
                    winnersCount={tier.winners}
                    gradientFrom={tier.gradientFrom}
                    gradientTo={tier.gradientTo}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        <WinnersHistory />
      </div>
    </div>
  );
}
