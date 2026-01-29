'use client';

import { PageHeader } from '@/components/ui/PageHeader';
import { LotteryConditions } from '@/components/features/lottery/LotteryConditions';
import { PrizeTierCard } from '@/components/features/lottery/PrizeTierCard';
import { Hero } from '../../(main)/sections/Hero';
import { CheckLottery } from '../../(main)/sections/CheckLottery';
import { WinnersHistory } from '../../(main)/sections/WinnersHistory';

const PRIZE_TIERS = [
  {
    category: 'Категория приза - 1',
    description: 'Популярные лотереи привлекают внимание...',
    amount: '500 000 KGS',
    winners: 1,
    gradientFrom: 'from-[#7F7FD5]',
    gradientTo: 'to-[#91EAE4]',
  },
  {
    category: 'Категория приза - 2',
    description: 'Популярные лотереи привлекают внимание...',
    amount: '100 000 KGS',
    winners: 2,
    gradientFrom: 'from-[#F2994A]',
    gradientTo: 'to-[#F2C94C]',
  },
  {
    category: 'Категория приза - 3',
    description: 'Популярные лотереи привлекают внимание...',
    amount: '50 000 KGS',
    winners: 5,
    gradientFrom: 'from-[#FFB7B2]',
    gradientTo: 'to-[#FFDAC1]',
  },
  {
    category: 'Категория приза - 4',
    amount: '10 000 KGS',
    winners: 10,
    gradientFrom: 'from-[#E2B0FF]',
    gradientTo: 'to-[#9F44D3]',
  },
  {
    category: 'Категория приза - 5',
    amount: '500 KGS',
    winners: 100,
    gradientFrom: 'from-[#D4FC79]',
    gradientTo: 'to-[#96E6A1]',
  },
];

export default function LotteryDetailPage() {
  return (
    <div className='min-h-screen bg-[#F9F9F9] pb-10'>
      <div className='absolute top-4 left-4 z-20'>
        <PageHeader title='' />
      </div>

      <Hero />

      <div className='px-4 mt-8 flex flex-col gap-2'>
        <CheckLottery />

        <LotteryConditions />

        <section className='mb-12'>
          <h2 className='text-xs text-gray-500 font-rubik mb-4'>
            Соберите три одинаковых числа и получите деньги!
          </h2>
          <div className='flex flex-col'>
            {PRIZE_TIERS.map((tier, idx) => (
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

        <WinnersHistory />
      </div>
    </div>
  );
}
