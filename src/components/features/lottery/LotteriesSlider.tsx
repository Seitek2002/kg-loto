'use client';

import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { LotteryCard } from '@/components/features/lottery/LotteryCard';
import { Title } from '@/components/ui/Title';
import { Description } from '@/components/ui/Description';
import { LotteryItem } from '@/types/api';

interface LotteriesSliderProps {
  lotteries: LotteryItem[];
}

const formatTime = (time: string) => {
  if (!time) return '00:00';
  return time.split(':').slice(0, 2).join(':');
};

export const LotteriesSlider = ({ lotteries }: LotteriesSliderProps) => {
  if (!lotteries || lotteries.length === 0) return null;

  return (
    <section className='mt-16 w-full relative overflow-hidden'>
      <div className='mb-8 max-w-2xl'>
        <Title>ЛОТЕРЕИ</Title>
        <Description>
          Популярные лотереи привлекают внимание благодаря крупным джекпотам,
          частым тиражам и удобным условиям участия. Билеты можно приобрести
          онлайн, а чтобы начать, достаточно зарегистрироваться.
        </Description>
      </div>

      <Swiper
        spaceBetween={16}
        slidesPerView={1.1}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          1024: { slidesPerView: 2.5 },
          1280: { slidesPerView: 3.2 },
        }}
        className='overflow-visible!'
      >
        {lotteries.map((loto) => {
          const bgUrl = loto.backgroundImage || '';
          const isAnimation =
            bgUrl.toLowerCase().endsWith('.json') ||
            bgUrl.toLowerCase().endsWith('.lottie');

          return (
            <SwiperSlide key={loto.id} className='h-auto'>
              <Link
                href={`/lottery/${loto.id}`}
                className='block h-full transition-transform active:scale-[0.98]'
              >
                <LotteryCard
                  title={loto.title}
                  description={loto.subtitle || ''}
                  prize={loto.prizeText}
                  price={loto.buttonPrice || undefined}
                  time={formatTime(loto.drawTime)}
                  theme={loto.theme}
                  lottieSrc={isAnimation ? bgUrl : undefined}
                  backgroundImage={!isAnimation ? bgUrl : undefined}
                />
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};
