'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { Title } from '@/components/ui/Title';
import { Description } from '@/components/ui/Description';
import { useContentStore } from '@/store/content'; // <--- Импорт стора

export const BestMaterials = () => {
  // Берем данные из стора
  const articles = useContentStore((state) => state.materials);

  return (
    <section className='my-12 overflow-hidden'>
      {/* Заголовки */}
      <div className='mb-8'>
        <Title>ЛУЧШИЕ МАТЕРИАЛЫ</Title>
        <Description>
          Следите за последними событиями, улучшениями и нововведениями — мы
          регулярно рассказываем о том, что важно знать.
        </Description>
      </div>

      {/* Слайдер */}
      <Swiper
        spaceBetween={16}
        slidesPerView={1.1}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3.2 },
        }}
        className='overflow-visible!'
      >
        {articles.map((article) => (
          <SwiperSlide key={article.id} className='h-auto'>
            {/* Передаем все пропсы статьи */}
            <ArticleCard {...article} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
