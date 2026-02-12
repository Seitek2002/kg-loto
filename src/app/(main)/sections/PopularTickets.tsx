'use client';

import Link from 'next/link';
import { LotteryCard } from '@/components/features/lottery/GameCard';
import { Description } from '@/components/ui/Description';
import { Title } from '@/components/ui/Title';
import { LotteryItem } from '@/types/api';

interface PopularTicketsProps {
  lotteries: LotteryItem[];
}

const formatTime = (time: string) => {
  if (!time) return '00:00';
  return time.split(':').slice(0, 2).join(':');
};

export const PopularTickets = ({ lotteries }: PopularTicketsProps) => {
  if (!lotteries || lotteries.length === 0) return null;

  return (
    <div className='my-12'>
      <Title>Популярные лотереи</Title>
      <Description>
        Популярные лотереи привлекают внимание благодаря крупным джекпотам,
        частым тиражам и удобным условиям участия.
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
              description={loto.subtitle || ''}
              prize={loto.prizeText}
              price={loto.buttonPrice}
              time={formatTime(loto.drawTime)}
              theme={loto.theme}
              // 🔥 ПЕРЕДАЕМ КАРТИНКУ С СЕРВЕРА
              backgroundImage={loto.backgroundImage}
              // Если вдруг картинки нет, можно передать дефолтный ID
              // backgroundId={'1'}

              prizeFontId={'benzin'}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};
