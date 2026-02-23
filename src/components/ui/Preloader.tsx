'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Жестко фиксируем время интро-анимации (например, 2 секунды)
    // За это время Next.js спокойно подгрузит все Lottie и картинки на фоне
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Блокируем скролл, пока висит лоадер
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          // Анимация ИСЧЕЗНОВЕНИЯ лоадера (уезжает вверх)
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }} // Дорогой ease (cubic-bezier)
          className='fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#2D2D2D] text-white'
        >
          <div className='relative flex flex-col items-center overflow-hidden'>
            {/* Анимация ПОЯВЛЕНИЯ логотипа (выплывает снизу) */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className='relative w-48 h-20 mb-4'
            >
              <Image
                src='/logo.png' // Твой основной логотип
                alt='KG Loto'
                fill
                className='object-contain'
                priority
              />
            </motion.div>

            {/* Декоративная полоса загрузки (Progress bar) */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.5 }}
              className='h-[2px] bg-[#FFD600] rounded-full w-48'
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
