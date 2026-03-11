'use client';

import Link from 'next/link';
import Image from 'next/image';
import { clsx } from 'clsx';
import { useState, useEffect } from 'react';
import { AppRedirectModal } from '@/components/features/modal/AppRedirectModal';
import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuItem } from '@/types/api';

// 🔥 Хелпер для безопасного преобразования ссылок с бэкенда в относительные
const getRelativeUrl = (url: string) => {
  try {
    return new URL(url).pathname;
  } catch {
    return url.startsWith('/') ? url : `/${url}`;
  }
};

// ==========================================
// КОМПОНЕНТ МОБИЛЬНОГО МЕНЮ
// ==========================================
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onRestrictedClick: () => void;
  menuItems: MenuItem[]; // 🔥 Добавили пропс
}

export const MobileMenu = ({
  isOpen,
  onClose,
  onRestrictedClick,
  menuItems,
}: MobileMenuProps) => {
  const t = useTranslations('header');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className='fixed inset-x-0 top-[64px] bottom-0 z-[100] bg-black/40 backdrop-blur-sm flex flex-col pb-24 overflow-y-auto'
        >
          <div className='m-4 bg-white rounded-[24px] p-5 shadow-2xl flex flex-col gap-4 font-rubik'>
            <div className='flex flex-col'>
              {/* 🔥 Динамическое меню с бэкенда */}
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  href={getRelativeUrl(item.link)}
                  onClick={onClose}
                  className='py-4 text-[13px] font-bold text-[#2D2D2D] uppercase border-b border-gray-100 hover:text-[#F5A623] transition-colors'
                >
                  {item.title}
                </Link>
              ))}

              <button
                onClick={onRestrictedClick}
                className='py-4 text-left text-[13px] font-bold text-[#2D2D2D] uppercase border-b border-gray-100 hover:text-[#F5A623] transition-colors'
              >
                {t('check_ticket')}
              </button>

              <a
                href='tel:996312440107'
                onClick={onClose}
                className='py-4 text-[13px] font-bold text-[#2D2D2D] uppercase border-b border-gray-100 hover:text-[#F5A623] transition-colors'
              >
                {t('hotline')}: 996 312 44 01 07
              </a>
            </div>

            <div className='flex gap-3 mt-4 pt-2'>
              <button
                onClick={onRestrictedClick}
                className='flex-1 bg-[#4A4A4A] text-white py-4 rounded-full font-black text-[10px] uppercase tracking-wider active:scale-95 transition-transform'
              >
                {t('register')}
              </button>
              <button
                onClick={onRestrictedClick}
                className='flex-1 bg-[#FFD600] text-[#2D2D2D] py-4 rounded-full font-black text-[10px] uppercase tracking-wider active:scale-95 transition-transform shadow-[0_4px_14px_rgba(255,214,0,0.4)]'
              >
                {t('profile')}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ==========================================
// ГЛАВНЫЙ КОМПОНЕНТ HEADER
// ==========================================
interface HeaderProps {
  theme?: 'light' | 'dark';
  headerMenu?: MenuItem[]; // 🔥 Добавили пропс
}

export const Header = ({ theme = 'light', headerMenu = [] }: HeaderProps) => {
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

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMobileMenuOpen]);

  // Сортируем пункты по order
  const sortedMenu = [...headerMenu]
    .filter((item) => item.isActive)
    .sort((a, b) => a.order - b.order);

  return (
    <>
      <header className='relative z-50'>
        <div className='hidden lg:flex bg-[#0B1F3B] justify-between text-white py-3 px-8 text-xs font-rubik'>
          {/* Для верхнего левого угла берем последний элемент из меню или жесткую ссылку (тут берем последнюю) */}
          {sortedMenu.length > 0 && (
            <Link
              href={getRelativeUrl(sortedMenu[sortedMenu.length - 1].link)}
              className='hover:underline'
            >
              {sortedMenu[sortedMenu.length - 1].title}
            </Link>
          )}
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
            {/* 🔥 Динамическое десктопное меню */}
            {sortedMenu.map((item) => (
              <Link
                key={item.id}
                href={getRelativeUrl(item.link)}
                className={navLinkClass}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <div className='flex items-center gap-4'>
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

        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          onRestrictedClick={handleRestrictedClick}
          menuItems={sortedMenu} // 🔥 Передаем динамическое меню
        />
      </header>

      <AppRedirectModal
        isOpen={isRedirectModalOpen}
        onClose={() => setIsRedirectModalOpen(false)}
      />
    </>
  );
};
