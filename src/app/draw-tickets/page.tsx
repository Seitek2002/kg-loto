'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';

// Моковые данные для карточек (позже заменим на данные с API)
const MOCK_LOTTERIES = [
  {
    id: '1',
    title: 'Суперприз',
    prize: '6 000 000',
    price: 100,
    timeLeff: '2 дн. 12:34:17',
    image:
      'https://images.unsplash.com/photo-1621360841013-c76831f1dbce?q=80&w=600&auto=format&fit=crop', // Временно рандомная картинка
  },
  {
    id: '2',
    title: 'Суперприз',
    prize: '6 000 000',
    price: 100,
    timeLeff: '2 дн. 12:34:17',
    image:
      'https://images.unsplash.com/photo-1621360841013-c76831f1dbce?q=80&w=600&auto=format&fit=crop',
  },
];

export default function DrawTicketsPage() {
  return (
    <div className='min-h-screen bg-[#F5F5F5] font-rubik pb-32 md:pb-12 select-none'>
      <div className='max-w-[1045px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-10'>
        {/* Хлебные крошки */}
        <div className='flex items-center gap-2 text-[13px] md:text-base text-[#4B4B4B] font-medium mb-6 md:mb-8'>
          <Link href='/' className='hover:opacity-80 transition-opacity'>
            Главная
          </Link>
          <span className='text-gray-400'>/</span>
          <span className='font-bold text-[#2D2D2D]'>Тиражные лотереи</span>
        </div>

        {/* Сетка карточек лотерей */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
          {MOCK_LOTTERIES.map((lottery) => (
            <LotteryCard key={lottery.id} lottery={lottery} />
          ))}
        </div>
      </div>
    </div>
  );
}

// 🔥 Компонент Карточки
function LotteryCard({ lottery }: { lottery: any }) {
  return (
    <Link
      href={`/draw-tickets/${lottery.id}`} // Ссылка на наш динамический роут
      className='group relative w-full aspect-[16/9] sm:aspect-[4/2.5] rounded-[24px] overflow-hidden block active:scale-[0.98] transition-transform duration-200'
    >
      {/* Фоновая картинка */}
      <Image
        src={lottery.image}
        alt='Фон лотереи'
        fill
        className='object-cover transition-transform duration-500 group-hover:scale-105'
      />

      {/* Затемнение для читаемости текста */}
      <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10' />

      {/* Таймер (Слева сверху) */}
      <div className='absolute top-4 left-4 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full px-3 py-1.5 flex items-center gap-2 text-[12px] md:text-[14px] font-medium shadow-sm'>
        <Clock size={16} />
        {lottery.timeLeff}
      </div>

      {/* Контент (Слева снизу) */}
      <div className='absolute bottom-5 left-5 md:bottom-6 md:left-6 flex flex-col gap-1 md:gap-2'>
        <span className='text-white font-bold text-[14px] md:text-[18px]'>
          {lottery.title}
        </span>

        <div className='text-[#FFD600] font-black text-[28px] md:text-[40px] leading-none drop-shadow-md flex items-end gap-2'>
          {lottery.prize}
          <span className='text-white text-[20px] md:text-[28px] underline decoration-2 underline-offset-4'>
            с
          </span>
        </div>

        <button className='mt-2 bg-white text-[#2D2D2D] rounded-full px-5 py-2 md:py-2.5 text-[12px] md:text-[14px] font-black uppercase tracking-wide w-max shadow-md group-hover:bg-[#FFD600] transition-colors duration-300'>
          Играть • {lottery.price} СОМ
        </button>
      </div>
    </Link>
  );
}
