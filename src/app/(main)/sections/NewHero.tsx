'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, FreeMode } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { useRef } from 'react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

// --- МОКОВЫЕ ДАННЫЕ ---

const HERO_SLIDES = [
  {
    id: 1,
    title: 'С НАМИ\nВЫИГРЫШ\nКАЖДЫЙ\nДЕНЬ!',
    imageFront:
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1920&auto=format&fit=crop',
    imageBack:
      'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=1920&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'ИСПЫТАЙ\nСВОЮ\nУДАЧУ\nПРЯМО СЕЙЧАС!',
    imageFront:
      'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=1920&auto=format&fit=crop',
    imageBack:
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1920&auto=format&fit=crop',
  },
];

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

const NewHero = () => {
  const heroRef = useRef<HTMLDivElement | null>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const el = e.currentTarget;
    el.style.setProperty('--mask-x', `${x}%`);
    el.style.setProperty('--mask-y', `${y}%`);
  };

  return (
    <div className='w-full bg-[#FFFBF4] pt-6 pb-20 font-rubik overflow-hidden'>
      {/* ======================= */}
      {/* HERO */}
      {/* ======================= */}
      <section className='max-w-300 mx-auto px-4 relative mb-16'>
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{
            prevEl: '.hero-prev',
            nextEl: '.hero-next',
          }}
          className='rounded-4xl md:rounded-[40px] overflow-hidden shadow-lg'
        >
          {HERO_SLIDES.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div
                ref={heroRef}
                className='relative w-full aspect-4/3 md:aspect-21/9 flex items-center touch-none'
                onPointerMove={handlePointerMove}
              >
                <div className='absolute inset-0 w-full h-full z-0 select-none pointer-events-none'>
                  {/* Передняя картинка */}
                  <Image
                    src={slide.imageFront}
                    alt='Hero Front'
                    fill
                    className='object-cover'
                    priority={slide.id === 1}
                  />

                  {/* Задняя картинка с маской */}
                  <div className='absolute inset-0 w-full h-full reveal-layer'>
                    <Image
                      src={slide.imageBack}
                      alt='Hero Back'
                      fill
                      className='object-cover'
                      priority={slide.id === 1}
                    />
                  </div>
                </div>

                <div className='relative z-10 pl-8 md:pl-16 max-w-2xl pointer-events-none'>
                  <h1 className='text-3xl md:text-5xl lg:text-6xl font-black font-benzin text-white uppercase leading-[1.1] whitespace-pre-line drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]'>
                    {slide.title}
                  </h1>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <button className='hero-prev absolute left-8 top-1/2 -translate-y-1/2 z-10 text-white/70 hover:text-white transition-colors'>
          <ChevronLeft size={48} strokeWidth={1} />
        </button>
        <button className='hero-next absolute right-8 top-1/2 -translate-y-1/2 z-10 text-white/70 hover:text-white transition-colors'>
          <ChevronRight size={48} strokeWidth={1} />
        </button>
      </section>

      {/* ======================= */}
      {/* WINNERS */}
      {/* ======================= */}
      <section className='max-w-300 mx-auto px-4 relative'>
        <h2 className='text-2xl md:text-3xl font-black font-benzin uppercase text-[#1C2035] mb-8'>
          Недавние победители
        </h2>

        <div className='relative'>
          <Swiper
            modules={[Autoplay, FreeMode]}
            freeMode={true}
            loop={true}
            speed={4000}
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
                    'relative bg-white rounded-3xl p-6 flex flex-col items-center justify-center gap-4 text-center border shadow-sm transition-transform hover:-translate-y-1 overflow-hidden min-h-35',
                    winner.isYellow ? 'border-[#FFD600]' : 'border-gray-200',
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

                  {/* Контент поверх логотипа (z-10) */}
                  <span className='relative z-10 text-xs font-bold text-[#1C2035]'>
                    {winner.date}
                  </span>

                  <div
                    className={clsx(
                      'relative z-10 text-3xl font-black font-benzin tracking-tight flex items-end gap-1',
                      winner.isYellow ? 'text-[#FFD600]' : 'text-[#E97625]',
                    )}
                  >
                    {winner.amount}
                    <span className='text-xl underline decoration-2 underline-offset-4 mb-0.5'>
                      {winner.currency}
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* CSS */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .reveal-layer {
            clip-path: circle(20% at var(--mask-x, 50%) var(--mask-y, 50%));
            transition: clip-path 0.05s ease-out;
            will-change: clip-path;
          }

          .winners-marquee .swiper-wrapper {
            transition-timing-function: linear !important;
          }
        `,
        }}
      />
    </div>
  );
};

export default NewHero;
