'use client';

import { useMounted } from '@/hooks/useMounted';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';
import Image from 'next/image';
import { useTopUp } from '@/hooks/useFinance'; // 🔥 Подключаем хук
import { Loader2 } from 'lucide-react';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TopUpModal = ({ isOpen, onClose }: TopUpModalProps) => {
  const mounted = useMounted();
  const [selectedMethod, setSelectedMethod] = useState<
    'mobile' | 'visa' | null
  >(null);
  const [amount, setAmount] = useState(''); // 🔥 Стейт для суммы

  const { mutate: createPaylink, isPending } = useTopUp();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setTimeout(() => {
        setSelectedMethod(null);
        setAmount(''); // Очищаем сумму при закрытии
      }, 300);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleTopUp = () => {
    if (!amount || isNaN(Number(amount))) return;

    createPaylink(amount, {
      onSuccess: (data) => {
        // 🔥 Перенаправляем пользователя на платежный шлюз
        if (data.paylinkUrl) {
          window.location.href = data.paylinkUrl;
        }
      },
      onError: (err) => {
        console.error('Ошибка создания ссылки на оплату:', err);
      },
    });
  };

  if (!isOpen || !mounted) return null;

  // Форма валидна, если выбран метод и введена сумма больше 0
  const isFormValid = selectedMethod !== null && Number(amount) > 0;

  const modalContent = (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center p-4'>
      <div
        className='absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity'
        onClick={handleBackdropClick}
      />

      <div className='relative w-full max-w-[420px] bg-[#F5F5F7] rounded-[24px] lg:rounded-[32px] p-6 lg:p-10 shadow-2xl z-10'>
        <h2 className='text-[20px] lg:text-[24px] font-black text-[#2D2D2D] uppercase text-center leading-tight mb-2'>
          Пополнение баланса
        </h2>

        <p className='text-[#8C8C8C] text-[11px] lg:text-[12px] text-center mb-6 lg:mb-8 font-medium'>
          Деньги поступят на счет моментально после оплаты
        </p>

        {/* 🔥 НОВОЕ ПОЛЕ: Ввод суммы */}
        <div className='flex flex-col gap-2 mb-6'>
          <label className='text-[13px] lg:text-[14px] font-bold text-[#2D2D2D]'>
            Сумма пополнения (сом)
          </label>
          <input
            type='number'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder='Например: 100'
            min='1'
            className='w-full bg-white rounded-xl px-4 py-3.5 text-[16px] font-bold text-[#2D2D2D] outline-none border border-transparent focus:border-[#FFD600] transition-colors shadow-sm'
          />
        </div>

        <div className='flex flex-col gap-3 mb-6 lg:mb-8'>
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
            <div className='text-[#1A1F71] font-black italic text-xl tracking-tighter'>
              VISA
            </div>
          </div>
        </div>

        <button
          onClick={handleTopUp}
          disabled={!isFormValid || isPending}
          className={clsx(
            'w-full py-4 flex items-center justify-center gap-2 rounded-full font-black text-[13px] uppercase tracking-wider transition-all duration-300',
            isFormValid && !isPending
              ? 'bg-[#FFD600] text-[#2D2D2D] hover:bg-[#F5C200] active:scale-95 shadow-[0_4px_14px_rgba(255,214,0,0.4)]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed',
          )}
        >
          {isPending ? (
            <Loader2 className='w-5 h-5 animate-spin text-gray-500' />
          ) : (
            'Продолжить'
          )}
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
