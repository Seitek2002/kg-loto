'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import clsx from 'clsx';
import { useState } from 'react';
import { TopUpModal } from './components/TopUpModal'; // Проверь свой путь
import { useCartStore } from '@/store/cart';
import { useBalance, useWithdrawals } from '@/hooks/useFinance'; // 🔥 Добавили useWithdrawals
import { Loader2 } from 'lucide-react';

// Функция для красивого отображения статуса с бэкенда
const getStatusProps = (status: string) => {
  switch (status) {
    case 'pending':
      return { text: 'Ожидает', classes: 'bg-[#F3F4F6] text-[#4B4B4B]' };
    case 'processing':
      return { text: 'В обработке', classes: 'bg-[#FFF0D4] text-[#F58220]' };
    case 'completed':
      return { text: 'Выполнено', classes: 'bg-[#D1F5D3] text-[#1FAF38]' };
    case 'rejected':
      return { text: 'Отклонено', classes: 'bg-[#FFD7D7] text-[#FF4B4B]' };
    default:
      return { text: status, classes: 'bg-gray-100 text-gray-500' };
  }
};

// Функция для красивого названия метода
const getMethodName = (method: string) => {
  const methods: Record<string, string> = {
    mbank: 'MBank',
    visa: 'VISA',
    elcart: 'Элкарт',
  };
  return methods[method] || method;
};

// Форматирование даты из ISO ("2026-04-02T...") в "02.04.2026"
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export default function WalletPage() {
  const user = useAuthStore((state) => state.user);
  const cartCount = useCartStore((state) => state.items.length);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);

  useBalance();
  // 🔥 Запрашиваем реальную историю
  const { data: transactions = [], isLoading } = useWithdrawals();

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
            <div className='flex flex-col sm:flex-row gap-3 w-full lg:w-auto'>
              <button
                onClick={() => setIsTopUpModalOpen(true)}
                className='bg-[#F58220] hover:bg-[#E57210] active:scale-95 text-white py-3 lg:py-4 px-8 rounded-full font-bold text-[14px] lg:text-[16px] transition-all w-full sm:w-auto shadow-sm'
              >
                Пополнить
              </button>
              {/* Кнопка на будущее, если захочешь добавить вывод */}
              <button className='bg-white border-2 border-[#F58220] text-[#F58220] hover:bg-orange-50 active:scale-95 py-3 lg:py-4 px-8 rounded-full font-bold text-[14px] lg:text-[16px] transition-all w-full sm:w-auto shadow-sm'>
                Вывести
              </button>
            </div>
          </div>
        </div>

        {/* ИСТОРИЯ */}
        <h3 className='text-[18px] lg:text-[20px] font-bold text-[#4B4B4B] mb-4 lg:mb-6'>
          История выводов
        </h3>

        {isLoading ? (
          <div className='flex justify-center items-center py-20'>
            <Loader2 className='w-10 h-10 animate-spin text-[#F58220]' />
          </div>
        ) : transactions.length === 0 ? (
          <div className='bg-white rounded-[32px] p-10 text-center text-gray-400 font-medium'>
            История операций пуста
          </div>
        ) : (
          <>
            {/* ДЕСКТОПНАЯ ТАБЛИЦА */}
            <div className='hidden lg:block bg-white rounded-[32px] p-8 shadow-sm border border-gray-100'>
              <div className='grid grid-cols-4 pb-4 text-[#2D2D2D] font-bold text-[15px] text-center border-b border-gray-50'>
                <div>Дата</div>
                <div>Сумма</div>
                <div>Способ</div>
                <div>Статус</div>
              </div>
              <div className='flex flex-col'>
                {transactions.map((tx) => {
                  const status = getStatusProps(tx.status);
                  return (
                    <div
                      key={tx.id}
                      className='grid grid-cols-4 py-5 border-b border-gray-50 last:border-0 text-center items-center hover:bg-gray-50/50 transition-colors'
                    >
                      <div className='text-[#4B4B4B] text-[15px] font-medium'>
                        {formatDate(tx.createdAt)}
                      </div>
                      <div className='text-[#4B4B4B] text-[15px] font-medium'>
                        {tx.amount} <span className='underline'>с</span>
                      </div>
                      <div className='text-[#4B4B4B] text-[15px] font-medium'>
                        {getMethodName(tx.method)}
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

            {/* МОБИЛЬНЫЙ СПИСОК */}
            <div className='flex lg:hidden flex-col gap-4'>
              {transactions.map((tx) => {
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
                        {formatDate(tx.createdAt)}
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
                        Способ
                      </span>
                      <span className='text-[#2D2D2D] font-bold text-[14px]'>
                        {getMethodName(tx.method)}
                      </span>
                    </div>
                    <div className='flex justify-between items-center pt-1'>
                      <span className='text-gray-500 font-medium text-[14px]'>
                        Статус
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
                    {/* Если отклонено, можно показать причину */}
                    {tx.status === 'rejected' && tx.rejectionReason && (
                      <div className='text-xs text-red-500 mt-1 text-right'>
                        Причина: {tx.rejectionReason}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <TopUpModal
        isOpen={isTopUpModalOpen}
        onClose={() => setIsTopUpModalOpen(false)}
      />
    </div>
  );
}
