'use client';

import { useState } from 'react';
import { Description } from '@/components/ui/Description';
import { Title } from '@/components/ui/Title';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { AppRedirectModal } from '@/components/features/modal/AppRedirectModal'; // 🔥 Наша универсальная модалка
import clsx from 'clsx';

export const CheckLottery = () => {
  const [ticketNumber, setTicketNumber] = useState('');

  // 🔥 Оставляем только один стейт для нашей заглушки
  const [isRedirectModalOpen, setIsRedirectModalOpen] = useState(false);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();

    // Защита от пустых сабмитов (на всякий случай, хотя кнопка и так заблокирована)
    if (!ticketNumber.trim()) return;

    // 🔥 Никаких запросов. Просто показываем, что нужно скачать приложение
    setIsRedirectModalOpen(true);
  };

  return (
    <section className='my-12 lg:my-25' id='check'>
      <Title>ПРОВЕРКА ЛОТЕРЕИ</Title>
      <Description>
        Популярные лотереи привлекают внимание благодаря крупным джекпотам,
        частым тиражам и удобным условиям участия.
      </Description>

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
          <input
            id='draw-number'
            type='text'
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value)}
            placeholder='Например: 100'
            // Убрали disabled={checkMutation.isPending}, так как загрузки больше нет
            className='w-full lg:text-xl p-4 lg:py-7 lg:px-10 rounded-full lg:rounded-r-none bg-white text-sm text-gray-900 placeholder:text-gray-400 border-none outline-none focus:ring-2 focus:ring-[#FFD600] focus:shadow-lg transition-all duration-300 font-rubik disabled:opacity-60 disabled:cursor-not-allowed'
          />
        </div>

        <MagneticButton className='w-full lg:w-1/2 mt-4 lg:mt-0'>
          <button
            type='submit'
            disabled={!ticketNumber.trim()} // Кнопка активна только если что-то ввели
            className={clsx(
              'cursor-pointer lg:rounded-l-none lg:text-xl w-full h-11.5 lg:h-auto lg:py-7 bg-[#262626] text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2',
              !ticketNumber.trim()
                ? 'opacity-70 cursor-not-allowed'
                : 'hover:bg-black active:scale-[0.98]',
            )}
          >
            Проверить
          </button>
        </MagneticButton>
      </form>

      {/* 🔥 Вместо кучи модалок с авторизациями и ошибками - одна элегантная заглушка */}
      <AppRedirectModal
        isOpen={isRedirectModalOpen}
        onClose={() => setIsRedirectModalOpen(false)}
      />
    </section>
  );
};
