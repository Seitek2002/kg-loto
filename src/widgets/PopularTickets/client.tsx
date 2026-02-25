'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion'; // 🔥 ДОБАВИЛИ ИМПОРТ Variants
import { LotteryCard } from '@/components/features/lottery/LotteryCard';
import { Description } from '@/components/ui/Description';
import { Title } from '@/components/ui/Title';
import { LotteryItem } from '@/types/api';

const formatTime = (time: string) => {
  if (!time) return '00:00';
  return time.split(':').slice(0, 2).join(':');
};

// 🔥 Явно указываем тип Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

// 🔥 Явно указываем тип Variants
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 1, 0.5, 1], // Теперь TS знает, что это легальная кривая Безье
    },
  },
};

export const PopularTicketsClient = ({
  lotteries,
}: {
  lotteries: LotteryItem[];
}) => {
  // Твои моковые данные объединяем с данными сервера
  const allLotteries = [
    ...lotteries,
    {
      id: '0',
      title: 'Лотерея ДАСТАН',
      subtitle: 'Приходите позже',
      backgroundImage: '/animations/3.json',
      buttonPrice: 300,
      drawTime: '00:00',
      prizeText: '1 000 000 ₽',
      theme: 'white',
    },
    {
      id: '10',
      title: 'ЛЕГЕнДАРНАЯ ЛОТЕРЕЯ',
      subtitle: 'Приходите позже',
      backgroundImage: '/animations/4.json',
      buttonPrice: 300,
      drawTime: '00:00',
      prizeText: '1 000 000 ₽',
      theme: 'white',
    },
  ];

  return (
    <div className='my-12' id='instant'>
      {/* Анимируем заголовок тоже (появляется при скролле) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Title>Популярные лотереи</Title>
        <Description>
          Популярные лотереи привлекают внимание благодаря крупным джекпотам,
          частым тиражам и удобным условиям участия.
        </Description>
      </motion.div>

      {/* 🔥 Главный анимированный контейнер */}
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
              className='block w-full md:w-[48%]'
            >
              <Link
                href={`/lottery/${loto.id}`}
                className='block w-full h-full transition-transform active:scale-[0.98]'
              >
                <LotteryCard
                  title={loto.title}
                  description={loto.subtitle || ''}
                  prize={loto.prizeText}
                  price={loto.buttonPrice}
                  time={formatTime(loto.drawTime)}
                  theme={loto.theme as 'dark' | 'white'}
                  lottieSrc={isAnimation ? bgUrl : undefined}
                  backgroundImage={!isAnimation ? bgUrl : undefined}
                />
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};
