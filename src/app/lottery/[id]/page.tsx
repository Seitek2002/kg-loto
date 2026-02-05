'use client';

import { notFound, useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/ui/PageHeader';
import { Hero, HeroSlideData } from '@/app/(main)/sections/Hero';
import { CheckLottery } from '@/app/(main)/sections/CheckLottery';
import { WinnersHistory } from '@/app/(main)/sections/WinnersHistory';
import { LotteryConditions } from '@/components/features/lottery/LotteryConditions';
import { PrizeTierCard } from '@/components/features/lottery/PrizeTierCard';
import { getLotteryById } from '@/data/mock-lotteries';
import { useTicketsStore, UserTicket } from '@/store/tickets';
import { BACKGROUND_VARIANTS } from '@/config/lottery-styles';

// 🔥 1. Импортируем нашу карту путей

export default function LotteryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const lottery = getLotteryById(id);
  const { tickets, addTicket } = useTicketsStore();

  if (!lottery) {
    return notFound();
  }

  // 🔥 2. Получаем правильный путь к файлу (JPG, GIF или PNG)
  // Если lottery.backgroundId нет в списке, берем 'default'
  const heroBgImage =
    BACKGROUND_VARIANTS[lottery.backgroundId] || BACKGROUND_VARIANTS['default'];

  // Формируем слайд
  const lotterySlide: HeroSlideData[] = [
    {
      id: lottery.id,
      bg: heroBgImage, // Тут теперь полный правильный путь (например, /card-types/18.gif)
      title1: lottery.heroTitle || 'ВЫИГРЫВАЕТ КАЖДЫЙ',
      title2: 'ВТОРОЙ БИЛЕТ',
      prize: lottery.prize,
      price: `${lottery.price} сом`,
    },
  ];

  const handleBuyOrViewTicket = () => {
    const lotteryIdNum = Number(id);
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
      <div className='absolute top-4 left-4 z-20'>
        <PageHeader title='' />
      </div>

      <Hero
        slides={lotterySlide}
        buttonText='Купить билет'
        onButtonClick={handleBuyOrViewTicket}
      />

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
