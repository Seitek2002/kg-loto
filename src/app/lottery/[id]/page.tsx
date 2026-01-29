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

      {/* 2. Динамический Hero */}
      {/* Мы можем передать в Hero специфичные цвета лотереи, если Hero это поддерживает */}
      <Hero
      // title={lottery.heroTitle}
      // subtitle={`СУПЕРПРИЗ ОТ ${lottery.prize}`}
      />

      <div className='px-4 mt-8 flex flex-col gap-2'>
        {/* Блок проверки */}
        <CheckLottery />

        {/* Условия */}
        <LotteryConditions />

        {/* 3. Динамические Категории призов */}
        <section className='mb-12'>
          <h2 className='text-xs text-gray-500 font-rubik mb-4 uppercase'>
            Призовой фонд лотереи «{lottery.title}»
          </h2>
          <div className='flex flex-col'>
            {lottery.prizeTiers.map((tier, idx) => (
              <PrizeTierCard
                key={idx}
                category={tier.category}
                description={tier.description}
                amount={tier.amount}
                winnersCount={tier.winners}
                // Цвета берутся из конфига
                gradientFrom={tier.gradientFrom}
                gradientTo={tier.gradientTo}
              />
            ))}
          </div>
        </section>

        <WinnersHistory />
      </div>
    </div>
  );
}
