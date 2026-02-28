'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  // 🔥 Вот это решает проблему "уползающего" вниз экрана
  useEffect(() => {
    // Отключаем автоматическое восстановление скролла браузером
    if (
      typeof window !== 'undefined' &&
      'scrollRestoration' in window.history
    ) {
      window.history.scrollRestoration = 'manual';
    }
    // Принудительно кидаем юзера в самое начало страницы при переходах/рефрешах
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.95,
        filter: 'blur(10px)',
      }}
      animate={{
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
      }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className='transform-gpu'
    >
      {children}
    </motion.div>
  );
}
