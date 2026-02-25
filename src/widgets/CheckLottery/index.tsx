'use client';

import { useState } from 'react';
import { Description } from '@/components/ui/Description';
import { Title } from '@/components/ui/Title';
import CheckResultModal from '@/components/features/modal/CheckResultModal'; // Убедись, что путь правильный
import { MagneticButton } from '@/components/ui/MagneticButton'; // 🔥 Добавили магнитную кнопку

export const CheckLottery = () => {
  const [ticketNumber, setTicketNumber] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWin, setIsWin] = useState(false);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketNumber.trim()) return;

    // 🔥 Логика проверки: 200 = выигрыш, остальное = проигрыш
    setIsWin(ticketNumber.trim() === '200');
    setIsModalOpen(true);
  };

  return (
    <section className='my-12 lg:my-25' id='check'>
      <Title>ПРОВЕРКА ЛОТЕРЕИ</Title>
      <Description>
        Популярные лотереи привлекают внимание благодаря крупным джекпотам,
        частым тиражам и удобным условиям участия.
      </Description>

      {/* Форма */}
      <form
        onSubmit={handleCheck}
        className='flex flex-col lg:flex-row gap-6 lg:items-end lg:mt-10'
      >
        <div className='flex flex-col gap-2 lg:w-1/2'>
          <label
            htmlFor='draw-number'
            className='text-xs lg:text-xl font-bold text-gray-900 font-rubik'
          >
            Номер билета
          </label>
          {/* 🔥 Эффект фокуса уже встроен через focus:ring-[#FFD600], но можно добавить shadow */}
          <input
            id='draw-number'
            type='text'
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value)}
            placeholder='Например: 200'
            className='w-full lg:text-xl p-4 lg:py-7 lg:px-10 rounded-full lg:rounded-r-none bg-white text-sm text-gray-900 placeholder:text-gray-400 border-none outline-none focus:ring-2 focus:ring-[#FFD600] focus:shadow-lg transition-all duration-300 font-rubik'
          />
        </div>

        {/* 🔥 Обернули кнопку в MagneticButton */}
        <MagneticButton className='w-full lg:w-1/2 mt-4 lg:mt-0'>
          <button
            type='submit'
            disabled={!ticketNumber.trim()}
            className='cursor-pointer lg:rounded-l-none lg:text-xl w-full h-11.5 lg:h-auto lg:py-7 bg-[#262626] text-white rounded-full font-bold text-xs uppercase tracking-wider hover:bg-black active:scale-[0.98] transition-all shadow-lg disabled:opacity-70 disabled:active:scale-100'
          >
            Проверить
          </button>
        </MagneticButton>
      </form>

      {/* Модалка */}
      <CheckResultModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isWin={isWin}
        ticketNumber={ticketNumber}
      />
    </section>
  );
};
