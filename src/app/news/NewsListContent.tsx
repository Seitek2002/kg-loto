'use client';

import { useState } from 'react';
import { Title } from '@/components/ui/Title';
import { Description } from '@/components/ui/Description';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { Header } from '@/components/ui/Header';
import { PageHeader } from '@/components/ui/PageHeader';
import { NewsItem } from '@/types/api';

interface NewsListContentProps {
  initialNews: NewsItem[];
}

const ITEMS_PER_PAGE = 6;

export const NewsListContent = ({ initialNews }: NewsListContentProps) => {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  if (!initialNews) return null;

  const visibleNews = initialNews.slice(0, visibleCount);

  const hasMore = visibleCount < initialNews.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  return (
    <div className='min-h-screen bg-[#F9F9F9] pt-0 pb-20'>
      <Header theme='dark' />

      <div className='px-4'>
        <PageHeader title='Новости' />
      </div>

      <div className='max-w-350 mx-auto pt-4 lg:pt-20 px-4 lg:mt-20'>
        <div className='mb-10 max-w-3xl'>
          <Title>ВСЕ МАТЕРИАЛЫ</Title>
          <Description>
            Следите за последними событиями, улучшениями и нововведениями — мы
            регулярно рассказываем о том, что важно знать.
          </Description>
        </div>

        {/* СЕТКА КАРТОЧЕК */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr'>
          {visibleNews.map((article) => (
            <div key={article.id} className='h-full min-h-105'>
              <ArticleCard
                id={article.id}
                title={article.title}
                description={article.shortText}
                imageSrc={article.image}
                theme={article.theme}
                buttonText='ЧИТАТЬ'
                buttonAlign='left'
                href={`/news/${article.slug}`}
              />
            </div>
          ))}
        </div>

        {/* КНОПКА ЗАГРУЗИТЬ ЕЩЕ */}
        {hasMore && (
          <div className='mt-12 flex justify-center'>
            <button
              onClick={handleLoadMore}
              className='bg-white text-[#2D2D2D] font-bold font-benzin uppercase text-xs py-4 px-12 rounded-full shadow-md hover:bg-gray-50 active:scale-95 transition-all'
            >
              Загрузить еще
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
