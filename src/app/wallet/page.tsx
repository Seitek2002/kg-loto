'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import clsx from 'clsx';
import { useState } from 'react';
import { TopUpModal } from './components/TopUpModal';
import { useCartStore } from '@/store/cart';
import { useBalance } from '@/hooks/useFinance';

// Моковые данные для истории операций
const MOCK_TRANSACTIONS = [
  {
    id: 1,
    date: '02.04.2026',
    amount: '100',
    method: 'Bakai',
    status: 'pending',
  },
  {
    id: 2,
    date: '02.04.2026',
    amount: '100',
    method: 'Bakai',
    status: 'pending',
  },
  {
    id: 3,
    date: '02.04.2026',
    amount: '100',
    method: 'Mbank',
    status: 'success',
  },
  {
    id: 4,
    date: '02.04.2026',
    amount: '100',
    method: 'Bakai',
    status: 'error',
  },
  {
    id: 5,
    date: '02.04.2026',
    amount: '100',
    method: 'Bakai',
    status: 'success',
  },
  {
    id: 6,
    date: '02.04.2026',
    amount: '100',
    method: 'Mbank',
    status: 'success',
  },
  {
    id: 7,
    date: '02.04.2026',
    amount: '100',
    method: 'Mbank',
    status: 'success',
  },
];

// Функция для получения стилей и текста бейджика статуса
const getStatusProps = (status: string) => {
  switch (status) {
    case 'pending':
      return { text: 'В обработке', classes: 'bg-[#FFF0D4] text-[#F58220]' };
    case 'success':
      return { text: 'Оплачено', classes: 'bg-[#D1F5D3] text-[#1FAF38]' };
    case 'error':
      return { text: 'Отклонено', classes: 'bg-[#FFD7D7] text-[#FF4B4B]' };
    default:
      return { text: 'Неизвестно', classes: 'bg-gray-100 text-gray-500' };
  }
};

export default function WalletPage() {
  const user = useAuthStore((state) => state.user);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);

  useBalance();

  return (
    <div className='min-h-screen bg-[#F9F9F9] font-rubik pb-20'>
      <div className='max-w-[1000px] mx-auto px-4 pt-6'>
        {/* ХЛЕБНЫЕ КРОШКИ */}
        <nav className='flex items-center gap-2 text-[12px] font-medium text-gray-500 mb-6 lg:mb-8'>
          <Link href='/' className='hover:text-[#2D2D2D] transition-colors'>
            Главная
          </Link>
          <span>/</span>
          <Link
            href='/draw-lotteries'
            className='hover:text-[#2D2D2D] transition-colors'
          >
            Тиражные лотереи
          </Link>
          <span>/</span>
          <span className='text-[#2D2D2D] font-bold'>Кошелек</span>
        </nav>

        {/* КАРТОЧКА БАЛАНСА */}
        <div className='bg-white rounded-[24px] lg:rounded-[32px] p-6 lg:p-10 shadow-sm border border-gray-100 mb-8 lg:mb-10'>
          <h2 className='text-[14px] lg:text-[16px] font-bold text-[#2D2D2D] uppercase tracking-wide mb-2 lg:mb-4'>
            Баланс
          </h2>
          <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6'>
            <div className='text-[48px] lg:text-[64px] font-black text-[#4B4B4B] leading-none'>
              {user?.balance || '0'}{' '}
              <span className='underline text-[36px] lg:text-[48px]'>с</span>
            </div>
            <button
              onClick={() => setIsTopUpModalOpen(true)}
              className='bg-[#F58220] hover:bg-[#E57210] active:scale-95 text-white py-3 lg:py-4 px-8 rounded-full font-bold text-[14px] lg:text-[16px] transition-all w-full lg:w-auto shadow-sm'
            >
              Пополнить
            </button>
          </div>
        </div>

        {/* ЗАГОЛОВОК ИСТОРИИ */}
        <h3 className='text-[18px] lg:text-[20px] font-bold text-[#4B4B4B] mb-4 lg:mb-6'>
          История операций
        </h3>

        {/* ДЕСКТОПНАЯ ТАБЛИЦА */}
        <div className='hidden lg:block bg-white rounded-[32px] p-8 shadow-sm border border-gray-100'>
          {/* Шапка таблицы */}
          <div className='grid grid-cols-4 pb-4 text-[#2D2D2D] font-bold text-[15px] text-center border-b border-gray-50'>
            <div>Дата</div>
            <div>Сумма</div>
            <div>Способ оплаты</div>
            <div>Статус платежа</div>
          </div>

          {/* Строки */}
          <div className='flex flex-col'>
            {MOCK_TRANSACTIONS.map((tx) => {
              const status = getStatusProps(tx.status);
              return (
                <div
                  key={tx.id}
                  className='grid grid-cols-4 py-5 border-b border-gray-50 last:border-0 text-center items-center hover:bg-gray-50/50 transition-colors'
                >
                  <div className='text-[#4B4B4B] text-[15px] font-medium'>
                    {tx.date}
                  </div>
                  <div className='text-[#4B4B4B] text-[15px] font-medium'>
                    {tx.amount} <span className='underline'>с</span>
                  </div>
                  <div className='text-[#4B4B4B] text-[15px] font-medium'>
                    {tx.method}
                  </div>
                  <div className='flex justify-center'>
                    <span
                      className={clsx(
                        'px-4 py-1.5 rounded-full text-[13px] font-bold',
                        status.classes,
                      )}
                    >
                      {status.text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* МОБИЛЬНЫЙ СПИСОК (КАРТОЧКИ) */}
        <div className='flex lg:hidden flex-col gap-4'>
          {MOCK_TRANSACTIONS.map((tx) => {
            const status = getStatusProps(tx.status);
            return (
              <div
                key={tx.id}
                className='bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 flex flex-col gap-3'
              >
                <div className='flex justify-between items-center'>
                  <span className='text-gray-500 font-medium text-[14px]'>
                    Дата
                  </span>
                  <span className='text-[#2D2D2D] font-bold text-[14px]'>
                    {tx.date}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-500 font-medium text-[14px]'>
                    Сумма
                  </span>
                  <span className='text-[#2D2D2D] font-bold text-[14px]'>
                    {tx.amount} <span className='underline'>с</span>
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-500 font-medium text-[14px]'>
                    Способ оплаты
                  </span>
                  <span className='text-[#2D2D2D] font-bold text-[14px]'>
                    {tx.method}
                  </span>
                </div>
                <div className='flex justify-between items-center pt-1'>
                  <span className='text-gray-500 font-medium text-[14px]'>
                    Статус платежа
                  </span>
                  <span
                    className={clsx(
                      'px-3 py-1 rounded-full text-[12px] font-bold',
                      status.classes,
                    )}
                  >
                    {status.text}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <TopUpModal
        isOpen={isTopUpModalOpen}
        onClose={() => setIsTopUpModalOpen(false)}
      />
    </div>
  );
}
