'use client';

import Link from 'next/link';

export const EmptyTickets = () => {
  return (
    <div className='flex flex-col items-center justify-center py-16 sm:py-24 animate-in fade-in duration-500'>
      {/* Иконка билета с тенью */}
      <div className='relative mb-8 flex flex-col items-center'>
        <svg
          width='80'
          height='80'
          viewBox='0 0 24 24'
          fill='#FF7600'
          xmlns='http://www.w3.org/2000/svg'
          className='transform -rotate-12 mb-3'
        >
          <path d='M2 9V15C2 15.6 2.4 16 3 16C4.1 16 5 16.9 5 18C5 19.1 4.1 20 3 20C2.4 20 2 20.4 2 21V22C2 22.6 2.4 23 3 23H21C21.6 23 22 22.6 22 22V21C22 20.4 21.6 20 21 20C19.9 20 19 19.1 19 18C19 16.9 19.9 16 21 16C21.6 16 22 15.6 22 15V9C22 8.4 21.6 8 21 8C19.9 8 19 7.1 19 6C19 4.9 19.9 4 21 4C21.6 4 22 3.6 22 3V2C22 1.4 21.6 1 21 1H3C2.4 1 2 1.4 2 2V3C2 3.6 2.4 4 3 4C4.1 4 5 4.9 5 6C5 7.1 4.1 8 3 8C2.4 8 2 8.4 2 9ZM18 5V19H16V5H18ZM14 5V19H12V5H14ZM10 5V19H8V5H10ZM6 5V19H4V5H6Z' fill='white'/>
          <path d='M21 1H3C1.3 1 0 2.3 0 4V8.1C1.2 8.6 2 9.7 2 11C2 12.3 1.2 13.4 0 13.9V18C0 19.7 1.3 21 3 21H21C22.7 21 24 19.7 24 18V13.9C22.8 13.4 22 12.3 22 11C22 9.7 22.8 8.6 24 8.1V4C24 2.3 22.7 1 21 1ZM6 19H4V5H6V19ZM10 19H8V5H10V19ZM14 19H12V5H14V19ZM18 19H16V5H18V19Z' />
        </svg>
        {/* Эмитация тени от макета */}
        <div className='absolute -bottom-1 w-16 h-1.5 bg-gray-200 rounded-[100%] blur-[3px]'></div>
      </div>

      {/* Текст */}
      <h3 className='text-[18px] sm:text-[20px] font-bold text-[#2D2D2D] mb-6 font-rubik'>
        Билетов пока нет
      </h3>

      {/* Кнопка ИГРАТЬ */}
      <Link
        href='/lotteries' // Ссылка на страницу покупки билетов
        className='bg-[#4B4B4B] text-white text-[13px] sm:text-[14px] font-bold uppercase rounded-full px-10 py-3 sm:py-3.5 hover:bg-[#2D2D2D] active:scale-95 transition-all'
      >
        Играть
      </Link>
    </div>
  );
};