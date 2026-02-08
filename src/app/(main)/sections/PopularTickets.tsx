'use client';

import Link from 'next/link';
import { LotteryCard } from '@/components/features/lottery/GameCard';
import { Description } from '@/components/ui/Description';
import { Title } from '@/components/ui/Title';
import { LotteryItem } from '@/types/api'; // Импорт типа

interface PopularTicketsProps {
  lotteries: LotteryItem[];
}

const formatTime = (time: string) => {
  if (!time) return '00:00';
  return time.split(':').slice(0, 2).join(':');
};

export const PopularTickets = ({ lotteries }: PopularTicketsProps) => {
  // Если лотерей нет, можно не рендерить ничего или показать заглушку
  if (!lotteries || lotteries.length === 0) return null;

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
        {lotteries.map((loto) => (
          <Link
            key={loto.id}
            href={`/lottery/${loto.id}`}
            className='block lg:w-[49%] transition-transform active:scale-[0.98]'
          >
            <LotteryCard
              title={loto.title}
              // В API списка лотерей поле может называться subtitle
              description={loto.subtitle || ''}
              prize={loto.prizeText}
              price={loto.buttonPrice}
              time={formatTime(loto.drawTime)}
              theme={loto.theme}
              // API возвращает полный URL картинки ("https://.../bg.jpg").
              // А LotteryCard ждет backgroundId ("1", "2").
              // Нам нужно научить LotteryCard принимать полный URL.
              // Пока передадим backgroundId как '1' (заглушка),
              // но добавим новый проп backgroundImage, если ты обновишь GameCard.
              backgroundId={'1'}
              // Либо передадим URL в backgroundId, если GameCard умеет это обрабатывать (мы это делали ранее через конфиг)

              // Если LotteryCard принимает backgroundImage URL:
              // backgroundImage={loto.backgroundImage}

              prizeFontId={'benzin'} // Хардкод или маппинг
            />
          </Link>
        ))}
      </div>
    </div>
  );
};
