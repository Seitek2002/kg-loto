'use client';

import Link from 'next/link';
import { LotteryCard } from '@/components/features/lottery/LotteryCard';
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

      <div className='flex justify-stretch flex-wrap gap-4 mt-6'>
        {lotteries.map((loto) => {
          // 🔥 1. Берем ссылку из базы
          const bgUrl = loto.backgroundImage || '';

          // 🔥 2. Проверяем, является ли это анимацией (.json или .lottie)
          const isAnimation =
            bgUrl.toLowerCase().endsWith('.json') ||
            bgUrl.toLowerCase().endsWith('.lottie');

          return (
            <Link
              key={loto.id}
              href={`/lottery/${loto.id}`}
              className='block w-full md:w-[48%] transition-transform active:scale-[0.98]'
            >
              <LotteryCard
                title={loto.title}
                description={loto.subtitle || ''}
                prize={loto.prizeText}
                price={loto.buttonPrice}
                time={formatTime(loto.drawTime)}
                theme={loto.theme}
                // 🔥 3. Раскидываем ссылку в нужный пропс карточки
                lottieSrc={isAnimation ? bgUrl : undefined}
                backgroundImage={!isAnimation ? bgUrl : undefined}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};
