'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const slides = [
  {
    id: 1,
    bg: '/hero-banner-1.png',
    title1: 'ВЫИГРЫВАЕТ КАЖДЫЙ',
    title2: 'ВТОРОЙ БИЛЕТ',
    prize: '1 000 000 COM',
    price: '100 сом',
  },
  {
    id: 2,
    bg: '/hero-banner-2.png',
    title1: 'ЗОЛОТАЯ ЛИХОРАДКА',
    title2: 'СПЕШИТЕ ВЫИГРАТЬ',
    prize: '500 000 COM',
    price: '200 сом',
  },
];

export const Hero = () => {
  return (
    <section className='relative w-full overflow-hidden mx-auto'>
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        centeredSlides
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className='h-[80vh] lg:h-screen w-full hero-swiper'
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id} className='relative w-full h-full pt-20'>
            <div className='absolute inset-0 z-0'>
              <Image
                src={slide.bg}
                alt='Background'
                fill
                className='object-cover'
                priority={index === 0}
                fetchPriority={index === 0 ? "high" : "auto"}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
              <div className='absolute inset-0 bg-black/10' />
            </div>

            <div className='relative z-10 flex flex-col items-center justify-center h-full pt-12 text-center'>
              <div className='mb-10 w-32 h-auto relative lg:hidden'>
                <Image
                  src='/logo.png'
                  alt='KG Loto'
                  width={140}
                  height={50}
                  className='object-contain drop-shadow-lg'
                />
              </div>

              <div className='flex flex-col gap-1 mb-2 text-xl lg:text-6xl font-benzin leading-tight uppercase font-black'>
                <h2 className='text-white drop-shadow-md'>{slide.title1}</h2>
                <h2 className='text-[#FFD600] drop-shadow-md'>
                  {slide.title2}
                </h2>
              </div>

              <p className='text-xs lg:text-3xl text-white/90 font-medium mb-1 uppercase tracking-widest mt-4'>
                Суперприз от
              </p>

              <h1 className='text-xl lg:text-6xl leading-none font-black text-white uppercase drop-shadow-xl font-benzin mb-10'>
                {slide.prize}
              </h1>

              <button className='bg-white text-black font-extrabold text-sm lg:text-xl py-4 px-10 rounded-full shadow-xl hover:bg-gray-100 active:scale-95 transition-all uppercase tracking-wide'>
                Играть • {slide.price}
              </button>
            </div>
          </SwiperSlide>
        ))}
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
          background: #ffd600 !important;
          width: 24px !important;
          border-radius: 4px;
        }
        .hero-swiper .swiper-pagination {
          bottom: 50px !important;
        }
      `}</style>
    </section>
  );
};
