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
import { AnimatedPrizeText } from '@/components/ui/AnimatedPrizeText';

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
  const activeSlides = slides && slides.length > 0 ? slides : MOCK_SLIDES;
  const initialIndex = activeSlides.length > 1 ? 1 : 0;
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  if (!activeSlides || activeSlides.length === 0) return null;

  return (
    <div className='relative w-full pt-28 md:pt-32 pb-20 md:pb-24 font-rubik overflow-hidden min-h-[500px] md:min-h-[650px] flex items-center bg-[#0a235c]'>
      {/* ГЛОБАЛЬНЫЙ ФОН */}
      <div className='absolute inset-0 z-0 pointer-events-none'>
        <Image
          src='/images/hero/main-bg.png'
          alt='Default Background'
          fill
          sizes='100vw'
          className='object-cover opacity-80'
          priority
        />

        {activeSlides.map((slide, index) => {
          if (!slide.backgroundImage) return null;

          return (
            <Image
              key={`bg-${slide.id}`}
              src={slide.backgroundImage}
              alt={`Background ${slide.id}`}
              fill
              sizes='100vw'
              className={clsx(
                'object-cover transition-opacity duration-700 ease-in-out',
                activeIndex === index ? 'opacity-100' : 'opacity-0',
              )}
              priority={index === initialIndex}
            />
          );
        })}
        <div className='absolute inset-0 bg-black/30 z-10' />
      </div>

      {/* ОРБИТА С ГЛОБУСОМ */}
      {/* 🔥 Уменьшили размеры глобуса для мобилок: w-[340px] h-[340px] */}
      <div className='absolute bottom-[5%] md:bottom-[-25%] left-1/2 -translate-x-1/2 w-[80%] h-[80%] md:w-[100%] md:h-[100%] mx-auto z-0 pointer-events-none'>
        <motion.div
          animate={{ rotate: activeIndex * -ORBIT_STEP_DEG }}
          transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
          className='w-full h-full relative'
        >
          {activeSlides.map((slide, i) => (
            <div
              key={`orbit-${slide.id}`}
              className='absolute top-1/2 left-1/2 flex flex-col items-center justify-center origin-center'
              style={{
                transform: `translate(-50%, -50%) rotate(${i * ORBIT_STEP_DEG}deg)`,
              }}
            >
              {/* 🔥 Уменьшили радиус орбиты для мобилок: -translate-y-[180px] */}
              <div className='flex flex-col items-center -translate-y-[180px] md:-translate-y-[420px]'>
                {/* 🔥 Убрали скругления, бордеры и тени. Оставили только размеры и relative для Next.js Image */}
                <div className='w-20 h-16 md:w-40 md:h-28 relative'>
                  <Image
                    src={slide.logo || slide.image}
                    fill
                    sizes='(max-width: 768px) 80px, 160px'
                    className='object-contain drop-shadow-md' // 🔥 Заменили object-cover на object-contain
                    alt={slide.title}
                  />
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* НОВЫЕ КАРТОЧКИ (Свайпер) */}
      <section className='w-full max-w-[1440px] mx-auto z-10 mt-16 md:mt-24'>
        <Swiper
          modules={[Navigation]}
          centeredSlides={true}
          slidesPerView={'auto'}
          initialSlide={initialIndex}
          spaceBetween={16} // Чуть меньше отступ на мобилках
          speed={800}
          navigation={{
            prevEl: '.hero-prev',
            nextEl: '.hero-next',
          }}
          allowTouchMove={true}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className='!overflow-visible px-4' // Добавили px-4 чтобы карточки не липли к краям экрана
          breakpoints={{
            768: { spaceBetween: 40 },
          }}
        >
          {activeSlides.map((slide, index) => (
            <SwiperSlide
              key={slide.id}
              // 🔥 Исправили ширину: 85% на мобилках, 60% на ПК
              className='!w-[85%] sm:!w-[70%] md:!w-[60%] lg:!w-[55%] mx-auto'
            >
              {({ isActive }) => (
                <div
                  className={clsx(
                    'relative w-full aspect-[5/4] sm:aspect-[16/9] lg:aspect-[2/1] rounded-[24px] md:rounded-[40px] overflow-hidden shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col items-center justify-center p-4 md:p-8 text-center text-white',
                    isActive
                      ? 'scale-100 opacity-100 z-20'
                      : 'scale-[0.9] md:scale-[0.85] opacity-60 blur-[2px] z-10',
                  )}
                >
                  {slide.backgroundImage ? (
                    <Image
                      src={slide.backgroundImage}
                      alt={`Фон карточки ${slide.id}`}
                      fill
                      sizes='(max-width: 768px) 85vw, 60vw'
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

                  {/* КОНТЕНТ */}
                  <div className='relative z-10 flex flex-col items-center w-full'>
                    <span className='text-[9px] md:text-sm font-medium uppercase font-benzin tracking-widest mb-1.5 md:mb-4'>
                      Главный приз
                    </span>

                    {/* 🔥 Уменьшили шрифт для мобилок, чтобы он не переносился на новую строку */}
                    <h2 className='text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black leading-none mb-3 md:mb-6 drop-shadow-lg tabular-nums uppercase'>
                      <AnimatedPrizeText
                        text={slide.prizeText}
                        isActive={isActive}
                      />
                    </h2>

                    {slide.subtitle && (
                      <div className='flex flex-col mb-5 md:mb-8'>
                        <span className='text-xs md:text-lg font-bold tracking-wide uppercase'>
                          {slide.subtitle}
                        </span>
                      </div>
                    )}

                    <button className='bg-white text-[#2D2D2D] px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-[10px] md:text-sm shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center gap-2 uppercase'>
                      {slide.buttonLabel}
                    </button>
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        {/* 🔥 Скрыли стрелки на мобилках (hidden md:flex) */}
        <button className='hero-prev hidden md:flex items-center justify-center absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 text-white/70 hover:text-white hover:scale-110 transition-all cursor-pointer bg-white/10 p-3 md:p-4 rounded-full backdrop-blur-md border border-white/20'>
          <ChevronLeft size={36} strokeWidth={2} />
        </button>
        <button className='hero-next hidden md:flex items-center justify-center absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 text-white/70 hover:text-white hover:scale-110 transition-all cursor-pointer bg-white/10 p-3 md:p-4 rounded-full backdrop-blur-md border border-white/20'>
          <ChevronRight size={36} strokeWidth={2} />
        </button>
      </section>
    </div>
  );
};
