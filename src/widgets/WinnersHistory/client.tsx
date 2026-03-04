'use client';

import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Title } from '@/components/ui/Title';
import { Description } from '@/components/ui/Description';
import { WinnerCard } from '@/components/ui/WinnerCard';
import 'swiper/css';
import { Winner } from '@/types/api';
// 🔥 Импортируем хук переводов
import { useTranslations } from 'next-intl';

interface WinnersHistoryClientProps {
  winners: Winner[];
  title?: string;
  description?: string;
}

export const WinnersHistoryClient = ({
  winners,
  title,
  description,
}: WinnersHistoryClientProps) => {
  // 🔥 Подключаем словарь
  const t = useTranslations('winners_history');

  const displayWinners = winners?.slice(0, 6) || [];

  if (!displayWinners || displayWinners.length === 0) return null;

  return (
    <section className='my-12 relative overflow-hidden'>
      <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8'>
        <div className='max-w-2xl'>
          {/* 🔥 Используем переводы */}
          <Title>{title || t('title')}</Title>
          <Description>{description || t('desc')}</Description>
        </div>

        <Link
          href='/winners'
          className='hidden lg:inline-flex items-center justify-center px-6 py-3 bg-white border border-gray-200 rounded-full text-xs font-bold font-benzin uppercase text-[#2D2D2D] hover:bg-gray-50 transition-colors shadow-sm'
        >
          {t('all_winners')}
        </Link>
      </div>

      <Swiper
        spaceBetween={16}
        slidesPerView={1.1}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3.2 },
        }}
        className='overflow-visible!'
      >
        {displayWinners.map((winner) => (
          <SwiperSlide key={winner.id}>
            <WinnerCard winner={winner} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className='mt-8 lg:hidden'>
        <Link
          href='/winners'
          className='flex w-full items-center justify-center py-4 bg-white rounded-full text-xs font-bold font-benzin uppercase text-[#2D2D2D] shadow-md active:scale-95 transition-transform'
        >
          {t('all_winners')}
        </Link>
      </div>
    </section>
  );
};
