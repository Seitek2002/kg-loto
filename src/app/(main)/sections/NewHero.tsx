'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, FreeMode } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

// Стили Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

// --- МОКОВЫЕ ДАННЫЕ ---

const HERO_SLIDES = [
  {
    id: 1,
    title: 'С НАМИ\nВЫИГРЫШ\nКАЖДЫЙ\nДЕНЬ!',
    // Картинка из интернета для примера (Девушки с шампанским)
    image:
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1920&auto=format&fit=crop',
    bgColor: 'bg-gradient-to-r from-[#F4A836] to-[#E97625]',
  },
  {
    id: 2,
    title: 'ИСПЫТАЙ\nСВОЮ\nУДАЧУ\nПРЯМО СЕЙЧАС!',
    image:
      'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=1920&auto=format&fit=crop',
    bgColor: 'bg-gradient-to-r from-[#2196F3] to-[#0D47A1]',
  },
];

const RECENT_WINNERS = [
  {
    id: 1,
    date: 'Сегодня',
    amount: '700',
    currency: 'С',
    lottery: 'Сумма фортуны',
    isYellow: false,
  },
  {
    id: 2,
    date: 'Сегодня',
    amount: '7 105 000',
    currency: 'С',
    lottery: 'Добрые дела',
    isYellow: false,
  },
  {
    id: 3,
    date: 'Вчера',
    amount: '700 000',
    currency: 'С',
    lottery: 'Добрые дела',
    isYellow: true,
  },
  {
    id: 4,
    date: 'Вчера',
    amount: '3 000',
    currency: 'С',
    lottery: 'Великолепная',
    isYellow: false,
  },
  {
    id: 5,
    date: 'Вчера',
    amount: '6 700',
    currency: 'С',
    lottery: 'Слова и мы',
    isYellow: true,
  },
  {
    id: 6,
    date: 'Сегодня',
    amount: '15 000',
    currency: 'С',
    lottery: 'Мечталлион',
    isYellow: false,
  },
  {
    id: 7,
    date: 'Вчера',
    amount: '50 000',
    currency: 'С',
    lottery: 'Удача',
    isYellow: false,
  },
];

const NewHero = () => {
  return (
    <div className='w-full bg-[#FFFBF4] pt-6 pb-20 font-rubik overflow-hidden'>
      {/* ======================= */}
      {/* 1. БЛОК HERO СЛАЙДЕРА */}
      {/* ======================= */}
      <section className='max-w-[1200px] mx-auto px-4 relative mb-16'>
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{
            prevEl: '.hero-prev',
            nextEl: '.hero-next',
          }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          className='rounded-[32px] md:rounded-[40px] overflow-hidden shadow-lg'
        >
          {HERO_SLIDES.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div
                className={clsx(
                  'relative w-full aspect-[4/3] md:aspect-[21/9] flex items-center',
                  slide.bgColor,
                )}
              >
                {/* Картинка на фоне (сдвинута вправо) */}
                <div className='absolute right-0 top-0 bottom-0 w-[80%] md:w-[60%] z-0'>
                  <Image
                    src={slide.image}
                    alt='Hero'
                    fill
                    className='object-cover object-center mix-blend-overlay opacity-90'
                    priority
                  />
                  {/* Градиент для плавного перехода от цвета к картинке */}
                  <div className='absolute inset-0 bg-gradient-to-r from-[#F4A836] via-[#F4A836]/40 to-transparent' />
                </div>

                {/* Текст */}
                <div className='relative z-10 pl-8 md:pl-16 max-w-2xl'>
                  <h1 className='text-3xl md:text-5xl lg:text-6xl font-black font-benzin text-white uppercase leading-[1.1] whitespace-pre-line'>
                    {slide.title}
                  </h1>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Кнопки навигации Hero */}
        <button className='hero-prev absolute left-8 top-1/2 -translate-y-1/2 z-10 text-white/70 hover:text-white transition-colors'>
          <ChevronLeft size={48} strokeWidth={1} />
        </button>
        <button className='hero-next absolute right-8 top-1/2 -translate-y-1/2 z-10 text-white/70 hover:text-white transition-colors'>
          <ChevronRight size={48} strokeWidth={1} />
        </button>
      </section>

      {/* ======================= */}
      {/* 2. БЛОК НЕДАВНИЕ ПОБЕДИТЕЛИ */}
      {/* ======================= */}
      <section className='max-w-[1200px] mx-auto px-4 relative'>
        <h2 className='text-2xl md:text-3xl font-black font-benzin uppercase text-[#1C2035] mb-8'>
          Недавние победители
        </h2>

        <div className='relative'>
          <Swiper
            modules={[Autoplay, Navigation, FreeMode]}
            navigation={{
              prevEl: '.winners-prev',
              nextEl: '.winners-next',
            }}
            // Настройки для эффекта бесконечной бегущей строки (Marquee)
            freeMode={true}
            loop={true}
            speed={4000} // Скорость прокрутки (линейная)
            autoplay={{
              delay: 0, // Без остановок
              disableOnInteraction: false,
              pauseOnMouseEnter: true, // 🔥 ОСТАНОВКА ПРИ НАВЕДЕНИИ
            }}
            slidesPerView={'auto'} // Ширина карточек определяется их CSS
            spaceBetween={16}
            className='winners-marquee'
          >
            {RECENT_WINNERS.map((winner, idx) => (
              <SwiperSlide
                key={`${winner.id}-${idx}`}
                className='!w-[260px] md:!w-[280px] py-2'
              >
                <div
                  className={clsx(
                    'bg-white rounded-[24px] p-6 flex flex-col items-center justify-center gap-4 text-center border shadow-sm transition-transform hover:-translate-y-1',
                    winner.isYellow ? 'border-[#FFD600]' : 'border-gray-200',
                  )}
                >
                  <span className='text-xs font-bold text-[#1C2035]'>
                    {winner.date}
                  </span>

                  <div
                    className={clsx(
                      'text-3xl font-black font-benzin tracking-tight flex items-end gap-1',
                      winner.isYellow ? 'text-[#FFD600]' : 'text-[#E97625]',
                    )}
                  >
                    {winner.amount}
                    <span className='text-xl underline decoration-2 underline-offset-4 mb-0.5'>
                      {winner.currency}
                    </span>
                  </div>

                  <div className='flex items-center gap-2 mt-2'>
                    {/* Аватарка/иконка лотереи */}
                    <div className='w-5 h-5 rounded overflow-hidden relative'>
                      <Image
                        src='https://images.unsplash.com/photo-1513689620023-e18e38cb3c68?q=80&w=100&auto=format&fit=crop'
                        alt={winner.lottery}
                        fill
                        className='object-cover'
                      />
                    </div>
                    <span className='text-[10px] font-bold text-gray-400 uppercase'>
                      {winner.lottery}
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Стрелки навигации для победителей (если пользователь захочет листать руками) */}
          <button className='winners-prev absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 text-gray-400 hover:text-gray-900 shadow-md transition-colors'>
            <ChevronLeft size={24} strokeWidth={2} />
          </button>
          <button className='winners-next absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 text-gray-400 hover:text-gray-900 shadow-md transition-colors'>
            <ChevronRight size={24} strokeWidth={2} />
          </button>
        </div>
      </section>

      {/* 🔥 CSS-ХАК ДЛЯ БЕГУЩЕЙ СТРОКИ */}
      {/* По умолчанию Swiper замедляется в конце каждого слайда (ease-out). 
          Чтобы строка ехала плавно и без рывков, меняем функцию времени на linear */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
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
