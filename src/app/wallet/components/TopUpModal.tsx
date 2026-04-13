'use client';

import { useMounted } from '@/hooks/useMounted';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';
import Image from 'next/image';
import { useTopUp } from '@/hooks/useFinance';
import { Loader2, X } from 'lucide-react';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TopUpModal = ({ isOpen, onClose }: TopUpModalProps) => {
  const mounted = useMounted();
  const [amount, setAmount] = useState('');

  const { mutate: createPaylink, isPending } = useTopUp();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      // Очищаем сумму при закрытии через таймаут для плавности
      const timer = setTimeout(() => setAmount(''), 300);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleTopUp = () => {
    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) return;

    createPaylink(amount, {
      onSuccess: (data) => {
        if (data.paylinkUrl) {
          window.location.href = data.paylinkUrl;
        }
      },
      // Ошибка уже обрабатывается глобально в apiClient или в хуке,
      // но тут можно добавить локальный фидбек если нужно
    });
  };

  if (!isOpen || !mounted) return null;

  // Теперь форма валидна, если просто введена сумма больше 0
  const isFormValid = amount.trim() !== '' && Number(amount) > 0;

  const modalContent = (
    <div className='fixed inset-0 z-9999 flex items-center justify-center p-4'>
      <div
        className='absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity'
        onClick={handleBackdropClick}
      />

      <div className='relative w-full max-w-105 bg-[#F5F5F7] rounded-3xl lg:rounded-4xl p-6 lg:p-10 shadow-2xl z-10 animate-in zoom-in-95 duration-200'>
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className='absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors'
        >
          <X size={24} />
        </button>

        <h2 className='text-[20px] lg:text-[24px] font-black text-[#2D2D2D] uppercase text-center leading-tight mb-2'>
          Пополнение баланса
        </h2>

        <p className='text-[#8C8C8C] text-[11px] lg:text-[12px] text-center mb-6 lg:mb-8 font-medium'>
          Деньги поступят на счет моментально после оплаты
        </p>

        {/* Ввод суммы */}
        <div className='flex flex-col gap-2 mb-6'>
          <label className='text-[13px] lg:text-[14px] font-bold text-[#2D2D2D] ml-1'>
            Сумма пополнения (сом)
          </label>
          <input
            type='number'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder='Например: 100'
            min='1'
            className='w-full bg-white rounded-xl px-5 py-4 text-[16px] font-bold text-[#2D2D2D] outline-none border-2 border-transparent focus:border-[#FFD600] transition-all shadow-sm placeholder:text-gray-300'
          />
        </div>

        {/* Информационный блок доступных методов */}
        <div className='flex flex-col gap-3 mb-6 lg:mb-8'>
          <div className='bg-white rounded-[20px] p-4 border border-gray-100 shadow-sm'>
            <div className='text-[12px] font-bold text-[#2D2D2D] mb-3 opacity-60 uppercase tracking-tight'>
              Доступные способы оплаты:
            </div>

            {/* Группа мобильных кошельков */}
            <div className='flex flex-wrap items-center gap-4 mb-4 pb-4 border-b border-gray-50'>
              <Image
                src='/banks-logo/mbank.png'
                alt='MBank'
                width={24}
                height={24}
                className='grayscale-[0.5] hover:grayscale-0 transition-all'
              />
              <Image
                src='/banks-logo/o-bank.png'
                alt='O! Bank'
                width={24}
                height={24}
                className='grayscale-[0.5] hover:grayscale-0 transition-all'
              />
              <Image
                src='/banks-logo/bakai.png'
                alt='Bakai'
                width={24}
                height={24}
                className='grayscale-[0.5] hover:grayscale-0 transition-all'
              />
              <Image
                src='/banks-logo/optima.png'
                alt='Optima'
                width={24}
                height={24}
                className='grayscale-[0.5] hover:grayscale-0 transition-all'
              />
              <Image
                src='/banks-logo/elkart.png'
                alt='Elkart'
                width={24}
                height={24}
                className='grayscale-[0.5] hover:grayscale-0 transition-all'
              />
            </div>

            {/* Группа карт */}
            <div className='flex items-center gap-2'>
              <div className='text-[#1A1F71] font-black italic text-lg tracking-tighter'>
                VISA
              </div>
              <div className='text-[#2D2D2D] text-[13px] font-bold'>
                / Mastercard
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleTopUp}
          disabled={!isFormValid || isPending}
          className={clsx(
            'w-full py-4 flex items-center justify-center gap-2 rounded-full font-black text-[13px] uppercase tracking-wider transition-all duration-300 cursor-pointer',
            isFormValid && !isPending
              ? 'bg-[#FFD600] text-[#2D2D2D] hover:bg-[#F5C200] active:scale-95 shadow-[0_4px_14px_rgba(255,214,0,0.4)]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed',
          )}
        >
          {isPending ? (
            <Loader2 className='w-5 h-5 animate-spin' />
          ) : (
            'Перейти к оплате'
          )}
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
