'use client';

import { Title } from '@/components/ui/Title';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export const OurApp = () => {
  // 1. Создаем ссылку на контейнер секции, чтобы отслеживать скролл относительно него
  const sectionRef = useRef<HTMLElement>(null);

  // 2. Получаем прогресс скролла конкретно для этой секции
  // offset: ['start end', 'end start'] означает:
  // Начало анимации: когда верх секции появляется внизу экрана (start end)
  // Конец анимации: когда низ секции уходит за верх экрана (end start)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // 3. Преобразуем прогресс скролла (от 0 до 1) в значения смещения по Y
  // Телефон будет двигаться от +50px вниз до -50px вверх во время прокрутки
  const yParallax = useTransform(scrollYProgress, [0, 1], [80, -80]);

  // Добавим легкий параллакс и для текста, чтобы он двигался в противоположную сторону
  const yTextParallax = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <section
      ref={sectionRef}
      className='hidden md:flex relative w-full bg-white rounded-[40px] overflow-hidden min-h-125 items-center my-12' // Добавил my-12 для отступов
    >
      <motion.div
        style={{ y: yTextParallax }} // Применяем легкий параллакс к текстовому блоку
        className='relative z-10 w-[55%] pl-16 py-16 flex flex-col h-full justify-center'
      >
        <Title>скачайте наше приложение</Title>

        <div className='max-w-md mb-12 text-xs lg:text-xl text-[#6E6E6E] my-3'>
          Скачайте приложение и получите удобный доступ ко всем возможностям
          сервиса прямо со своего смартфона — в любое время и в любом месте.
        </div>

        <div className='flex flex-col gap-3 mb-12'>
          <div className='relative w-32 h-32'>
            <Image
              src='/qr.svg'
              alt='QR Code'
              width={160}
              height={160}
              className='w-full h-full object-contain'
            />
          </div>
          <span className='text-xs font-bold font-rubik text-[#2D2D2D] max-w-25 leading-tight'>
            Скачайте наше приложение
          </span>
        </div>

        <div className='flex items-center gap-4'>
          <StoreButton type='appstore' />
          <StoreButton type='googleplay' />
        </div>
      </motion.div>

      <div className='absolute top-0 right-0 bottom-0 w-[50%] h-full pointer-events-none flex items-center justify-center'>
        {/* 🔥 Обернули картинку в motion.div и применили значение yParallax */}
        <motion.div
          style={{ y: yParallax }}
          // Увеличиваем высоту картинки (h-[120%]), чтобы при смещении вверх/вниз не было видно обрезанных краев
          className='relative w-full h-[120%]'
        >
          <Image
            src='/our-app.png'
            alt='Mobile App'
            fill
            className='object-cover object-left'
            sizes='50vw'
            priority
          />
        </motion.div>
      </div>
    </section>
  );
};

const StoreButton = ({ type }: { type: 'appstore' | 'googleplay' }) => {
  const isApple = type === 'appstore';

  return (
    <Link
      href='#'
      className='flex items-center gap-3 bg-[#1E1E1E] text-white px-6 py-3 rounded-full hover:bg-black active:scale-95 transition-all min-w-[180px] shadow-md' // Добавил active:scale-95 и shadow-md
    >
      {isApple ? (
        <svg className='w-6 h-6 fill-current' viewBox='0 0 24 24'>
          <path d='M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.5 1.3 0 2.52.87 3.3.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.39 2.82M13 3.5c.73-.83 1.21-1.96 1.07-3.09-1.05.06-2.31.74-3.03 1.59-.65.74-1.23 1.92-1.07 3.07 1.17.09 2.35-.73 3.03-1.57' />
        </svg>
      ) : (
        <svg className='w-6 h-6 fill-current' viewBox='0 0 24 24'>
          <path d='M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z' />
        </svg>
      )}

      <div className='flex flex-col'>
        <span className='text-[9px] uppercase font-rubik text-gray-400 leading-none'>
          Скачайте с
        </span>
        <span className='text-[13px] font-bold font-benzin uppercase leading-tight mt-1'>
          {isApple ? 'App Store' : 'Google Play'}
        </span>
      </div>
    </Link>
  );
};
