'use client';

import Link from 'next/link';
import Image from 'next/image';
import { clsx } from 'clsx';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuItem } from '@/types/api';
import { useAuthStore } from '@/store/auth';
import { AuthModal } from '../features/modal/AuthModal';

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
  onAuthClick: (flow: 'login' | 'register') => void;
  menuItems: MenuItem[];
}

export const MobileMenu = ({
  isOpen,
  onClose,
  onAuthClick,
  menuItems,
}: MobileMenuProps) => {
  const t = useTranslations('header');

  // Достаем юзера и функцию выхода
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className='fixed inset-x-0 top-16 bottom-0 z-100 bg-black/40 backdrop-blur-sm flex flex-col pb-24 overflow-y-auto'
        >
          <div className='m-4 bg-white rounded-3xl p-5 shadow-2xl flex flex-col gap-4 font-rubik'>
            <div className='flex flex-col'>
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
                onClick={() => {
                  onClose();
                  // Если хотим чтобы в мобилке "Проверить билет" скроллил вниз
                  document
                    .getElementById('check')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
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
              {/* Если авторизован - показываем ВЫЙТИ и ссылку в ПРОФИЛЬ */}
              {user ? (
                <>
                  <button
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className='flex-1 bg-[#4A4A4A] text-white py-4 rounded-full font-black text-[10px] uppercase tracking-wider active:scale-95 transition-transform'
                  >
                    Выйти
                  </button>
                  <Link
                    href='/profile'
                    onClick={onClose}
                    className='flex-1 bg-[#FFD600] text-[#2D2D2D] py-4 rounded-full font-black text-[10px] uppercase tracking-wider active:scale-95 transition-transform shadow-[0_4px_14px_rgba(255,214,0,0.4)] flex items-center justify-center'
                  >
                    {t('profile')}
                  </Link>
                </>
              ) : (
                /* Если НЕ авторизован - показываем модалки */
                <>
                  <button
                    onClick={() => onAuthClick('register')}
                    className='flex-1 bg-[#4A4A4A] text-white py-4 rounded-full font-black text-[10px] uppercase tracking-wider active:scale-95 transition-transform'
                  >
                    {t('register')}
                  </button>
                  <button
                    onClick={() => onAuthClick('login')}
                    className='flex-1 bg-[#FFD600] text-[#2D2D2D] py-4 rounded-full font-black text-[10px] uppercase tracking-wider active:scale-95 transition-transform shadow-[0_4px_14px_rgba(255,214,0,0.4)]'
                  >
                    {t('profile')}
                  </button>
                </>
              )}
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
  headerMenu?: MenuItem[];
  headerUpperMenu?: MenuItem[];
}

export const Header = ({
  theme = 'light',
  headerMenu = [],
  headerUpperMenu = [],
}: HeaderProps) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authFlow, setAuthFlow] = useState<'login' | 'register'>('login');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const t = useTranslations('header');
  const isDark = theme === 'dark';

  // Достаем юзера из стора
  const user = useAuthStore((state) => state.user);

  const handleAuthClick = (flow: 'login' | 'register' = 'login') => {
    setIsMobileMenuOpen(false);
    setAuthFlow(flow);
    setIsAuthModalOpen(true);
  };

  const navLinkClass = clsx(
    'text-sm font-medium uppercase transition-colors',
    isDark
      ? 'text-[#2D2D2D]/70 hover:text-[#2D2D2D]'
      : 'text-white/80 hover:text-white',
  );

  const regBtnClass = clsx(
    'px-6 py-2.5 rounded-full text-[10px] font-black uppercase transition-colors cursor-pointer flex items-center justify-center',
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

  // 🔥 Извлекаем первую букву имени для аватарки, если фото нет
  const userInitial = user?.fullName
    ? user.fullName.charAt(0).toUpperCase()
    : 'U';
  const userAvatar = user?.kglotteryProfile?.avatar;

  return (
    <>
      <header className='relative z-50'>
        {/* ВЕРХНЯЯ ПОЛОСКА */}
        <div className='hidden lg:flex bg-[#0B1F3B] justify-between text-white py-3 px-8 text-xs font-rubik'>
          {headerUpperMenu.length >= 3 && (
            <>
              <Link
                href={getRelativeUrl(headerUpperMenu[2].link)}
                className='hover:underline'
              >
                {headerUpperMenu[2].title}
              </Link>
              <button
                onClick={() =>
                  user
                    ? document
                        .getElementById('check')
                        ?.scrollIntoView({ behavior: 'smooth' })
                    : handleAuthClick('login')
                }
                className='cursor-pointer hover:underline'
              >
                {headerUpperMenu[0].title}
              </button>
              <Link
                href={getRelativeUrl(headerUpperMenu[1].link)}
                className='cursor-pointer hover:underline'
              >
                {headerUpperMenu[1].title}
              </Link>
            </>
          )}
        </div>

        {/* ОСНОВНОЙ ХЕДЕР */}
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
            {headerMenu.map((item) => (
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

            {/* 🔥 Меняем кнопки десктопа в зависимости от авторизации (По дизайну из Figma) */}
            {user ? (
              <>
                <button
                  onClick={() =>
                    document
                      .getElementById('check')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className='bg-[#4B4B4B] text-white px-7 py-2.5 rounded-full text-[10px] font-black uppercase hover:bg-black transition-colors flex items-center justify-center cursor-pointer'
                >
                  ПРОВЕРИТЬ
                </button>
                <Link
                  href='/profile'
                  className='w-10 h-10 rounded-full overflow-hidden bg-gray-200 border border-gray-300 flex items-center justify-center shrink-0 cursor-pointer hover:opacity-80 transition-opacity relative'
                >
                  {userAvatar && !avatarError ? (
                    <Image
                      src={userAvatar}
                      alt='Аватар'
                      fill
                      sizes='40px'
                      className='object-cover'
                      onError={() => setAvatarError(true)} // 🔥 Если картинка битая, переключаемся на букву
                    />
                  ) : (
                    <span className='text-[#4B4B4B] font-bold text-sm'>
                      {userInitial}
                    </span>
                  )}
                </Link>
              </>
            ) : (
              <>
                <button
                  className={regBtnClass}
                  onClick={() => handleAuthClick('register')}
                >
                  {t('register')}
                </button>
                <button
                  onClick={() => handleAuthClick('login')}
                  className='bg-[#FFD600] cursor-pointer text-[#2D2D2D] px-6 py-2.5 rounded-full text-[10px] font-black uppercase hover:bg-[#FFC000] transition-colors flex items-center justify-center'
                >
                  {t('profile')}
                </button>
              </>
            )}
          </div>
        </div>

        {/* МОБИЛЬНЫЙ ХЕДЕР */}
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
          onAuthClick={handleAuthClick}
          menuItems={headerMenu}
        />
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialFlow={authFlow}
      />
    </>
  );
};
