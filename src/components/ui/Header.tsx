'use client';

import Link from 'next/link';
import Image from 'next/image';
import { clsx } from 'clsx';
import { useState, useEffect } from 'react';
// 🔥 Добавили иконки корзины и кошелька
import { Menu, X, ShoppingCart, Wallet } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuItem } from '@/types/api';
import { useAuthStore } from '@/store/auth';
import { AuthModal } from '../features/modal/AuthModal';

import { useCartStore } from '@/store/cart';

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
            {/* 🔥 Если авторизован - показываем баланс в мобильном меню */}
            {user && (
              <div className='flex items-center justify-between bg-[#F9F9F9] border border-gray-100 p-4 rounded-2xl mb-2'>
                <div className='flex items-center gap-2 text-[#4B4B4B]'>
                  <Wallet size={20} strokeWidth={2} />
                  <span className='font-bold text-[13px] uppercase'>
                    Баланс
                  </span>
                </div>
                <div className='text-[18px] font-black text-[#F58220]'>
                  150 <span className='underline'>с</span>
                </div>
              </div>
            )}

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
                  document
                    .getElementById('check')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                className='py-4 text-left text-[13px] font-bold text-[#2D2D2D] uppercase border-b border-gray-100 hover:text-[#F5A623] transition-colors'
              >
                {t('check_ticket')}
              </button>

              {/* 🔥 Добавили "Мои билеты" в мобильное меню для удобства */}
              {user && (
                <Link
                  href='/cart'
                  onClick={onClose}
                  className='py-4 flex items-center justify-between text-[13px] font-bold text-[#2D2D2D] uppercase border-b border-gray-100 hover:text-[#F5A623] transition-colors'
                >
                  Мои билеты
                  <ShoppingCart size={18} strokeWidth={2} />
                </Link>
              )}

              <a
                href='tel:996312440107'
                onClick={onClose}
                className='py-4 text-[13px] font-bold text-[#2D2D2D] uppercase border-b border-gray-100 hover:text-[#F5A623] transition-colors'
              >
                {t('hotline')}: 996 312 44 01 07
              </a>
            </div>

            <div className='flex gap-3 mt-4 pt-2'>
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

  const user = useAuthStore((state) => state.user);
  const cartCount = useCartStore((state) => state.items.length);

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

  const userInitial = user?.firstName
    ? user.firstName.charAt(0).toUpperCase()
    : user?.fullName
      ? user.fullName.charAt(0).toUpperCase()
      : 'U';

  // Проверяем аватар и в корне объекта, и во вложенном профиле (на случай разных ответов API)
  const userAvatar = user?.avatar || user?.kglotteryProfile?.avatar;

  console.log(user);

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

          <div className='flex items-center gap-5'>
            <LanguageSwitcher isDark={false} />

            {/* 🔥 Обновленный дизайн десктопа для авторизованного юзера */}
            {user ? (
              <div className='flex items-center gap-6'>
                {/* Мои билеты */}
                <Link
                  href='/cart'
                  className='flex items-center gap-2 text-[#4B4B4B] hover:text-[#FFD600] transition-colors cursor-pointer'
                >
                  <span className='text-[15px] font-medium'>Мои билеты</span>
                  <div className='relative'>
                    <ShoppingCart size={24} strokeWidth={2} />
                    {/* 🔥 Бейджик счетчика */}
                    {cartCount > 0 && (
                      <span className='absolute -top-2 -right-2 bg-[#F58220] text-white text-[10px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full shadow-sm'>
                        {cartCount}
                      </span>
                    )}
                  </div>
                </Link>

                {/* Баланс */}
                <div className='flex items-center gap-2 cursor-pointer group'>
                  <Wallet
                    size={24}
                    strokeWidth={2}
                    className='text-[#4B4B4B] group-hover:text-[#F58220] transition-colors'
                  />
                  <div className='text-[22px] font-black text-[#F58220] flex items-end gap-1'>
                    150 <span className='text-[16px] underline mb-0.5'>с</span>
                  </div>
                </div>

                {/* Аватар */}
                <Link
                  href='/profile'
                  className='w-11 h-11 rounded-full overflow-hidden bg-[#CBA3D3] flex items-center justify-center shrink-0 cursor-pointer hover:opacity-80 transition-opacity relative shadow-sm'
                >
                  {userAvatar && !avatarError ? (
                    <Image
                      src={userAvatar}
                      alt='Аватар'
                      fill
                      sizes='44px'
                      className='object-cover'
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <span className='text-[#331C39] font-medium text-lg'>
                      {userInitial}
                    </span>
                  )}
                </Link>
              </div>
            ) : (
              <div className='flex items-center gap-4 pl-2'>
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
              </div>
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

            {/* 🔥 В мобилке добавляем иконку корзины прямо в шапку для быстрого доступа */}
            {user && (
              <Link
                href='/cart'
                className={clsx(
                  'relative transition-colors',
                  isMobileMenuOpen || !isDark ? 'text-[#4B4B4B]' : 'text-white',
                )}
              >
                <ShoppingCart size={24} strokeWidth={2} />
                {/* 🔥 Бейджик счетчика */}
                {cartCount > 0 && (
                  <span className='absolute -top-1.5 -right-1.5 bg-[#F58220] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm border border-white'>
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

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
