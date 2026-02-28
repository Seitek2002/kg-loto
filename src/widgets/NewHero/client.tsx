'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { clsx } from 'clsx';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

export interface SliderItem {
  id: number;
  title: string;
  subtitle: string;
  prizeText: string;
  image: string;
  imageMobile: string | null;
  imageLayer: string | null;
  imageMobileLayer: string | null;
  hasAnimation: boolean;
  buttonText: string;
  buttonPrice: number | null;
  buttonLabel: string;
  buttonUrl: string;
}

interface NewHeroClientProps {
  slides: SliderItem[];
}

const MOCK_SLIDES: SliderItem[] = [
  {
    id: 1,
    title: 'United States',
    subtitle: '8,295 properties',
    prizeText: '',
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1920&auto=format&fit=crop',
    imageMobile: null,
    imageLayer:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1920&auto=format&fit=crop',
    imageMobileLayer: null,
    hasAnimation: true,
    buttonText: '',
    buttonPrice: null,
    buttonLabel: 'ИССЛЕДОВАТЬ',
    buttonUrl: '',
  },
  {
    id: 2,
    title: 'England',
    subtitle: '1,110 properties',
    prizeText: '',
    image:
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1920&auto=format&fit=crop',
    imageMobile: null,
    imageLayer: null,
    imageMobileLayer: null,
    hasAnimation: false,
    buttonText: '',
    buttonPrice: null,
    buttonLabel: 'ИССЛЕДОВАТЬ',
    buttonUrl: '',
  },
  {
    id: 3,
    title: 'France',
    subtitle: '314 properties',
    prizeText: '',
    image:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1920&auto=format&fit=crop',
    imageMobile: null,
    imageLayer: null,
    imageMobileLayer: null,
    hasAnimation: false,
    buttonText: '',
    buttonPrice: null,
    buttonLabel: 'ИССЛЕДОВАТЬ',
    buttonUrl: '',
  },
];

// Угол смещения между элементами на орбите
const ORBIT_STEP_DEG = 45;

