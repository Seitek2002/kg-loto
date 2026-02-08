'use client';

import Link from 'next/link';
import { LotteryCard } from '@/components/features/lottery/GameCard';
import { Description } from '@/components/ui/Description';
import { Title } from '@/components/ui/Title';

import { useLotteries } from '@/hooks/useLotteries';

const formatTime = (time: string) => {
  return time.split(':').slice(0, 2).join(':');
};

export const PopularTickets = () => {
  const { data: lotteries, isLoading, isError } = useLotteries();
  // const lotteries = useContentStore((state) => state.lotteries);

  if (isLoading) {
    return (
      <div className='my-12 animate-pulse'>
        <div className='h-8 bg-gray-200 w-1/3 mb-4 rounded'></div>
        <div className='h-4 bg-gray-200 w-2/3 mb-8 rounded'></div>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          <div className='h-64 bg-gray-200 rounded-3xl'></div>
          <div className='h-64 bg-gray-200 rounded-3xl'></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='my-12 text-red-500'>Не удалось загрузить лотереи</div>
    );
  }

  return (
    <div className='my-12'>
      <Title>Популярные лотереи</Title>
      <Description>
        Популярные лотереи привлекают внимание благодаря крупным джекпотам,
        частым тиражам и удобным условиям участия. Тысячи игроков ежедневно
        выбирают именно эти розыгрыши, чтобы испытать удачу и побороться за
        выигрыш.
      </Description>

      <div className='flex flex-col lg:flex-row flex-wrap justify-between gap-4 mt-6'>
        {lotteries?.map((loto) => (
          <Link
            key={loto.id}
            href={`/lottery/${loto.id}`}
            className='block lg:w-[49%] transition-transform active:scale-[0.98]'
          >
            <LotteryCard
              title={loto.title}
              description={loto.description}
              prize={loto.prize}
              price={+loto.price}
              time={formatTime(loto?.time || '00:00')}
              theme={loto.theme}
              backgroundId={loto.backgroundId || '1'}
              prizeFontId={loto.prizeFontId || 'benzin'}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};
