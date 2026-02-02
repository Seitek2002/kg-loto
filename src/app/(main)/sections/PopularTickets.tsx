'use client';

import Link from 'next/link';
import { LotteryCard } from '@/components/features/lottery/GameCard';
import { Description } from '@/components/ui/Description';
import { Title } from '@/components/ui/Title';
import { useContentStore } from '@/store/content';

export const PopularTickets = () => {
  const lotteries = useContentStore((state) => state.lotteries);

  return (
    <div className='my-12'>
      <Title>Популярные лотереи</Title>
      <Description>
        Популярные лотереи привлекают внимание благодаря крупным джекпотам, частым тиражам и удобным условиям участия. Тысячи игроков ежедневно выбирают именно эти розыгрыши, чтобы испытать удачу и побороться за выигрыш.
      </Description>

      <div className='flex flex-col lg:flex-row flex-wrap justify-between gap-4 mt-6'>
        {lotteries.map((loto) => (
          <Link
            key={loto.id}
            href={`/lottery/${loto.id}`}
            className='block lg:w-[49%] transition-transform active:scale-[0.98]'
          >
            <LotteryCard
              title={loto.title}
              description={loto.description}
              prize={loto.prize}
              price={loto.price}
              time={loto.time}
              theme={loto.theme}

              backgroundId={loto.backgroundId}
              prizeFontId={loto.prizeFontId}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};
