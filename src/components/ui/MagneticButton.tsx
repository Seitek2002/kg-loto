'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
}

export const MagneticButton = ({
  children,
  className,
}: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);

  // Храним координаты отклонения курсора от центра кнопки
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Добавляем "пружинистость", чтобы кнопка плавно возвращалась на место
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();

    // Находим центр кнопки
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // Вычисляем расстояние от центра (насколько сильно тянуть кнопку)
    // Делим на 3, чтобы кнопка не улетала слишком далеко от курсора
    x.set((clientX - centerX) / 3);
    y.set((clientY - centerY) / 3);
  };

  const handleMouseLeave = () => {
    // Возвращаем кнопку в центр, когда курсор уходит
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      // Применяем пружинистые координаты к `transform: translate`
      style={{ x: springX, y: springY }}
      className={className}
    >
      {/* Мы оборачиваем контент еще в один блок, чтобы можно было добавить параллакс для текста, если захочешь */}
      <motion.div
        style={{
          // Текст внутри тянется чуть слабее, чем сама кнопка, создавая 3D-эффект
          x: useTransform(springX, (v) => v * 0.5),
          y: useTransform(springY, (v) => v * 0.5),
        }}
        className='w-full h-full'
      >
        {children}
      </motion.div>
    </motion.div>
  );
};
