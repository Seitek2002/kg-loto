'use client';

import Link from 'next/link';
import { LotteryCard } from '@/components/features/lottery/LotteryCard';
import { Description } from '@/components/ui/Description';
import { Title } from '@/components/ui/Title';
import { LotteryItem } from '@/types/api';

interface PopularTicketsProps {
  lotteries: LotteryItem[];
}

const MOCK_LOTTIE_CARDS = [
  {
    id: 'test-1',
    title: 'ТЕСТ АНИМАЦИИ 1',
    subtitle: 'Анимация .lottie',
    prizeText: '1 000 000 с',
    buttonPrice: 150,
    drawTime: '12:00',
    theme: 'white' as const,
    lottieSrc: '/animations/1.lottie', // Путь к файлу в public/animations
  },
  {
    id: 'test-2',
    title: 'ТЕСТ АНИМАЦИИ 2',
    subtitle: 'Анимация .json',
    prizeText: 'АВТОМОБИЛЬ',
    buttonPrice: 200,
    drawTime: '18:00',
    theme: 'white' as const,
    lottieSrc: '/animations/3.json', // Путь к файлу в public/animations
  },
];

const formatTime = (time: string) => {
  if (!time) return '00:00';
  return time.split(':').slice(0, 2).join(':');
};

export const PopularTickets = ({ lotteries }: PopularTicketsProps) => {
  const displayLotteries = [...MOCK_LOTTIE_CARDS, ...(lotteries || [])] as any;

  if (!lotteries || lotteries.length === 0) return null;

  return (
    <div className='my-12'>
      <Title>Популярные лотереи</Title>
      <Description>
        Популярные лотереи привлекают внимание благодаря крупным джекпотам,
        частым тиражам и удобным условиям участия.
      </Description>

      <div className='flex flex-col lg:flex-row flex-wrap justify-between gap-4 mt-6'>
        {displayLotteries.map((loto) => (
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
              lottieSrc={loto.lottieSrc}
              backgroundImage={loto.backgroundImage}
              prizeFontId={'benzin'}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};
