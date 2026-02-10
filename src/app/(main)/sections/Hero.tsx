'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useRouter } from 'next/navigation';

export interface HeroSlideData {
  id: number | string;
  bg: string;
  title1: string;
  title2?: string;
  prize?: string;
  price?: string | number;
  // 🔥 Новое поле: готовый текст для кнопки с сервера
  buttonLabel?: string;
}

interface HeroProps {
  slides: HeroSlideData[];
  buttonText?: string; // Дефолтный текст (если нет в слайде)
  hideButton?: boolean;
  onButtonClick?: (slideId: number | string) => void;
}

export const Hero = ({
  slides,
  buttonText = 'Играть',
  hideButton = false,
  onButtonClick,
}: HeroProps) => {
  const router = useRouter();
  if (!slides || slides.length === 0) return null;

  const isSingleSlide = slides.length === 1;

  const handleDefaultClick = (id: number | string) => {
    if (onButtonClick) {
      onButtonClick(id); // Если передали функцию снаружи - используем её (например, в деталях лотереи)
    } else {
      router.push(`/lottery/${id}`); // Иначе стандартный переход
    }
  };

  return (
    <section className='relative w-full overflow-hidden mx-auto'>
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={isSingleSlide ? false : { clickable: true }}
        centeredSlides
        loop={!isSingleSlide}
        autoplay={
          isSingleSlide ? false : { delay: 5000, disableOnInteraction: false }
        }
        className='h-[80vh] lg:h-screen w-full hero-swiper'
        allowTouchMove={!isSingleSlide}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id} className='relative w-full h-full pt-20'>
            <div className='absolute inset-0 z-0'>
              <Image
                src={slide.bg}
                alt={slide.title1}
                fill
                className='object-cover'
                priority={index === 0}
              />
              <div className='absolute inset-0 bg-black/20' />
            </div>

            <div className='relative z-10 flex flex-col items-center lg:justify-center h-full pt-12 text-center px-4'>
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
                {slide.title2 && (
                  <h2 className='text-[#FFD600] drop-shadow-md'>
                    {slide.title2}
                  </h2>
                )}
              </div>

              {slide.prize && (
                <>
                  <p className='text-xs lg:text-3xl text-white/90 font-medium mb-1 uppercase tracking-widest mt-4'>
                    Суперприз от
                  </p>
                  <h1 className='text-xl lg:text-6xl leading-none font-black text-white uppercase drop-shadow-xl font-benzin mb-10'>
                    {slide.prize}
                  </h1>
                </>
              )}

              {!hideButton && (
                <button
                  onClick={() => handleDefaultClick(slide.id)}
                  className='bg-white text-black font-extrabold text-sm lg:text-xl py-4 px-10 rounded-full shadow-xl hover:bg-gray-100 active:scale-95 transition-all uppercase tracking-wide mt-8'
                >
                  {/* 🔥 ЛОГИКА КНОПКИ: 
                      1. Если есть готовый label с сервера -> используем его.
                      2. Иначе собираем из пропсов (Текст + Цена).
                  */}
                  {slide.buttonLabel
                    ? slide.buttonLabel
                    : `${buttonText} ${slide.price ? `• ${slide.price}` : ''}`}
                </button>
              )}
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
