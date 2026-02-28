'use client';

import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Title } from '@/components/ui/Title';
import { Description } from '@/components/ui/Description';
import { WinnerCard } from '@/components/ui/WinnerCard';
import 'swiper/css';
import { Winner } from '@/types/api';

interface WinnersHistoryClientProps {
  winners: Winner[];
}

export const WinnersHistoryClient = ({
  winners,
}: WinnersHistoryClientProps) => {
  const displayWinners = winners?.slice(0, 6) || [];

  if (!displayWinners || displayWinners.length === 0) return null;

  return (
    <section className='my-12 relative overflow-hidden hidden'>
      <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8'>
        <div className='max-w-2xl'>
          <Title>ИСТОРИЯ ПОБЕДИТЕЛЕЙ</Title>
          <Description>
            Популярные лотереи привлекают внимание благодаря крупным джекпотам,
            частым тиражам и удобным условиям участия.
          </Description>
        </div>

        <Link
          href='/winners'
          className='hidden lg:inline-flex items-center justify-center px-6 py-3 bg-white border border-gray-200 rounded-full text-xs font-bold font-benzin uppercase text-[#2D2D2D] hover:bg-gray-50 transition-colors shadow-sm'
        >
          Все победители
        </Link>
      </div>

      <Swiper
        spaceBetween={16}
        slidesPerView={1.1}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3.2 },
        }}
        className='overflow-visible!'
      >
        {displayWinners.map((winner) => (
          <SwiperSlide key={winner.id}>
            <WinnerCard winner={winner} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className='mt-8 lg:hidden'>
        <Link
          href='/winners'
          className='flex w-full items-center justify-center py-4 bg-white rounded-full text-xs font-bold font-benzin uppercase text-[#2D2D2D] shadow-md active:scale-95 transition-transform'
        >
          Все победители
        </Link>
      </div>
    </section>
  );
};
