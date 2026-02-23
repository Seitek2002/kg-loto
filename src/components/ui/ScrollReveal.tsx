'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  direction?: 'up' | 'left' | 'right'; // Откуда выплывает блок
  delay?: number; // Задержка, если нужно показать блоки по очереди
  width?: 'fit-content' | '100%';
}

export const ScrollReveal = ({
  children,
  direction = 'up',
  delay = 0,
  width = '100%',
}: ScrollRevealProps) => {
  // Определяем стартовую позицию в зависимости от направления
  const hiddenVariants = {
    up: { opacity: 0, y: 50 },
    left: { opacity: 0, x: -50 },
    right: { opacity: 0, x: 50 },
  };

  return (
    <div style={{ width, position: 'relative', overflow: 'hidden' }}>
      <motion.div
        initial={hiddenVariants[direction]}
        whileInView={{ opacity: 1, y: 0, x: 0 }}
        viewport={{ once: true, margin: '-50px' }} // Анимация начнется чуть раньше, чем блок появится полностью
        transition={{
          duration: 0.8,
          delay: delay,
          ease: [0.25, 1, 0.5, 1], // Наша любимая премиальная кривая
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};
