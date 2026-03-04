'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

import { HeroBackground } from './HeroBackground';
import { HeroOrbitItem } from './HeroOrbitItem';
import { HeroCard } from './HeroCard';
import { SliderItem } from '@/types/api';

interface NewHeroClientProps {
  slides?: SliderItem[];
}

const MOCK_SLIDES: SliderItem[] = [
  {
    id: 6,
    title: 'НАДО',
    subtitle: 'Тут мог быть "Подтекст"',
    prizeText: 'MacBook Air 15',
    image: {
      url: 'https://crm.kgloto.com/media/slider/2026/03/02/1.json',
      type: 'lottie',
    },
    imageMobile: null,
    imageLayer: null,
    imageMobileLayer: null,
    backgroundImage: null,
    logo: null,
    hasAnimation: false,
    buttonText: 'Играть',
    buttonPrice: 236,
    buttonLabel: 'ИГРАТЬ • 236 СОМ',
    buttonUrl: '',
  },
  {
    id: 5,
    title: 'УЧАСТВУЙ',
    subtitle: 'Тут мог быть "Подтекст"',
    prizeText: 'IPhone 17 pro max',
    image: {
      url: 'https://crm.kgloto.com/media/slider/2026/03/02/3.json',
      type: 'lottie',
    },
    imageMobile: {
      url: 'https://crm.kgloto.com/media/slider/2026/03/02/2.json',
      type: 'lottie',
    },
    imageLayer: {
      url: 'https://crm.kgloto.com/media/slider/2026/03/02/2.lottie',
      type: 'lottie',
    },
    imageMobileLayer: {
      url: 'https://crm.kgloto.com/media/slider/2026/03/02/Head_%D0%9C%D0%B8%D0%BB%D0%BB%D0%B8%D0%BE%D0%BD%D0%B5%D1%80.jpg',
      type: 'image',
    },
    backgroundImage: null,
    logo: null,
    hasAnimation: true,
    buttonText: 'Играть',
    buttonPrice: 136,
    buttonLabel: 'ИГРАТЬ • 136 СОМ',
    buttonUrl: 'https://kg-loto.netlify.app/lottery/3',
  },
  {
    id: 4,
    title: 'ooo',
    subtitle: 'ooo',
    prizeText: '10000',
    image: {
      url: 'https://crm.kgloto.com/media/slider/2026/03/02/009631dd-e069-445d-9f9b-883997034fa6.png',
      type: 'image',
    },
    imageMobile: {
      url: 'https://crm.kgloto.com/media/slider/2026/03/02/5ab25897-d4c1-4590-9143-8f04f9eddb17.png',
      type: 'image',
    },
    imageLayer: {
      url: 'https://crm.kgloto.com/media/slider/2026/03/02/5ab25897-d4c1-4590-9143-8f04f9eddb17_A6bvoeG.png',
      type: 'image',
    },
    imageMobileLayer: {
      url: 'https://crm.kgloto.com/media/slider/2026/03/02/5ab25897-d4c1-4590-9143-8f04f9eddb17_lTKfbye.png',
      type: 'image',
    },
    backgroundImage:
      'https://crm.kgloto.com/media/slider/backgrounds/2026/03/02/anime-meme-background-w13zt6adj4t13chk.jpg',
    logo: 'https://crm.kgloto.com/media/slider/logos/2026/03/02/d2c16d99034f9407fd708dfc3356c688.jpg',
    hasAnimation: true,
    buttonText: 'Играть',
    buttonPrice: 100,
    buttonLabel: 'ИГРАТЬ • 100 СОМ',
    buttonUrl: 'https://crm.kgloto.com/admin/content/slider/add/',
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
  const [activeIndex, setActiveIndex] = useState(0);

  if (!activeSlides || activeSlides.length === 0) return null;

  return (
    <div className='relative w-full pt-28 md:pt-32 pb-20 md:pb-24 font-rubik overflow-hidden min-h-[500px] md:min-h-[650px] flex items-center bg-[#0a235c]'>
      {/* 1. Глобальный фон с кроссфейдом */}
      <HeroBackground slides={activeSlides} activeIndex={activeIndex} />

      {/* 2. Орбита (строго без глобуса) */}
      <div className='absolute bottom-[5%] md:bottom-[-25%] left-1/2 -translate-x-1/2 w-[70%] h-[70%] md:w-[100%] md:h-[100%] mx-auto z-0 pointer-events-none'>
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
              <HeroOrbitItem slide={slide} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* 3. Карточки лотерей (Свайпер) */}
      <section className='w-full max-w-[1440px] mx-auto z-10 mt-16 md:mt-24'>
        <Swiper
          modules={[Navigation]}
          centeredSlides={true}
          slidesPerView={'auto'}
          initialSlide={0}
          spaceBetween={16}
          speed={800}
          navigation={{ prevEl: '.hero-prev', nextEl: '.hero-next' }}
          allowTouchMove={true}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className='!overflow-visible px-4'
          breakpoints={{ 768: { spaceBetween: 40 } }}
        >
          {activeSlides.map((slide, index) => (
            <SwiperSlide
              key={slide.id}
              className='!w-[85%] sm:!w-[70%] md:!w-[60%] lg:!w-[55%] mx-auto'
            >
              {({ isActive }) => (
                <HeroCard
                  slide={slide}
                  isActive={isActive}
                  fallbackGradient={
                    FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length]
                  }
                />
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Кнопки переключения (скрыты на мобилках) */}
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
