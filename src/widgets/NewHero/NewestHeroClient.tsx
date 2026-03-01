'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

// 🔥 ТОЧНЫЙ ИНТЕРФЕЙС КАК С БЭКЕНДА
export interface SliderItem {
  id: number;
  title: string;
  subtitle: string;
  prizeText: string;
  image: string;
  imageMobile: string | null;
  imageLayer: string | null;
  imageMobileLayer: string | null;
  backgroundImage: string | null;
  logo: string | null;
  hasAnimation: boolean;
  buttonText: string;
  buttonPrice: number | null;
  buttonLabel: string;
  buttonUrl: string;
}

interface NewHeroClientProps {
  slides?: SliderItem[];
}

const MOCK_SLIDES: SliderItem[] = [
  {
    id: 1,
    title: 'Оной',
    subtitle: 'Призовой фонд 6 000 000 сом',
    prizeText: '500 000 СОМ',
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=200&auto=format&fit=crop',
    imageMobile: null,
    imageLayer: null,
    imageMobileLayer: null,
    backgroundImage: null,
    logo: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=200&auto=format&fit=crop',
    hasAnimation: true,
    buttonText: 'Играть',
    buttonPrice: 50,
    buttonLabel: 'ИГРАТЬ • 50 СОМ',
    buttonUrl: '',
  },
  {
    id: 2,
    title: 'Мен миллионер',
    subtitle: 'Призовой фонд 10 000 000 сом',
    prizeText: '1 000 000 СОМ',
    image:
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=200&auto=format&fit=crop',
    imageMobile: null,
    imageLayer: null,
    imageMobileLayer: null,
    backgroundImage:
      'https://crm.kgloto.com/media/slider/backgrounds/2026/03/01/images.jpeg',
    logo: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=200&auto=format&fit=crop',
    hasAnimation: true,
    buttonText: 'Играть',
    buttonPrice: 100,
    buttonLabel: 'ИГРАТЬ • 100 СОМ',
    buttonUrl: '',
  },
  {
    id: 3,
    title: 'Уйго белек',
    subtitle: 'Призовой фонд 24 000 000 сом',
    prizeText: '3 000 000 СОМ',
    image:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=200&auto=format&fit=crop',
    imageMobile: null,
    imageLayer: null,
    imageMobileLayer: null,
    backgroundImage: null,
    logo: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=200&auto=format&fit=crop',
    hasAnimation: true,
    buttonText: 'Играть',
    buttonPrice: 200,
    buttonLabel: 'ИГРАТЬ • 200 СОМ',
    buttonUrl: '',
  },
];

const ORBIT_STEP_DEG = 45;

const FALLBACK_GRADIENTS = [
  'linear-gradient(135deg, #4a3b2c, #8b6b4a)',
  'linear-gradient(135deg, #8b58d6, #bca6db)',
  'linear-gradient(135deg, #d68b58, #dba68c)',
];

