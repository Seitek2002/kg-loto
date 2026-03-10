'use client';

import { useState } from 'react';

export const AgeVerificationModal = () => {
  const [isOpen, setIsOpen] = useState(true);

  const handleConfirm = () => {
    // 🔥 Ставим куку на 1 год (31536000 секунд)
    document.cookie = 'age_verified=true; path=/; max-age=31536000;';
    setIsOpen(false);
  };

  const handleReject = () => {
    // 🔥 Уводим несовершеннолетних с сайта
    window.location.href = 'https://google.com';
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4'>
      {/* Анимация появления (zoom-in) */}
      <div className='bg-white rounded-[32px] p-6 sm:p-10 max-w-[560px] w-full flex flex-col items-center text-center shadow-2xl animate-in zoom-in-95 duration-300'>
        <h2 className='text-[20px] sm:text-[24px] font-black font-benzin uppercase text-[#2D2D2D] mb-4'>
          Подтверждение возраста
        </h2>

        <p className='text-sm sm:text-base text-[#6E6E6E] mb-8 max-w-[360px] leading-relaxed'>
          Доступ к сервису предоставляется только пользователям старше 18 лет.
        </p>

        {/* Магия флексов: на мобилке колонка, на десктопе строка в обратном порядке */}
        <div className='flex flex-col sm:flex-row-reverse w-full gap-3 sm:gap-4'>
          {/* Светлая кнопка (Отказ) */}
          <button
            onClick={handleReject}
            className='w-full sm:flex-1 bg-white text-[#4B4B4B] border border-[#A3A3A3] py-4 rounded-full font-bold text-[14px] hover:bg-gray-50 active:scale-95 transition-all'
          >
            Мне нет 18 лет
          </button>

          {/* Темная кнопка (Подтверждение) */}
          <button
            onClick={handleConfirm}
            className='w-full sm:flex-1 bg-[#4B4B4B] text-white py-4 rounded-full font-bold text-[14px] hover:bg-[#2D2D2D] active:scale-95 transition-all'
          >
            Мне есть 18 лет
          </button>
        </div>
      </div>
    </div>
  );
};
