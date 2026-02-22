'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

                {/* <div className='relative z-10 pl-8 md:pl-16 max-w-2xl pointer-events-none'>
                  <h1 className='text-3xl md:text-5xl lg:text-6xl font-black font-benzin text-white uppercase leading-[1.1] whitespace-pre-line drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]'>
                    {slide.title}
                  </h1>
                </div> */}
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

      {/* CSS */}
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

export default NewHero;
