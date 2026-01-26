'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { ArticleCard, ArticleCardProps } from '@/components/ui/ArticleCard';
import { Title } from '@/components/ui/Title';
import { Description } from '@/components/ui/Description';

// Данные, настроенные под макет
const articles: ArticleCardProps[] = [
  {
    id: 1,
    title: '80+ ЧЕЛОВЕК С БОЛЬШИМ ОПЫТОМ В FOODTECH И HORECA',
    buttonText: 'ПОДРОБНЕЕ',
    // Картинка: Растение на светлом фоне (Unsplash)
    imageSrc:
      'https://images.unsplash.com/photo-1491147334573-44cbb4602074?q=80&w=800&auto=format&fit=crop',
    theme: 'dark', // Темный текст
    buttonAlign: 'center', // Кнопка по центру
  },
  {
    id: 2,
    title: 'ПОКАЗЫВАЕМ ГДЕ ПРИОБРЕСТИ БИЛЕТ',
    description:
      'Создавал проекты для лидеров фудтех-рынка: Yami Yami, Даниловский рынок, Marketplace и др.',
    buttonText: 'ЧИТАТЬ ПОЛНОСТЬЮ',
    // Нет картинки = Белый фон
    theme: 'dark',
    buttonAlign: 'left', // Кнопка слева
    descriptionPosition: 'bottom', // Описание внизу перед кнопкой
  },
  {
    id: 3,
    title: 'НОВОГОДНИЕ ПОДАРКИ',
    description:
      'Популярные лотереи привлекают внимание благодаря крупным джекпотам и частым тиражам.',
    buttonText: 'ЧИТАТЬ ПОЛНОСТЬЮ',
    // Картинка: Синие подарки (Unsplash)
    imageSrc:
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop',
    theme: 'light', // Белый текст
    buttonAlign: 'center', // Кнопка по центру
    descriptionPosition: 'top', // Описание сверху под заголовком
  },
  {
    id: 4,
    title: 'СЕКРЕТЫ УСПЕХА',
    description:
      'Тысячи игроков ежедневно выбирают именно эти розыгрыши, чтобы испытать удачу.',
    buttonText: 'ЧИТАТЬ ПОЛНОСТЬЮ',
    // Картинка: Светлый абстрактный фон
    imageSrc:
      'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=800&auto=format&fit=crop',
    theme: 'dark',
    buttonAlign: 'left',
    descriptionPosition: 'bottom',
  },
];

export const BestMaterials = () => {
  return (
    <section className='mb-16 overflow-hidden'>
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
        slidesPerView={1.1} // На мобилке видно 1 карточку + кусочек
        breakpoints={{
          640: { slidesPerView: 2.2 }, // Планшет
          1024: { slidesPerView: 3.2 }, // Десктоп (как на скрине block.png)
        }}
        className='overflow-visible!'
      >
        {articles.map((article) => (
          <SwiperSlide key={article.id} className='h-auto'>
            <ArticleCard {...article} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
