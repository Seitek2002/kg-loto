'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useMounted } from '@/hooks/useMounted';

export const Hero = () => {
  const mounted = useMounted();

  if (!mounted) return null;

  return (
    <section className='relative w-full overflow-hidden mx-auto'>
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        className='h-[80vh] w-full hero-swiper'
      >
        <SwiperSlide className='relative w-full h-full'>
          <div className='absolute inset-0 z-0'>
            <Image
              src='/hero-banner-1.png'
              alt='Background'
              fill
              className='object-cover'
              priority
            />
            <div className='absolute inset-0 bg-black/10' />
          </div>

          <div className='relative z-10 flex flex-col items-center justify-start h-full pt-12 text-center'>
            <div className='mb-10 w-32 h-auto relative'>
              <Image
                src='/logo.png'
                alt='KG Loto'
                width={140}
                height={50}
                className='object-contain drop-shadow-lg'
              />
            </div>

            <div className='flex flex-col gap-1 mb-2 text-xl font-benzin leading-tight uppercase font-black'>
              <h2 className='text-white drop-shadow-md'>ВЫИГРЫВАЕТ КАЖДЫЙ</h2>
              <h2 className='text-[#FFD600] drop-shadow-md'>ВТОРОЙ БИЛЕТ</h2>
            </div>

            <p className='text-xs text-white/90 font-medium mb-1 uppercase tracking-widest mt-4'>
              Суперприз от
            </p>

            {/* Огромная сумма */}
            <h1 className='text-xl leading-none font-black text-white uppercase drop-shadow-xl font-benzin mb-10'>
              1 000 000 COM
            </h1>

            <button className='bg-white text-black font-extrabold text-sm py-4 px-10 rounded-full shadow-xl hover:bg-gray-100 active:scale-95 transition-all uppercase tracking-wide'>
              Играть • 100 сом
            </button>
          </div>
        </SwiperSlide>
        <SwiperSlide className='relative w-full h-full'>
          <div className='absolute inset-0 z-0'>
            <Image
              src='/hero-banner-2.png'
              alt='Background'
              fill
              className='object-cover'
              priority
            />
            <div className='absolute inset-0 bg-black/10' />
          </div>

          <div className='relative z-10 flex flex-col items-center justify-start h-full pt-12 text-center'>
            <div className='mb-10 w-32 h-auto relative'>
              <Image
                src='/logo.png'
                alt='KG Loto'
                width={140}
                height={50}
                className='object-contain drop-shadow-lg'
              />
            </div>

            <div className='flex flex-col gap-1 mb-2 text-xl font-benzin leading-tight uppercase font-black'>
              <h2 className='text-white drop-shadow-md'>ВЫИГРЫВАЕТ КАЖДЫЙ</h2>
              <h2 className='text-[#FFD600] drop-shadow-md'>ВТОРОЙ БИЛЕТ</h2>
            </div>

            <p className='text-xs text-white/90 font-medium mb-1 uppercase tracking-widest mt-4'>
              Суперприз от
            </p>

            {/* Огромная сумма */}
            <h1 className='text-xl leading-none font-black text-white uppercase drop-shadow-xl font-benzin mb-10'>
              1 000 000 COM
            </h1>

            <button className='bg-white text-black font-extrabold text-sm py-4 px-10 rounded-full shadow-xl hover:bg-gray-100 active:scale-95 transition-all uppercase tracking-wide'>
              Играть • 100 сом
            </button>
          </div>
        </SwiperSlide>
      </Swiper>

      <div className='absolute bottom-0 left-0 right-0 z-20 h-30 bg-linear-to-t from-white via-white/30 to-transparent pointer-events-none' />

      <style jsx global>{`
        .hero-swiper .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.5) !important;
          width: 8px;
          height: 8px;
          opacity: 1;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          background: #ffd600 !important; /* Желтый активный */
          width: 24px !important;
          border-radius: 4px;
        }
        .hero-swiper .swiper-pagination {
          bottom: 50px !important; /* Поднимаем точки чуть выше */
        }
      `}</style>
    </section>
  );
};
