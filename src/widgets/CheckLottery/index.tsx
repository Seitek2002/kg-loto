'use client';

import { useState } from 'react';
import { Description } from '@/components/ui/Description';
import { Title } from '@/components/ui/Title';
import { MagneticButton } from '@/components/ui/MagneticButton';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { AuthModal } from '@/components/features/modal/AuthModal';
import { useAuthStore } from '@/store/auth';
import { CheckTicketModal } from '@/components/features/modal/CheckTicketModal';

export const CheckLottery = ({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) => {
  const [ticketNumber, setTicketNumber] = useState('');

  // Состояния для двух модалок
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);

  // Достаем инфу о том, залогинен ли юзер
  const isAuth = useAuthStore((state) => state.isAuth);

  const t = useTranslations('check_lottery');

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketNumber.trim()) return;

    if (!isAuth) {
      // Если не залогинен - просим войти
      setIsAuthModalOpen(true);
    } else {
      // Если залогинен - открываем модалку с проверкой
      setIsCheckModalOpen(true);
    }
  };

  return (
    <section className='my-12 lg:my-25' id='check'>
      <Title>{title || t('title')}</Title>
      <Description>{description || t('desc')}</Description>

      <form
        onSubmit={handleCheck}
        className='flex flex-col lg:flex-row gap-6 lg:items-end lg:mt-10'
      >
        <div className='flex flex-col gap-2 lg:w-1/2'>
          <label
            htmlFor='draw-number'
            className='text-xs lg:text-xl font-bold text-gray-900 font-rubik uppercase'
          >
            {t('label')}
          </label>
          <input
            id='draw-number'
            type='text'
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value)}
            placeholder={t('placeholder')}
            className='w-full lg:text-xl p-4 lg:py-7 lg:px-10 rounded-full lg:rounded-r-none bg-white text-sm text-gray-900 placeholder:text-gray-400 border-none outline-none focus:ring-2 focus:ring-[#FFD600] focus:shadow-lg transition-all duration-300 font-rubik disabled:opacity-60 disabled:cursor-not-allowed'
          />
        </div>

        <MagneticButton className='w-full lg:w-1/2 mt-4 lg:mt-0'>
          <button
            type='submit'
            disabled={!ticketNumber.trim()}
            className={clsx(
              'cursor-pointer lg:rounded-l-none lg:text-xl w-full h-11.5 lg:h-auto lg:py-7 bg-[#262626] text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2',
              !ticketNumber.trim()
                ? 'opacity-70 cursor-not-allowed'
                : 'hover:bg-black active:scale-[0.98]',
            )}
          >
            {t('button')}
          </button>
        </MagneticButton>
      </form>

      {/* Модалка авторизации */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialFlow='login'
      />

      {/* 🔥 Новая модалка результата проверки билета */}
      <CheckTicketModal
        isOpen={isCheckModalOpen}
        onClose={() => setIsCheckModalOpen(false)}
        initialCode={ticketNumber}
      />
    </section>
  );
};
