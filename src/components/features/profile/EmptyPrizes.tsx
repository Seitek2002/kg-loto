'use client';

import Link from 'next/link';

export const EmptyPrizes = () => {
  return (
    <div className='flex flex-col items-center justify-center py-16 sm:py-24 animate-in fade-in duration-500'>
      {/* Иконка кубка с тенью */}
      <div className='relative mb-8 flex flex-col items-center'>
        <svg
          width='80'
          height='80'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='mb-3'
        >
          {/* Основа кубка */}
          <path
            d='M19 2H5C3.3 2 2 3.3 2 5V6C2 8.5 3.8 10.6 6.2 10.9C7 13.2 9.2 15 12 15C14.8 15 17 13.2 17.8 10.9C20.2 10.6 22 8.5 22 6V5C22 3.3 20.7 2 19 2ZM4 6V5C4 4.4 4.4 4 5 4H6V9C4.9 9 4 8.1 4 7V6ZM20 6C20 7.1 19.1 8 18 8V4H19C19.6 4 20 4.4 20 5V6Z'
            fill='#FF7600'
          />
          {/* Ножка кубка */}
          <path
            d='M12 17C9.8 17 8 18.8 8 21V22H16V21C16 18.8 14.2 17 12 17Z'
            fill='#FF7600'
          />
          {/* Белая звездочка */}
          <path
            d='M12 5L12.9 7.8H15.8L13.5 9.5L14.3 12.3L12 10.6L9.7 12.3L10.5 9.5L8.2 7.8H11.1L12 5Z'
            fill='white'
          />
        </svg>

        {/* Эмитация тени от макета */}
        <div className='absolute -bottom-1 w-20 h-1.5 bg-gray-200 rounded-[100%] blur-[3px]'></div>
      </div>

      {/* Текст */}
      <h3 className='text-[18px] sm:text-[20px] font-bold text-[#4B4B4B] mb-6 font-rubik'>
        Призов пока нет
      </h3>

      {/* Кнопка ИГРАТЬ */}
      <Link
        href='/lotteries'
        className='bg-[#4B4B4B] text-white text-[13px] sm:text-[14px] font-bold uppercase rounded-full px-10 py-3 sm:py-3.5 hover:bg-[#4B4B4B] active:scale-95 transition-all'
      >
        Играть
      </Link>
    </div>
  );
};
