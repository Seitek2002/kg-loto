'use client';

import { notFound, useParams } from 'next/navigation';
import { PageHeader } from '@/components/ui/PageHeader';
import { Hero } from '@/app/(main)/sections/Hero';
import { CheckLottery } from '@/app/(main)/sections/CheckLottery';
import { WinnersHistory } from '@/app/(main)/sections/WinnersHistory';
import { LotteryConditions } from '@/components/features/lottery/LotteryConditions';
import { PrizeTierCard } from '@/components/features/lottery/PrizeTierCard';
import { getLotteryById } from '@/data/mock-lotteries';

export default function LotteryDetailPage() {
  const params = useParams();
  const id = params.id as string;

  // 1. Ищем лотерею в базе
  const lottery = getLotteryById(id);

  // 2. Если ID левый (например /lottery/999) — показываем 404
  if (!lottery) {
    return notFound();
  }

  return (
    <div className='min-h-screen bg-[#F9F9F9] pb-10'>
      {/* Стрелка назад */}
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
            <div className='flex flex-col'>
              {/* 🔥 ИСПРАВЛЕНИЕ: Добавлен ? перед .map */}
              {lottery.prizeTiers?.map((tier, idx) => (
                <PrizeTierCard
                  key={idx}
                  category={tier.category}
                  description={tier.description}
                  amount={tier.amount}
                  winnersCount={tier.winners}
                  gradientFrom={tier.gradientFrom}
                  gradientTo={tier.gradientTo}
                />
              ))}
            </div>
          </section>
        )}

        <WinnersHistory />
      </div>
    </div>
  );
}
