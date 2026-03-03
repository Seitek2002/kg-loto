import Image from 'next/image';
import { clsx } from 'clsx';
import { Player } from '@lottiefiles/react-lottie-player'; // Импорт плеера
import { AnimatedPrizeText } from '@/components/ui/AnimatedPrizeText';
import { SliderItem } from '@/types/api';

interface HeroCardProps {
  slide: SliderItem;
  isActive: boolean;
  fallbackGradient: string;
}

export const HeroCard = ({
  slide,
  isActive,
  fallbackGradient,
}: HeroCardProps) => {
  // Функция для рендера заднего фона карточки (Lottie, Картинка или Градиент)
  const renderCardBackground = () => {
    if (slide.image) {
      // 1. Если это Lottie-анимация
      if (slide.image.type === 'lottie') {
        return (
          <div className='absolute inset-0 w-full h-full z-0 overflow-hidden scale-105'>
            <Player
              autoplay
              loop
              src={slide.image.url}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        );
      }
      // 2. Если это обычная картинка
      if (slide.image.type === 'image') {
        return (
          <Image
            src={slide.image.url}
            alt={`Фон ${slide.id}`}
            fill
            sizes='(max-width: 768px) 85vw, 60vw'
            className='object-cover z-0'
            priority={isActive}
          />
        );
      }
    }

    // 3. Заглушка-градиент, если медиа вообще нет
    return (
      <div
        className='absolute inset-0 w-full h-full z-0'
        style={{ background: fallbackGradient }}
      />
    );
  };

  return (
    <div
      className={clsx(
        'relative w-full rounded-[24px] md:rounded-[40px] overflow-hidden shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col items-center justify-center p-4 md:p-8 text-center text-white',
        isActive
          ? 'scale-100 opacity-100 z-20'
          : 'scale-[0.9] md:scale-[0.85] opacity-60 blur-[2px] z-10',
      )}
    >
      {/* 🔥 Задний фон карточки */}
      {renderCardBackground()}

      {/* Контент карточки поверх фона */}
      <div className='relative z-10 flex flex-col items-center w-full bg-black/20 p-6 rounded-3xl backdrop-blur-[2px]'>
        <span className='text-[9px] md:text-sm font-medium uppercase font-benzin tracking-widest mb-1.5 md:mb-4 drop-shadow-md'>
          Главный приз
        </span>

        <h2 className='text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black leading-none mb-3 md:mb-6 drop-shadow-xl tabular-nums uppercase'>
          <AnimatedPrizeText text={slide.prizeText} isActive={isActive} />
        </h2>

        {slide.subtitle && (
          <div className='flex flex-col mb-5 md:mb-8'>
            <span className='text-xs md:text-lg font-bold tracking-wide uppercase drop-shadow-md'>
              {slide.subtitle}
            </span>
          </div>
        )}

        {slide.buttonLabel && (
          <button className='bg-[#FFD600] text-[#2D2D2D] px-6 py-3 md:px-8 md:py-4 rounded-full font-black text-[10px] md:text-sm shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center gap-2 uppercase'>
            {slide.buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
};
