'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { MagneticButton } from '@/components/ui/MagneticButton';

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

export const NewHeroClient = ({ slides }: NewHeroClientProps) => {
  const heroRef = useRef<HTMLDivElement | null>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const el = e.currentTarget;
    el.style.setProperty('--mask-x', `${x}%`);
    el.style.setProperty('--mask-y', `${y}%`);
  };

  if (!slides || slides.length === 0) return null;

  return (
    <div className='w-full bg-[#FFFBF4] pt-6 pb-20 font-rubik overflow-hidden'>
      <section className='max-w-300 mx-auto px-4 relative mb-16'>
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: '.hero-prev',
            nextEl: '.hero-next',
          }}
          allowTouchMove={false}
          className='rounded-4xl md:rounded-[40px] overflow-hidden shadow-lg'
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={slide.id}>
              {({ isActive }) => (
                <div
                  ref={heroRef}
                  className='relative w-full aspect-4/3 md:aspect-21/9 flex items-center touch-none overflow-hidden'
                  onPointerMove={slide.hasAnimation ? handlePointerMove : undefined}
                >
                  {/* АНИМАЦИЯ КОНТЕЙНЕРА С КАРТИНКАМИ */}
                  <motion.div
                    initial={{ scale: 1.15 }}
                    animate={{ scale: isActive ? 1 : 1.15 }}
                    transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
                    className='absolute inset-0 w-full h-full z-0 select-none pointer-events-none'
                  >
                    {/* ПЕРЕДНЯЯ КАРТИНКА */}
                    <picture>
                      {slide.imageMobile && (
                        <source media="(max-width: 768px)" srcSet={slide.imageMobile} />
                      )}
                      <Image
                        src={slide.image}
                        alt='Hero Front'
                        fill
                        className='object-cover'
                        priority={index === 0} // Приоритет загрузки только для самого первого слайда
                      />
                    </picture>

                    {/* ЗАДНЯЯ КАРТИНКА (РЕНТГЕН) */}
                    {slide.hasAnimation && slide.imageLayer && (
                      <div className='absolute inset-0 w-full h-full reveal-layer'>
                        <picture>
                          {slide.imageMobileLayer && (
                            <source media="(max-width: 768px)" srcSet={slide.imageMobileLayer} />
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
                  </motion.div>

                  {/* ТЕКСТ И КНОПКИ */}
                  <div className='relative z-10 pl-8 md:pl-16 max-w-2xl pointer-events-none'>
                    
                    {slide.title && slide.title !== "o" && (
                      <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 40 }}
                        transition={{ duration: 0.8, delay: isActive ? 0.3 : 0, ease: [0.76, 0, 0.24, 1] }}
                        className='text-3xl md:text-5xl lg:text-6xl font-black font-benzin text-white uppercase leading-[1.1] whitespace-pre-line drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] mb-2'
                      >
                        {slide.title}
                      </motion.h1>
                    )}

                    {slide.subtitle && (
                      <motion.p
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 40 }}
                        transition={{ duration: 0.8, delay: isActive ? 0.4 : 0, ease: [0.76, 0, 0.24, 1] }}
                        className='text-lg md:text-2xl font-bold font-rubik text-white drop-shadow-md mb-6'
                      >
                        {slide.subtitle}
                      </motion.p>
                    )}

                    {slide.buttonLabel && (
                      <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 40 }}
                        transition={{ duration: 0.8, delay: isActive ? 0.5 : 0, ease: [0.76, 0, 0.24, 1] }}
                        className='inline-block pointer-events-auto mt-4'
                      >
                        <MagneticButton>
                          <button className="px-8 py-4 bg-[#FFD600] text-[#2D2D2D] rounded-full font-benzin font-bold text-sm uppercase shadow-lg hover:scale-105 transition-transform">
                            {slide.buttonLabel}
                          </button>
                        </MagneticButton>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}
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

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .reveal-layer {
            clip-path: circle(20% at var(--mask-x, 50%) var(--mask-y, 50%));
            will-change: clip-path;
          }
        `,
        }}
      />
    </div>
  );
};