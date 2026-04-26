'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { clsx } from 'clsx';
import { useState } from 'react';
import { TopUpModal } from './components/TopUpModal';
import { useBalance, useTransactions } from '@/entities/finance/api'; // 🔥 Поменяли хук
import { Loader2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

// Функция для красивого отображения статуса с бэкенда
const getStatusProps = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'pending':
    case 'processing':
      return { text: 'В обработке', classes: 'bg-[#FFF0D4] text-[#F58220]' };
    case 'completed':
    case 'success':
      return { text: 'Успешно', classes: 'bg-[#D1F5D3] text-[#1FAF38]' };
    case 'rejected':
    case 'failed':
    case 'error':
      return { text: 'Ошибка', classes: 'bg-[#FFD7D7] text-[#FF4B4B]' };
    default:
      return {
        text: status || 'Неизвестно',
        classes: 'bg-gray-100 text-[#737373]',
      };
  }
};

// Форматирование даты из "2026-04-02" в "02.04.2026"
const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export default function WalletPage() {
  const user = useAuthStore((state) => state.user);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);

  useBalance();
  // 🔥 Запрашиваем ОБЩУЮ историю транзакций
  const { data: transactions = [], isLoading } = useTransactions();

  return (
    <div className='min-h-screen bg-[#F9F9F9] font-rubik pb-20'>
      <div className='max-w-[1000px] mx-auto px-4 pt-6'>
        {/* ХЛЕБНЫЕ КРОШКИ */}
        <nav className='flex items-center gap-2 text-[12px] font-medium text-[#737373] mb-6 lg:mb-8'>
          <Link href='/' className='hover:text-[#4B4B4B] transition-colors'>
            Главная
          </Link>
          <span>/</span>
          <span className='text-[#4B4B4B] font-bold'>Кошелек</span>
        </nav>

        {/* КАРТОЧКА БАЛАНСА */}
        <div className='bg-white rounded-3xl lg:rounded-4xl p-6 lg:p-10 shadow-sm border border-gray-100 mb-8 lg:mb-10'>
          <h2 className='text-[14px] lg:text-[16px] font-bold text-[#4B4B4B] uppercase tracking-wide mb-2 lg:mb-4'>
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
              <button className='bg-white border-2 border-[#F58220] text-[#F58220] hover:bg-orange-50 active:scale-95 py-3 lg:py-4 px-8 rounded-full font-bold text-[14px] lg:text-[16px] transition-all w-full sm:w-auto shadow-sm'>
                Вывести
              </button>
            </div>
          </div>
        </div>

        {/* ИСТОРИЯ */}
        <h3 className='text-[18px] lg:text-[20px] font-bold text-[#4B4B4B] mb-4 lg:mb-6'>
          История операций
        </h3>

        {isLoading ? (
          <div className='flex justify-center items-center py-20'>
            <Loader2 className='w-10 h-10 animate-spin text-[#F58220]' />
          </div>
        ) : transactions.length === 0 ? (
          <div className='bg-white rounded-4xl p-10 text-center text-gray-400 font-medium shadow-sm'>
            История операций пуста
          </div>
        ) : (
          <>
            {/* ДЕСКТОПНАЯ ТАБЛИЦА */}
            <div className='hidden lg:block bg-white rounded-4xl p-8 shadow-sm border border-gray-100'>
              <div className='grid grid-cols-4 pb-4 text-[#737373] font-bold text-[14px] uppercase text-center border-b border-gray-50'>
                <div className='text-left pl-4'>Операция</div>
                <div>Дата</div>
                <div>Сумма</div>
                <div>Статус</div>
              </div>
              <div className='flex flex-col'>
                {transactions.map((tx, idx) => {
                  const status = getStatusProps(tx.paymentStatus);
                  const isNegative = tx.amount.toString().startsWith('-');
                  // Убираем минус для красивого отображения, цвет скажет сам за себя
                  const absAmount = tx.amount.toString().replace('-', '');

                  return (
                    <div
                      key={idx}
                      className='grid grid-cols-4 py-5 border-b border-gray-50 last:border-0 text-center items-center hover:bg-gray-50/50 transition-colors'
                    >
                      <div className='flex items-center gap-3 pl-4'>
                        <div
                          className={clsx(
                            'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                            isNegative
                              ? 'bg-red-50 text-red-500'
                              : 'bg-green-50 text-green-500',
                          )}
                        >
                          {isNegative ? (
                            <ArrowUpRight size={20} />
                          ) : (
                            <ArrowDownLeft size={20} />
                          )}
                        </div>
                        <div className='flex flex-col text-left'>
                          <span className='text-[#4B4B4B] text-[15px] font-bold'>
                            {isNegative ? 'Списание' : 'Пополнение'}
                          </span>
                          <span className='text-[#737373] text-[12px]'>
                            {tx.paymentMethod || 'Внутренний счет'}
                          </span>
                        </div>
                      </div>

                      <div className='text-[#4B4B4B] text-[15px] font-medium'>
                        {formatDate(tx.date)}
                      </div>

                      <div
                        className={clsx(
                          'text-[16px] font-black',
                          isNegative ? 'text-[#4B4B4B]' : 'text-[#1FAF38]',
                        )}
                      >
                        {isNegative ? '-' : '+'}
                        {absAmount}{' '}
                        <span className='underline text-sm font-bold'>с</span>
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
              {transactions.map((tx, idx) => {
                const status = getStatusProps(tx.paymentStatus);
                const isNegative = tx.amount.toString().startsWith('-');
                const absAmount = tx.amount.toString().replace('-', '');

                return (
                  <div
                    key={idx}
                    className='bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 flex flex-col gap-4'
                  >
                    <div className='flex justify-between items-center border-b border-gray-50 pb-3'>
                      <div className='flex items-center gap-3'>
                        <div
                          className={clsx(
                            'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                            isNegative
                              ? 'bg-red-50 text-red-500'
                              : 'bg-green-50 text-green-500',
                          )}
                        >
                          {isNegative ? (
                            <ArrowUpRight size={20} />
                          ) : (
                            <ArrowDownLeft size={20} />
                          )}
                        </div>
                        <div className='flex flex-col'>
                          <span className='text-[#4B4B4B] text-[15px] font-bold'>
                            {isNegative ? 'Списание' : 'Пополнение'}
                          </span>
                          <span className='text-[#737373] text-[12px]'>
                            {tx.paymentMethod || 'Внутренний счет'}
                          </span>
                        </div>
                      </div>
                      <div
                        className={clsx(
                          'text-[16px] font-black',
                          isNegative ? 'text-[#4B4B4B]' : 'text-[#1FAF38]',
                        )}
                      >
                        {isNegative ? '-' : '+'}
                        {absAmount}{' '}
                        <span className='underline text-sm font-bold'>с</span>
                      </div>
                    </div>

                    <div className='flex justify-between items-center'>
                      <span className='text-[#737373] font-medium text-[13px]'>
                        Дата
                      </span>
                      <span className='text-[#4B4B4B] font-bold text-[14px]'>
                        {formatDate(tx.date)}
                      </span>
                    </div>

                    <div className='flex justify-between items-center'>
                      <span className='text-[#737373] font-medium text-[13px]'>
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