export const NewestHeroClient = ({ slides }: NewHeroClientProps) => {
  const [activeIndex, setActiveIndex] = useState(1);
  const activeSlides = slides && slides.length > 0 ? slides : MOCK_SLIDES;

  if (!activeSlides || activeSlides.length === 0) return null;

  return (
    <div className='relative w-full pt-32 pb-24 font-rubik overflow-hidden min-h-[500px] md:min-h-[650px] flex items-center bg-[#0a235c]'>
      {/* ========================================================= */}
      {/* 🔥 ГЛОБАЛЬНЫЙ ФОН С FADE ЭФФЕКТОМ */}
      {/* ========================================================= */}
      <div className='absolute inset-0 z-0 pointer-events-none'>
        {/* 1. Дефолтный фон (заглушка) всегда лежит в самом низу */}
        <Image
          src='/images/hero/main-bg.png' // Твоя локальная фотка
          alt='Default Background'
          fill
          className='object-cover opacity-80'
          priority
        />

        {/* 2. Рендерим фоны всех слайдов и меняем им opacity (плавный переход) */}
        {activeSlides.map((slide, index) => {
          if (!slide.backgroundImage) return null; // Если с бэка пришел null, фон просто не отрендерится, и будет видна заглушка

          return (
            <Image
              key={`bg-${slide.id}`}
              src={slide.backgroundImage}
              alt={`Background ${slide.id}`}
              fill
              className={clsx(
                'object-cover transition-opacity duration-700 ease-in-out', // duration-700 совпадает со скоростью свайпа
                activeIndex === index ? 'opacity-100' : 'opacity-0',
              )}
              priority={index === 1} // Грузим в первую очередь центральный слайд
            />
          );
        })}

        {/* 3. Затемнение поверх всех фонов, чтобы текст хорошо читался */}
        <div className='absolute inset-0 bg-black/40 z-10' />
      </div>

      {/* ========================================================= */}
      {/* 🌍 ОРБИТА С ГЛОБУСОМ */}
      {/* ========================================================= */}
      <div className='absolute bottom-[-5%] md:bottom-[-25%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] md:w-[700px] md:h-[700px] z-0 pointer-events-none'>
        <motion.div
          animate={{ rotate: activeIndex * -ORBIT_STEP_DEG }}
          transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
          className='w-full h-full relative'
        >
          {/* <Image
            src='/globe.svg'
            alt='Planet'
            fill
            className='object-contain opacity-40 md:opacity-100 drop-shadow-2xl'
            priority
          /> */}

          {activeSlides.map((slide, i) => (
            <div
              key={`orbit-${slide.id}`}
              className='absolute top-1/2 left-1/2 flex flex-col items-center justify-center origin-center'
              style={{
                transform: `translate(-50%, -50%) rotate(${i * ORBIT_STEP_DEG}deg)`,
              }}
            >
              <div className='flex flex-col items-center -translate-y-[250px] md:-translate-y-[380px]'>
                <div className='w-14 h-14 md:w-24 md:h-24 relative rounded-full overflow-hidden border-4 border-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] bg-white'>
                  <Image
                    src={slide.logo || slide.image}
                    fill
                    className='object-cover'
                    alt={slide.title}
                  />
                </div>
                <span className='mt-3 font-benzin font-black text-white text-sm md:text-2xl uppercase tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] whitespace-nowrap'>
                  {slide.title === 'Главный приз' ? 'Миллионер' : slide.title}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ========================================================= */}
      {/* 🃏 НОВЫЕ КАРТОЧКИ (Свайпер) */}
      {/* ========================================================= */}
      <section className='max-w-[1440px] mx-auto relative z-10 mt-12 md:mt-24'>
        <Swiper
          modules={[Navigation]}
          centeredSlides={true}
          slidesPerView={'auto'}
          initialSlide={1}
          spaceBetween={20}
          speed={800}
          navigation={{
            prevEl: '.hero-prev',
            nextEl: '.hero-next',
          }}
          allowTouchMove={true}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className='!overflow-visible'
          breakpoints={{
            768: { spaceBetween: 40 },
          }}
        >
          {activeSlides.map((slide, index) => (
            <SwiperSlide
              key={slide.id}
              className='!w-[85%] sm:!w-[70%] md:!w-[55%] lg:!w-[50%]'
            >
              {({ isActive }) => (
                <div
                  className={clsx(
                    'relative w-full aspect-[4/3] md:aspect-[16/9] lg:aspect-[2/1] rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col items-center justify-center p-6 text-center text-white',
                    isActive
                      ? 'scale-100 opacity-100 z-20'
                      : 'scale-[0.85] opacity-60 blur-[2px] z-10',
                  )}
                >
                  {/* 🔥 ФОН КАРТОЧКИ */}
                  {slide.backgroundImage ? (
                    <Image
                      src={slide.backgroundImage}
                      alt={`Фон карточки ${slide.id}`}
                      fill
                      className='object-cover z-0'
                      priority={isActive}
                    />
                  ) : (
                    <div
                      className='absolute inset-0 w-full h-full z-0'
                      style={{
                        background:
                          FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length],
                      }}
                    />
                  )}

                  {/* 🔥 КОНТЕНТ КАРТОЧКИ */}
                  <div className='relative z-10 flex flex-col items-center w-full'>
                    <span className='text-[10px] md:text-sm font-medium uppercase font-rubik tracking-widest mb-2 md:mb-4'>
                      Главный приз
                    </span>

                    <h2 className='text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-benzin leading-none mb-4 md:mb-6 drop-shadow-lg uppercase'>
                      {slide.prizeText}
                    </h2>

                    {slide.subtitle && (
                      <div className='flex flex-col mb-6 md:mb-8'>
                        <span className='text-sm md:text-lg font-bold font-benzin tracking-wide uppercase'>
                          {slide.subtitle}
                        </span>
                      </div>
                    )}

                    <button className='bg-white text-[#2D2D2D] px-8 py-3.5 md:py-4 rounded-full font-bold font-benzin text-xs md:text-sm shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center gap-2'>
                      {slide.buttonLabel}
                    </button>
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Кнопки навигации */}
        <button className='hero-prev absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-30 text-white/70 hover:text-white hover:scale-110 transition-all cursor-pointer bg-white/10 p-2 md:p-4 rounded-full backdrop-blur-md border border-white/20'>
          <ChevronLeft size={36} strokeWidth={2} />
        </button>
        <button className='hero-next absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-30 text-white/70 hover:text-white hover:scale-110 transition-all cursor-pointer bg-white/10 p-2 md:p-4 rounded-full backdrop-blur-md border border-white/20'>
          <ChevronRight size={36} strokeWidth={2} />
        </button>
      </section>
    </div>
  );
};
