'use client';

import { useMounted } from '@/hooks/useMounted';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';
import Image from 'next/image';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TopUpModal = ({ isOpen, onClose }: TopUpModalProps) => {
  const mounted = useMounted();
  const [selectedMethod, setSelectedMethod] = useState<
    'mobile' | 'visa' | null
  >(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      // Сбрасываем выбор при закрытии модалки (с небольшой задержкой для анимации)
      setTimeout(() => setSelectedMethod(null), 300);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Закрытие модалки при клике на фон
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center p-4'>
      {/* Темный фон (Overlay) */}
      <div
        className='absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity'
        onClick={handleBackdropClick}
      />

      {/* Контейнер модального окна */}
      <div className='relative w-full max-w-[420px] bg-[#F5F5F7] rounded-[24px] lg:rounded-[32px] p-6 lg:p-10 shadow-2xl z-10'>
        {/* Заголовок */}
        <h2 className='text-[20px] lg:text-[24px] font-black text-[#2D2D2D] uppercase text-center leading-tight mb-2'>
          Выберите кошелек
          <br />
          пополнения
        </h2>

        {/* Подзаголовок */}
        <p className='text-[#8C8C8C] text-[11px] lg:text-[12px] text-center mb-6 lg:mb-8 font-medium'>
          Деньги будут отправлены в течение 3 рабочих дней
        </p>

        {/* Варианты оплаты */}
        <div className='flex flex-col gap-3 mb-6 lg:mb-8'>
          {/* Вариант 1: Мобильные кошельки */}
          <div
            onClick={() => setSelectedMethod('mobile')}
            className={clsx(
              'bg-white rounded-[16px] lg:rounded-[20px] p-4 cursor-pointer transition-all border-2',
              selectedMethod === 'mobile'
                ? 'border-[#FFD600] shadow-md scale-[1.02]'
                : 'border-transparent hover:border-gray-200',
            )}
          >
            <div className='text-[13px] lg:text-[14px] font-bold text-[#2D2D2D] mb-3'>
              Оплата через мобильные кошельки
            </div>

            {/* Реальные логотипы банков */}
            <div className='flex items-center gap-3'>
              <Image
                src='/banks-logo/bakai.png'
                alt='Bakai Bank'
                width={24}
                height={24}
                className='object-contain'
              />
              <Image
                src='/banks-logo/o-bank.png'
                alt='O! Bank'
                width={24}
                height={24}
                className='object-contain'
              />
              <Image
                src='/banks-logo/mbank.png'
                alt='MBank'
                width={24}
                height={24}
                className='object-contain'
              />
              <Image
                src='/banks-logo/optima.png'
                alt='Optima Bank'
                width={24}
                height={24}
                className='object-contain'
              />
              <Image
                src='/banks-logo/demirbank.png'
                alt='Demir Bank'
                width={24}
                height={24}
                className='object-contain'
              />
              <Image
                src='/banks-logo/elkart.png'
                alt='Elkart'
                width={24}
                height={24}
                className='object-contain'
              />
            </div>
          </div>

          {/* Вариант 2: VISA */}
          <div
            onClick={() => setSelectedMethod('visa')}
            className={clsx(
              'bg-white rounded-[16px] lg:rounded-[20px] p-4 cursor-pointer transition-all border-2',
              selectedMethod === 'visa'
                ? 'border-[#FFD600] shadow-md scale-[1.02]'
                : 'border-transparent hover:border-gray-200',
            )}
          >
            <div className='text-[13px] lg:text-[14px] font-bold text-[#2D2D2D] mb-3'>
              Оплата через карту VISA
            </div>
            {/* Если у тебя появится логотип VISA, сможешь заменить этот текст на <Image /> аналогичным образом */}
            <div className='text-[#1A1F71] font-black italic text-xl tracking-tighter'>
              VISA
            </div>
          </div>
        </div>

        {/* Кнопка Продолжить */}
        <button
          disabled={!selectedMethod}
          className={clsx(
            'w-full py-4 rounded-full font-black text-[13px] uppercase tracking-wider transition-all duration-300',
            selectedMethod
              ? 'bg-[#FFD600] text-[#2D2D2D] hover:bg-[#F5C200] active:scale-95 shadow-[0_4px_14px_rgba(255,214,0,0.4)]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed',
          )}
        >
          Продолжить
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
