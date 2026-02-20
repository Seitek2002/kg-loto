'use client';

import Image from 'next/image';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';
import dynamic from 'next/dynamic';
import { BACKGROUND_VARIANTS } from '@/config/lottery-styles';

const LottiePlayer = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
  { ssr: false },
);

interface BaseCardProps {
  children: ReactNode;
  backgroundId?: string;
  imageSrc?: string;
  lottieSrc?: string;
  className?: string;
  aspectRatio?: string;
  theme?: 'dark' | 'white';
}

export const BaseCard = ({
  children,
  backgroundId,
  imageSrc,
  lottieSrc,
  className,
  aspectRatio = '4/3',
  theme = 'dark',
}: BaseCardProps) => {
  const textColor = theme === 'dark' ? 'text-[#2D2D2D]' : 'text-white';

  const bgPath = imageSrc
    ? imageSrc
    : backgroundId
      ? BACKGROUND_VARIANTS[backgroundId] || BACKGROUND_VARIANTS['default']
      : null;

  // 🔥 1. Рефы и стейты для отслеживания видимости
  const cardRef = useRef<HTMLDivElement>(null);
  const lottieRef = useRef<any>(null); // Реф для самого плеера

  const [isVisible, setIsVisible] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasMounted(true); // Запоминаем, что доскроллили до карточки
        } else {
          setIsVisible(false); // Ставим на паузу, если ушла за пределы экрана
        }
      },
      // rootMargin '300px' означает: начинаем грузить анимацию за 300px до появления карточки на экране
      { threshold: 0.8 },
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // 🔥 2. Управляем воспроизведением вручную (play/pause)
  useEffect(() => {
    if (lottieRef.current) {
      if (isVisible) {
        lottieRef.current.play();
      } else {
        lottieRef.current.pause();
      }
    }
  }, [isVisible]);

  return (
    <div
      ref={cardRef}
      className={clsx(
        'relative w-full rounded-4xl flex flex-col shadow-xl overflow-hidden',
        !bgPath && !lottieSrc && 'bg-gray-200',
        textColor,
        className,
      )}
      style={{ aspectRatio }}
    >
      {/* 🔥 3. Рендерим Lottie только если доскроллили (hasMounted) */}
      {lottieSrc && hasMounted ? (
        <div className='absolute inset-0 z-0 overflow-hidden'>
          <LottiePlayer
            lottieRef={(instance) => lottieRef.current = instance}
            src={lottieSrc}
            loop
            autoplay={true} // Автозапуск при появлении
            renderer='svg'
            style={{ width: '100%', height: '100%' }}
            rendererSettings={{
              preserveAspectRatio: 'xMidYMid slice',
            }}
          />
        </div>
      ) : (
        /* СТАТИЧНАЯ КАРТИНКА */
        bgPath && (
          <Image
            src={bgPath}
            alt='card background'
            fill
            className='z-0 object-cover'
            priority
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        )
      )}

      {/* Затемнение для светлой темы */}
      {(bgPath || lottieSrc) && theme === 'white' && (
        <div className='absolute inset-0 bg-black/10 z-0' />
      )}

      <div className='relative z-10 flex flex-col flex-1 h-full p-6'>
        {children}
      </div>
    </div>
  );
};
