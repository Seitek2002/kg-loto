'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { Autoplay, FreeMode } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

// 🔥 ДОБАВЛЕНЫ ССЫЛКИ НА ЛОГОТИПЫ
const RECENT_WINNERS = [
  {
    id: 1,
    date: 'Сегодня',
    amount: '700',
    currency: 'С',
    logo: '/lotteries-logo/1.png',
    isYellow: false,
  },
  {
    id: 2,
    date: 'Сегодня',
    amount: '7 105 000',
    currency: 'С',
    logo: '/lotteries-logo/2.png',
    isYellow: false,
  },
  {
    id: 3,
    date: 'Вчера',
    amount: '700 000',
    currency: 'С',
    logo: '/lotteries-logo/3.png',
    isYellow: true,
  },
  {
    id: 4,
    date: 'Вчера',
    amount: '3 000',
    currency: 'С',
    logo: '/lotteries-logo/1.png',
    isYellow: false,
  },
  {
    id: 5,
    date: 'Вчера',
    amount: '6 700',
    currency: 'С',
    logo: '/lotteries-logo/2.png',
    isYellow: true,
  },
  {
    id: 6,
    date: 'Сегодня',
    amount: '15 000',
    currency: 'С',
    logo: '/lotteries-logo/3.png',
    isYellow: false,
  },
  {
    id: 7,
    date: 'Вчера',
    amount: '50 000',
    currency: 'С',
    logo: '/lotteries-logo/1.png',
    isYellow: false,
  },
];

const UnderHero = () => {
  return (
    <section className='max-w-300 mx-auto px-4 relative'>
      <h2 className='text-2xl md:text-3xl font-black font-benzin uppercase text-[#1C2035] mb-8'>
        Недавние победители
      </h2>

      <div className='relative'>
        <Swiper
          modules={[Autoplay, FreeMode]}
          freeMode={true}
          speed={10000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          slidesPerView={'auto'}
          spaceBetween={16}
          className='winners-marquee'
        >
          {RECENT_WINNERS.map((winner, idx) => (
            <SwiperSlide
              key={`${winner.id}-${idx}`}
              className='w-65! md:w-70! py-2'
            >
              <div
                className={clsx(
                  // 🔥 ДОБАВЛЕНЫ relative и overflow-hidden
                  'relative bg-[url("/ticket-bg.svg")] bg-no-repeat bg-center px-6 flex flex-col items-center justify-center gap-4 text-center transition-transform hover:-translate-y-1 overflow-hidden min-h-[186px]',
                  winner.isYellow ? '' : '',
                )}
              >
                {/* 🔥 ФОНОВЫЙ ЛОГОТИП */}
                <div className='absolute inset-0 z-0 pointer-events-none opacity-10 flex items-center justify-center p-4'>
                  <Image
                    src={winner.logo}
                    alt='Lottery Logo'
                    fill
                    className='object-contain scale-110' // scale-110 делает водяной знак чуть крупнее
                  />
                </div>

                <div
                  className={clsx(
                    'relative z-10 text-3xl font-black font-benzin tracking-tight flex items-end gap-1 mt-auto',
                    winner.isYellow ? 'text-[#FFD600]' : 'text-[#E97625]',
                  )}
                >
                  {winner.amount}
                  <span className='text-xl underline decoration-2 underline-offset-4 mb-0.5'>
                    {winner.currency}
                  </span>
                </div>

                {/* Контент поверх логотипа (z-10) */}
                <div className='relative w-full py-2.5 z-10 text-xs mt-auto font-bold text-[#1C2035] border-t-[3px] border-black border-dotted'>
                  {winner.date}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* CSS */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .winners-marquee .swiper-wrapper {
            transition-timing-function: linear !important;
          }
        `,
        }}
      />
    </section>
  );
};

export default UnderHero;
