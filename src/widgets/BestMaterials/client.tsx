'use client';

import { ArticleCard } from '@/components/ui/ArticleCard';
import { Description } from '@/components/ui/Description';
import { Title } from '@/components/ui/Title';
import { NewsItem } from '@/types/api';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useTranslations } from 'next-intl';

interface BestMaterialsClientProps {
  articles: NewsItem[];
}

export const BestMaterialsClient = ({ articles }: BestMaterialsClientProps) => {
  const t = useTranslations('best_materials');

  const articlesToDisplay = articles?.slice(0, 6) || [];

  if (!articlesToDisplay || articlesToDisplay?.length === 0) return null;

  return (
    <section className='my-12 relative overflow-hidden hidden'>
      <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8'>
        <div className='max-w-2xl'>
          {/* 🔥 Используем переводы */}
          <Title>{t('title')}</Title>
          <Description>{t('desc')}</Description>
        </div>

        <Link
          href='/news'
          className='hidden lg:inline-flex items-center justify-center px-6 py-3 bg-white border border-gray-200 rounded-full text-xs font-bold font-benzin uppercase text-[#2D2D2D] hover:bg-gray-50 transition-colors shadow-sm shrink-0 ml-4'
        >
          {t('all_news')}
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
        {articlesToDisplay.map((article) => (
          <SwiperSlide key={article.id} className='h-auto'>
            <ArticleCard
              id={article.id}
              title={article.title}
              description={article.shortText}
              imageSrc={article.image}
              theme={article.theme}
              buttonText={t('read_button')} // 🔥 Переводим кнопку карточки
              buttonAlign='left'
              href={'/news/' + article.slug}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className='mt-8 lg:hidden'>
        <Link
          href='/news'
          className='flex w-full items-center justify-center py-4 bg-white rounded-full text-xs font-bold font-benzin uppercase text-[#2D2D2D] shadow-md active:scale-95 transition-transform'
        >
          {t('all_news')}
        </Link>
      </div>
    </section>
  );
};
