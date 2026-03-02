'use client';

import Link from 'next/link';
import { useRef } from 'react';
import {
  motion,
  Variants,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from 'framer-motion';
import { LotteryCard } from '@/components/features/lottery/LotteryCard';
import { Description } from '@/components/ui/Description';
import { Title } from '@/components/ui/Title';
import { LotteryItem } from '@/types/api';

const formatTime = (time: string) => {
  if (!time) return '00:00';
  return time.split(':').slice(0, 2).join(':');
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};

const TiltCard = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);

  // Координаты мыши относительно центра для 3D вращения
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Координаты мыши в пикселях для блика
  const lightX = useMotionValue(0);
  const lightY = useMotionValue(0);

  // Физика пружины для плавности
  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);
  const smoothLightX = useSpring(lightX, springConfig);
  const smoothLightY = useSpring(lightY, springConfig);

  // 🔥 Вычисляем градус наклона (Увеличили с 10 до 20 градусов для явного эффекта)
  const rotateX = useTransform(smoothY, [-0.5, 0.5], ['20deg', '-20deg']);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], ['-20deg', '20deg']);

  // Генерируем CSS градиент для блика (Сделали его чуть ярче: 0.35)
  const background = useMotionTemplate`radial-gradient(circle at ${smoothLightX}px ${smoothLightY}px, rgba(255, 255, 255, 0.35), transparent 60%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Нормализуем значения от -0.5 до 0.5 для вращения
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);

    // Устанавливаем точные пиксели для блика
    lightX.set(mouseX);
    lightY.set(mouseY);
  };

  const handleMouseLeave = () => {
    // Возвращаем в исходное положение при уходе мыши
    x.set(0);
    y.set(0);
  };

  return (
    // 🔥 Уменьшили perspective с 1200 до 1000, чтобы глубина казалась сильнее
    <div style={{ perspective: 1000 }} className='w-full h-full'>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        // 🔥 Увеличили scale до 1.05 и добавили z-50 при ховере
        className='relative w-full h-full group transition-transform duration-100 hover:scale-[1.05] hover:z-50'
      >
        {/* СЛОЙ С БЛИКОМ */}
        <motion.div
          className='pointer-events-none absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl'
          style={{ background }}
        />

        {/* Сама карточка (Тень тоже сделали чуть плотнее) */}
        <div className='w-full h-full shadow-lg group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.2)] transition-shadow duration-500 rounded-3xl'>
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export const PopularTicketsClient = ({
  lotteries,
  title,
  description,
}: {
  lotteries: LotteryItem[];
  title?: string;
  description?: string;
}) => {
  const allLotteries = [
    ...lotteries,
    // {
    //   id: '0',
    //   title: 'Лотерея ДАСТАН',
    //   subtitle: 'Приходите позже',
    //   backgroundImage: '/animations/3.json',
    //   buttonPrice: 300,
    //   drawTime: '00:00',
    //   prizeText: '1 000 000 ₽',
    //   theme: 'white',
    // },
    // {
    //   id: '10',
    //   title: 'ЛЕГЕнДАРНАЯ ЛОТЕРЕЯ',
    //   subtitle: 'Приходите позже',
    //   backgroundImage: '/animations/4.json',
    //   buttonPrice: 300,
    //   drawTime: '00:00',
    //   prizeText: '1 000 000 ₽',
    //   theme: 'white',
    // },
  ];

  return (
    <div className='my-12' id='instant'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Title>{title || 'Популярные лотереи'}</Title>
        <Description>
          {description ||
            'Популярные лотереи привлекают внимание благодаря крупным джекпотам, частым тиражам и удобным условиям участия.'}
        </Description>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial='hidden'
        whileInView='show'
        viewport={{ once: true, margin: '-100px' }}
        className='flex justify-stretch flex-wrap gap-4 mt-6'
      >
        {allLotteries.map((loto) => {
          const bgUrl = loto.backgroundImage || '';
          const isAnimation = bgUrl.toLowerCase().endsWith('.json');

          return (
            <motion.div
              key={loto.id}
              variants={itemVariants}
              className='block w-full md:w-[48%] relative'
            >
              {/* ОБЕРНУЛИ КАРТОЧКУ В TiltCard */}
              <TiltCard>
                <Link
                  href={`/lottery/${loto.id}`}
                  className='block w-full h-full transition-transform active:scale-[0.98]'
                >
                  <LotteryCard
                    title={loto.title}
                    description={loto.subtitle || ''}
                    prize={loto.prizeText}
                    price={loto.buttonPrice ?? 0}
                    time={formatTime(loto.drawTime)}
                    theme={loto.theme as 'dark' | 'white'}
                    lottieSrc={isAnimation ? bgUrl : undefined}
                    backgroundImage={!isAnimation ? bgUrl : undefined}
                  />
                </Link>
              </TiltCard>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};
