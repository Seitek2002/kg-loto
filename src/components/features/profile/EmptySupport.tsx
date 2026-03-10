'use client';

export const EmptySupport = () => {
  return (
    <div className='flex flex-col items-center justify-center py-16 sm:py-24 animate-in fade-in duration-500'>
      {/* Иконка наушников с тенью */}
      <div className='relative mb-8 flex flex-col items-center'>
        <svg
          width='80'
          height='80'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='mb-3'
        >
          {/* Дужка наушников и динамики */}
          <path
            d='M12 2C6.48 2 2 6.48 2 12V19C2 20.1 2.9 21 4 21H7V14H4V12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12V14H17V21H20C21.1 21 22 20.1 22 19V12C22 6.48 17.52 2 12 2Z'
            fill='#FF7600'
          />
          {/* Микрофон */}
          <path
            d='M19 19C19 19.55 18.55 20 18 20H15V22H18C19.66 22 21 20.66 21 19V18H19V19Z'
            fill='#FF7600'
          />
        </svg>

        {/* Эмитация тени от макета */}
        <div className='absolute -bottom-1 w-20 h-1.5 bg-gray-200 rounded-[100%] blur-[3px]'></div>
      </div>

      {/* Текст */}
      <h3 className='text-[18px] sm:text-[20px] font-bold text-[#2D2D2D] mb-6 font-rubik'>
        Обращений пока нет
      </h3>

      {/* Кнопка НАПИСАТЬ */}
      <button className='bg-[#4B4B4B] cursor-pointer text-white text-[13px] sm:text-[14px] font-bold uppercase rounded-full px-10 py-3 sm:py-3.5 hover:bg-[#2D2D2D] active:scale-95 transition-all'>
        Написать
      </button>
    </div>
  );
};
