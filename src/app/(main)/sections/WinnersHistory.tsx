'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

interface Winner {
  id: number;
  name: string;
  city: string;
  prize: string;
  image: string; // Путь к картинке
}

const winners: Winner[] = [
  {
    id: 1,
    name: 'Александр',
    city: 'Бишкек',
    prize: '1 000 000 KGS',
    image:
      'https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=798&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Замени на свои картинки
  },
  {
    id: 2,
    name: 'Марсель',
    city: 'Бишкек',
    prize: '150 000 KGS',
    image:
      'https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=798&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 3,
    name: 'Елена',
    city: 'Ош',
    prize: '500 000 KGS',
    image:
      'https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=798&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

export const WinnersHistory = () => {
  return (
    <section className='mb-12 overflow-hidden'>
      {/* Заголовок */}
      <h2 className='text-base font-bold text-[#2d2d2d] font-benzin uppercase'>
        ИСТОРИЯ ПОБЕДИТЕЛЕЙ
      </h2>

      {/* Описание */}
      <p className='text-xs text-[#6E6E6E] my-3'>
        Популярные лотереи привлекают внимание благодаря крупным джекпотам,
        частым тиражам и удобным условиям участия.
      </p>

      {/* Слайдер */}
      <Swiper
        spaceBetween={8}
        slidesPerView={2.1} // Показываем полторы карточки, чтобы было понятно, что можно свайпать
        breakpoints={{
          // На экранах побольше показываем 2.2 карточки
          640: {
            slidesPerView: 2.2,
          },
        }}
        className='overflow-visible!' // Важно: разрешаем слайдам вылезать за границы контейнера при свайпе
      >
        {winners.map((winner) => (
          <SwiperSlide key={winner.id}>
            <div className='relative w-full h-[213px] rounded-4xl overflow-hidden bg-gray-100'>
              {/* Фото победителя */}
              <Image
                src={winner.image}
                alt={winner.name}
                fill
                className='object-cover'
              />

              {/* Стеклянная плашка внизу */}
              <div className='absolute bottom-4 left-4 right-4 bg-white/30 backdrop-blur-md border border-white/20 rounded-[24px] p-4 flex flex-col items-center text-center shadow-sm'>
                <h3 className='text-xs font-black text-[#2D2D2D] font-benzin uppercase mb-0.5'>
                  {winner.name}
                </h3>
                <p className='text-xs text-[#4B4B4B] font-rubik mb-2 font-medium'>
                  {winner.city}
                </p>
                <span className='text-xs font-semibold text-black font-benzin tracking-tight'>
                  {winner.prize}
                </span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
