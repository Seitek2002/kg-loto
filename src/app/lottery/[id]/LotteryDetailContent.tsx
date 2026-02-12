'use client';

import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/ui/PageHeader';
import { Hero, HeroSlideData } from '@/app/(main)/sections/Hero';
import { CheckLottery } from '@/app/(main)/sections/CheckLottery';
import { WinnersHistory } from '@/app/(main)/sections/WinnersHistory';
import { LotteryConditions } from '@/components/features/lottery/LotteryConditions';
import { PrizeTierCard } from '@/components/features/lottery/PrizeTierCard';
import { useTicketsStore, UserTicket } from '@/store/tickets';
import { LotteryDetail } from '@/types/api'; // 🔥 Импорт типа
import { Header } from '@/components/ui/Header';

interface ContentProps {
  lottery: LotteryDetail; // Данные с сервера
}

export const LotteryDetailContent = ({ lottery }: ContentProps) => {
  const router = useRouter();
  const { tickets, addTicket } = useTicketsStore();

  // Формируем слайд для Hero на основе данных API
  const lotterySlide: HeroSlideData[] = [
    {
      id: lottery.id,
      // API возвращает полный URL, используем его напрямую.
      // Если URL нет, ставим заглушку.
      bg: lottery.backgroundImage || '/banners/1.jpg',
      title1: lottery.heroTitle || lottery.title || 'ВЫИГРЫВАЕТ КАЖДЫЙ',
      title2: lottery.subtitle || '', // Если есть подзаголовок
      prize: lottery.prizeText,
      price: `${lottery.buttonPrice} сом`,
      buttonLabel: lottery.buttonLabel || `КУПИТЬ • ${lottery.buttonPrice} сом`,
    },
  ];

  const handleBuyOrViewTicket = () => {
    const lotteryIdNum = Number(lottery.id);
    const existingTicket = tickets.find((t) => t.lotteryId === lotteryIdNum);

    if (existingTicket) {
      router.push(`/tickets/${existingTicket.id}`);
    } else {
      const newTicketId = Date.now().toString();
      const newTicket: UserTicket = {
        id: newTicketId,
        lotteryId: lotteryIdNum,
        status: 'pending',
        ticketNumber: Math.floor(100000 + Math.random() * 900000).toString(),
        purchaseDate: new Date().toLocaleDateString('ru-RU'),
      };
      addTicket(newTicket);
      router.push(`/tickets/${newTicketId}`);
    }
  };

  return (
    <div className='min-h-screen bg-[#F9F9F9] pb-10'>
      <Header theme='light' />
      <PageHeader title='' />

      <Hero
        slides={lotterySlide}
        buttonText={lottery.buttonText || 'Купить билет'}
        onButtonClick={handleBuyOrViewTicket}
      />

      <div className='px-4 mt-8 flex flex-col gap-2'>
        <CheckLottery />

        {/* Условия лотереи (пока статика, если API не отдает условия) */}
        <LotteryConditions />

        {/* Секция с призами (рендерим, только если они есть) */}
        {lottery.prizeTiers && lottery.prizeTiers.length > 0 && (
          <section className='mb-12'>
            <h2 className='text-xs text-gray-500 font-rubik mb-4 uppercase'>
              Призовой фонд лотереи «{lottery.title}»
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {lottery.prizeTiers.map((tier) => (
                <div
                  key={tier.id}
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
};
