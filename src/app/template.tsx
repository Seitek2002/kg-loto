'use client';

import { motion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      // Начальное состояние: страница чуть уменьшена, прозрачна и сильно размыта
      initial={{
        opacity: 0,
        scale: 0.95,
        filter: 'blur(10px)',
      }}
      // Конечное состояние: нормальный размер, 100% видимость, фокус наведен (нет блюра)
      animate={{
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
      }}
      // Настройка плавности
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1], // Знаменитая кривая Apple
      }}
      // transform-gpu помогает браузеру рендерить блюр аппаратно, без лагов
      className='transform-gpu'
    >
      {children}
    </motion.div>
  );
}