export const NewHeroClient = ({ slides }: NewHeroClientProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlides = MOCK_SLIDES.length > 0 ? MOCK_SLIDES : slides;
  // const heroRef = useRef<HTMLDivElement | null>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const el = e.currentTarget;
    el.style.setProperty('--mask-x', `${x}%`);
    el.style.setProperty('--mask-y', `${y}%`);
  };

  if (!activeSlides || activeSlides.length === 0) return null;

  return (
    <div className='relative w-full bg-gradient-to-b from-[#8b58d6] to-[#bca6db] pt-32 pb-24 font-rubik overflow-hidden h-[600px] md:h-[650px] flex items-center'>
      {/* 🔥 ФОНОВАЯ ПЛАНЕТА С ОРБИТОЙ */}
      <div className='absolute bottom-[-5%] md:bottom-[-25%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] md:w-[700px] md:h-[700px] z-0 pointer-events-none'>
        <motion.div
          animate={{ rotate: activeIndex * -ORBIT_STEP_DEG }}
          transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
          className='w-full h-full relative'
        >
          {/* Сам глобус */}
          <Image
            src='/globe.svg'
            alt='Planet'
            fill
            className='object-contain opacity-40 md:opacity-100 drop-shadow-2xl'
            priority
          />

          {/* 🔥 Элементы на орбите (Иконки + Текст) */}
          {activeSlides.map((slide, i) => (
            <div
              key={`orbit-${slide.id}`}
              className='absolute top-1/2 left-1/2 flex flex-col items-center justify-center origin-center'
              style={{
                // 1. Ставим в центр (-50%, -50%)
                // 2. Поворачиваем на нужный градус (0, 45, 90...)
                transform: `translate(-50%, -50%) rotate(${i * ORBIT_STEP_DEG}deg)`,
              }}
            >
              {/* 3. Отдаляем от центра (это радиус орбиты). -250px для мобилок, -440px для ПК */}
              <div className='flex flex-col items-center -translate-y-[250px] md:-translate-y-[380px]'>
                {/* Круглая фотка/иконка страны (заменишь потом на png) */}
                <div className='w-14 h-14 md:w-24 md:h-24 relative rounded-full overflow-hidden border-4 border-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] bg-white'>
                  <Image
                    src={slide.image}
                    fill
                    className='object-cover'
                    alt={slide.title}
                  />
                </div>

                {/* Название страны */}
                <span className='mt-3 font-benzin font-black text-white text-sm md:text-2xl uppercase tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] whitespace-nowrap'>
                  {slide.title}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* КАРТОЧКИ */}
      <section className='w-full relative z-10 mt-12 md:mt-32'>
        <Swiper
          modules={[Navigation]}
          centeredSlides={true}
          slidesPerView={'auto'}
          spaceBetween={40}
          speed={1000}
          navigation={{
            prevEl: '.hero-prev',
            nextEl: '.hero-next',
          }}
          allowTouchMove={false}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className='!overflow-visible'
        >
          {activeSlides.map((slide, index) => (
            <SwiperSlide
              key={slide.id}
              className='!w-[85%] sm:!w-[70%] md:!w-[55%] lg:!w-[45%]'
            >
              {({ isActive }) => (
                <div
                  className={clsx(
                    'relative max-w-[80%] mx-auto aspect-[4/3] md:aspect-[3/2] rounded-[30px] md:rounded-[40px] overflow-hidden shadow-2xl touch-none transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]',
                    isActive
                      ? 'scale-100 opacity-100'
                      : 'scale-[0.8] opacity-60 blur-[2px]',
                  )}
                  onPointerMove={
                    slide.hasAnimation && isActive
                      ? handlePointerMove
                      : undefined
                  }
                >
                  <div className='absolute inset-0 w-full h-full z-0 pointer-events-none'>
                    <picture>
                      {slide.imageMobile && (
                        <source
                          media='(max-width: 768px)'
                          srcSet={slide.imageMobile}
                        />
                      )}
                      <Image
                        src={slide.image}
                        alt='Hero Front'
                        fill
                        className='object-cover'
                        priority={index === 0}
                      />
                    </picture>

                    {slide.hasAnimation && slide.imageLayer && isActive && (
                      <div className='absolute inset-0 w-full h-full reveal-layer'>
                        <picture>
                          {slide.imageMobileLayer && (
                            <source
                              media='(max-width: 768px)'
                              srcSet={slide.imageMobileLayer}
                            />
                          )}
                          <Image
                            src={slide.imageLayer}
                            alt='Hero Back'
                            fill
                            className='object-cover'
                            priority={index === 0}
                          />
                        </picture>
                      </div>
                    )}
                  </div>

                  {/* 🔥 Обернули весь текстовый блок и градиент в проверку !slide.hasAnimation */}
                  {!slide.hasAnimation && (
                    <div
                      className={clsx(
                        'absolute bottom-0 left-0 w-full p-8 md:p-12 z-10 pointer-events-none bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-700 delay-300',
                        isActive ? 'opacity-100' : 'opacity-0',
                      )}
                    >
                      {slide.title && slide.title !== 'o' && (
                        <h1 className='text-3xl md:text-5xl lg:text-6xl font-black font-benzin text-white leading-tight drop-shadow-md mb-2'>
                          {slide.title}
                        </h1>
                      )}

                      {slide.subtitle && (
                        <p className='text-lg md:text-xl font-bold font-rubik text-gray-200 drop-shadow-md mb-4'>
                          {slide.subtitle}
                        </p>
                      )}

                      {slide.buttonLabel && (
                        <div className='inline-block pointer-events-auto mt-2'>
                          <MagneticButton>
                            <button className='px-8 py-4 bg-[#FFD600] text-[#2D2D2D] rounded-full font-benzin font-bold text-sm shadow-lg hover:scale-105 transition-transform'>
                              {slide.buttonLabel}
                            </button>
                          </MagneticButton>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        <button className='hero-prev absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-20 text-white/70 hover:text-white hover:scale-110 transition-all cursor-pointer bg-black/20 p-2 md:p-4 rounded-full backdrop-blur-md'>
          <ChevronLeft size={36} strokeWidth={2} />
        </button>
        <button className='hero-next absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-20 text-white/70 hover:text-white hover:scale-110 transition-all cursor-pointer bg-black/20 p-2 md:p-4 rounded-full backdrop-blur-md'>
          <ChevronRight size={36} strokeWidth={2} />
        </button>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .reveal-layer {
            clip-path: circle(25% at var(--mask-x, 50%) var(--mask-y, 50%));
            will-change: clip-path;
          }
        `,
        }}
      />
    </div>
  );
};
