'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Star } from 'lucide-react'; // Импортируем звездочку
import { Title } from '@/components/ui/Title';
import { Description } from '@/components/ui/Description';
import { useContentStore } from '@/store/content';
import 'swiper/css';

export const WinnersHistory = () => {
  const winners = useContentStore((state) => state.winners);

  return (
    <section className='my-12 overflow-hidden'>
      <Title>ИСТОРИЯ ПОБЕДИТЕЛЕЙ</Title>
      <Description>
        Популярные лотереи привлекают внимание благодаря крупным джекпотам,
        частым тиражам и удобным условиям участия.
      </Description>

      <Swiper
        spaceBetween={8}
        slidesPerView={2.1}
        breakpoints={{
          640: { slidesPerView: 2.2 },
        }}
        className='overflow-visible!'
      >
        {winners.map((winner) => (
          <SwiperSlide key={winner.id}>
            <div className='relative w-full h-53.25 rounded-4xl overflow-hidden bg-gray-100'>
              {/* Фото победителя */}
              <Image
                src={winner.image}
                alt={winner.name}
                fill
                className='object-cover'
              />

              {/* 🔥 НОВЫЙ БЕЙДЖ (В левом верхнем углу) */}
              <div className='absolute top-3 left-3 bg-white rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm z-10'>
                <Star size={10} className='fill-[#6F51FF] text-[#6F51FF]' />{' '}
                {/* Фиолетовая звезда */}
                <span className='text-[10px] font-black font-benzin uppercase text-[#6F51FF] tracking-wide'>
                  {winner.lotteryBadge}
                </span>
              </div>

              {/* Стеклянная плашка внизу */}
              <div className='absolute bottom-4 left-4 right-4 bg-white/30 backdrop-blur-md border border-white/20 rounded-3xl p-4 flex flex-col items-center text-center shadow-sm'>
                <h3 className='text-xs font-black text-[#2D2D2D] font-benzin uppercase mb-0.5'>
                  {winner.name}
                </h3>
                <p className='text-xs text-[#4B4B4B] font-rubik mb-2 font-medium'>
                  {winner.city}
                </p>
                {/* Приз может быть длинным, поэтому добавим line-clamp если что */}
                <span className='text-xs font-semibold text-black font-benzin tracking-tight leading-tight'>
                  {winner.prize}
                </span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
