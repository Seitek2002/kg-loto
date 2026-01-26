'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { PrizeTabs } from '@/components/features/prizes/PrizeTabs';
import { LotteryCard } from '@/components/features/lottery/GameCard';

const prizes = [
  {
    id: 1,
    status: 'received',
    title: 'Название лотереи',
    description:
      'Популярные лотереи привлекают внимание благодаря крупным джекпотам...',
    prize: '1 000 000 KGS',
    gradientFrom: 'from-blue-300',
    gradientTo: 'to-indigo-500',
  },
  {
    id: 2,
    status: 'received',
    title: 'Название лотереи',
    description: 'Популярные лотереи привлекают внимание...',
    prize: 'IPHONE 17 PRO',
    gradientFrom: 'from-purple-400',
    gradientTo: 'to-pink-600',
  },
  {
    id: 3,
    status: 'received',
    title: 'Название лотереи',
    description: 'Популярные лотереи привлекают внимание...',
    prize: '50 000 KGS',
    gradientFrom: 'from-teal-400',
    gradientTo: 'to-emerald-600',
  },
  // Приз в ожидании
  {
    id: 4,
    status: 'waiting',
    title: 'Супер Розыгрыш',
    description: 'Ожидание подтверждения документов...',
    prize: 'TESLA MODEL Y',
    gradientFrom: 'from-orange-400',
    gradientTo: 'to-red-500',
  },
] as const;

export default function MyPrizesPage() {
  const [activeTab, setActiveTab] = useState<'received' | 'waiting'>(
    'received',
  );
  const filteredPrizes = prizes.filter((p) => p.status === activeTab);

  return (
    <div className='min-h-screen bg-[#F9F9F9] px-4 pt-2 pb-10'>
      <PageHeader title='МОИ ПРИЗЫ' />

      <div className='mt-6 mb-8'>
        <PrizeTabs activeTab={activeTab} onChange={setActiveTab} />
      </div>

      <div className='flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500'>
        {filteredPrizes.length > 0 ? (
          filteredPrizes.map((prize) => (
            <LotteryCard
              key={prize.id}
              variant='prize' // <-- Важно: переключаем режим
              status={prize.status} // <-- Передаем статус
              title={prize.title}
              description={prize.description}
              prize={prize.prize}
              gradientFrom={prize.gradientFrom}
              gradientTo={prize.gradientTo}
              price={0} // Не используется в режиме prize, но нужен для TS если не optional
            />
          ))
        ) : (
          <div className='text-center py-20 text-gray-400 font-rubik text-sm'>
            В этом разделе пока пусто...
          </div>
        )}
      </div>
    </div>
  );
}
