'use client';

import Link from 'next/link';
import Image from 'next/image';
import { clsx } from 'clsx';
import { useState, useEffect } from 'react';
import { AppRedirectModal } from '@/components/features/modal/AppRedirectModal';
import { MobileMenu } from './MobileMenu';
import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';

interface HeaderProps {
  theme?: 'light' | 'dark';
}

export const Header = ({ theme = 'light' }: HeaderProps) => {
  const [isRedirectModalOpen, setIsRedirectModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const t = useTranslations('header');
  const isDark = theme === 'dark';

  const handleRestrictedClick = () => {
    setIsMobileMenuOpen(false);
    setIsRedirectModalOpen(true);
  };

  const navLinkClass = clsx(
    'text-sm font-medium uppercase transition-colors',
    isDark
      ? 'text-[#2D2D2D]/70 hover:text-[#2D2D2D]'
      : 'text-white/80 hover:text-white',
  );

  const regBtnClass = clsx(
    'px-6 py-2.5 rounded-full text-[10px] font-black uppercase transition-colors cursor-pointer',
    isDark
      ? 'bg-[#2D2D2D] text-white hover:bg-black'
      : 'bg-white text-[#2D2D2D] hover:bg-gray-200',
  );

  // Блокируем скролл при открытом мобильном меню
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className='relative z-50'>
        {/* DESKTOP HEADER TOP */}
        <div className='hidden lg:flex bg-[#0B1F3B] justify-between text-white py-3 px-8 text-xs font-rubik'>
          <Link href='/about' className='hover:underline'>
            {t('about')}
          </Link>
          <a href='tel:996312440107' className='flex hover:underline'>
            {t('hotline')} 996 312 44 01 07
          </a>
          <button
            onClick={handleRestrictedClick}
            className='cursor-pointer hover:underline'
          >
            {t('check_ticket')}
          </button>
        </div>

        {/* DESKTOP HEADER MAIN */}
        <div className='hidden lg:flex py-3 font-rubik w-full items-center justify-between px-8 bg-white shadow-sm relative z-20'>
          <Link href='/' className='relative w-32 h-12'>
            <Image
              src='/logo.png'
              alt='KGLOTO'
              fill
              className='object-contain'
            />
          </Link>

          <nav className='flex items-center gap-10'>
            <Link href='/' className={navLinkClass}>
              {t('home')}
            </Link>
            <Link href='/lottery' className={navLinkClass}>
              {t('instant')}
            </Link>
            <Link href='/about' className={navLinkClass}>
              {t('about')}
            </Link>
          </nav>

          <div className='flex items-center gap-4'>
            {/* Пока оставляем "RU", позже сюда можно прикрутить переключатель языков */}
            <LanguageSwitcher isDark={false} />
            <button className={regBtnClass} onClick={handleRestrictedClick}>
              {t('register')}
            </button>
            <button
              onClick={handleRestrictedClick}
              className='bg-[#FFD600] cursor-pointer text-[#2D2D2D] px-6 py-2.5 rounded-full text-[10px] font-black uppercase hover:bg-[#FFC000] transition-colors'
            >
              {t('profile')}
            </button>
          </div>
        </div>

        {/* MOBILE HEADER */}
        <div
          className={clsx(
            'flex lg:hidden items-center justify-between px-4 py-3 transition-colors duration-300 z-50 relative',
            isMobileMenuOpen
              ? 'bg-[#f9f9f9]'
              : isDark
                ? 'bg-[#0B1F3B]'
                : 'bg-[#f9f9f9]',
          )}
        >
          <Link
            href='/'
            className='relative w-24 h-10'
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Image
              src='/logo.png'
              alt='KGLOTO'
              fill
              className='object-contain object-left'
            />
          </Link>

          <div className='flex items-center gap-4'>
            {/* Тоже оставляем "РУ" как плейсхолдер переключателя */}
            <LanguageSwitcher isDark={!isMobileMenuOpen} />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={clsx(
                'p-1',
                isMobileMenuOpen || !isDark ? 'text-[#2D2D2D]' : 'text-white',
              )}
            >
              {isMobileMenuOpen ? (
                <X size={28} strokeWidth={2} />
              ) : (
                <Menu size={28} strokeWidth={2} />
              )}
            </button>
          </div>
        </div>

        {/* Наше вынесенное мобильное меню */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          onRestrictedClick={handleRestrictedClick}
        />
      </header>

      {/* Глобальная модалка-заглушка */}
      <AppRedirectModal
        isOpen={isRedirectModalOpen}
        onClose={() => setIsRedirectModalOpen(false)}
      />
    </>
  );
};
