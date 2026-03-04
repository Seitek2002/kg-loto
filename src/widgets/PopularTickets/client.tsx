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
import { useTranslations } from 'next-intl';

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
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const lightX = useMotionValue(0);
  const lightY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);
  const smoothLightX = useSpring(lightX, springConfig);
  const smoothLightY = useSpring(lightY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], ['20deg', '-20deg']);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], ['-20deg', '20deg']);

  const background = useMotionTemplate`radial-gradient(circle at ${smoothLightX}px ${smoothLightY}px, rgba(255, 255, 255, 0.35), transparent 60%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
    lightX.set(mouseX);
    lightY.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
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
        className='relative w-full h-full group transition-transform duration-100 hover:scale-[1.05] hover:z-50'
      >
        <motion.div
          className='pointer-events-none absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl'
          style={{ background }}
        />
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
  const t = useTranslations('populartickets');

  return (
    <div className='my-12' id='instant'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* 🔥 Используем переводы как Fallback */}
        <Title>{title || t('title')}</Title>
        <Description>{description || t('desc')}</Description>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial='hidden'
        whileInView='show'
        viewport={{ once: true, margin: '-100px' }}
        className='flex justify-stretch flex-wrap gap-4 mt-6'
      >
        {lotteries.map((loto) => {
          const bgUrl = loto.backgroundImage || '';
          const isAnimation = bgUrl.toLowerCase().endsWith('.json');

          return (
            <motion.div
              key={loto.id}
              variants={itemVariants}
              className='block w-full md:w-[48%] relative'
            >
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
