'use client';

import Link from 'next/link';
import Image from 'next/image';
import { clsx } from 'clsx';
import { useState } from 'react';
import { AuthModal } from '@/components/features/modal/AuthModal'; // Проверь путь
import { useAuthStore } from '@/store/auth';
import { LogOut, User } from 'lucide-react';

interface HeaderProps {
  theme?: 'light' | 'dark';
}

export const Header = ({ theme = 'light' }: HeaderProps) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // 🔥 Подключаемся к стору
  const { isAuth, user, logout } = useAuthStore();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const isDark = theme === 'dark';

  const navLinkClass = clsx(
    'text-xs font-bold uppercase font-benzin transition-colors',
    isDark
      ? 'text-[#2D2D2D]/70 hover:text-[#2D2D2D]'
      : 'text-white/80 hover:text-white',
  );

  const langBtnClass = clsx(
    'text-xs font-bold uppercase font-benzin flex items-center gap-1',
    isDark ? 'text-[#2D2D2D]' : 'text-white',
  );

  const regBtnClass = clsx(
    'px-6 py-2.5 rounded-full text-[10px] font-black font-benzin uppercase transition-colors',
    isDark
      ? 'bg-[#2D2D2D] text-white hover:bg-black'
      : 'bg-white text-[#2D2D2D] hover:bg-gray-100',
  );

  return (
    <header className='hidden lg:flex w-full h-20 items-center justify-between px-8 absolute top-0 left-0 z-50 bg-transparent'>
      <Link href='/' className='relative w-32 h-10'>
        <Image src='/logo.png' alt='KGLOTO' fill className='object-contain' />
      </Link>

      <nav className='flex items-center gap-8'>
        <Link href='/' className={navLinkClass}>
          Главная
        </Link>
        <Link href='/instant' className={navLinkClass}>
          Моментальные
        </Link>
        <Link href='/draws' className={navLinkClass}>
          Тиражные
        </Link>
        <Link href='/winners' className={navLinkClass}>
          Победители
        </Link>
        <Link href='/about' className={navLinkClass}>
          О компании
        </Link>
      </nav>

      <div className='flex items-center gap-4'>
        <button className={langBtnClass}>
          RU <span className='text-[10px]'>▼</span>
        </button>

        {/* 🔥 ЛОГИКА АВТОРИЗАЦИИ */}
        {!isAuth ? (
          <>
            <button
              className={regBtnClass}
              onClick={() => openAuth('register')}
            >
              Регистрация
            </button>

            <button
              onClick={() => openAuth('login')}
              // 🔥 ВЕРНУЛ СТИЛИ ЖЕЛТОЙ КНОПКИ
              className='bg-[#FFD600] text-[#2D2D2D] px-6 py-2.5 rounded-full text-[10px] font-black font-benzin uppercase hover:bg-[#FFC000] transition-colors'
            >
              Войти
            </button>
          </>
        ) : (
          <div className='flex items-center gap-3 animate-in fade-in'>
            <div className='hidden sm:flex flex-col text-right'>
              <span
                className={clsx(
                  'text-xs font-bold font-benzin uppercase',
                  isDark ? 'text-[#2D2D2D]' : 'text-white',
                )}
              >
                {user?.fullName || 'Игрок'}
              </span>
              <span className='text-[10px] font-rubik text-[#FFD600] font-bold'>
                {user?.balance ? `${user.balance} сом` : '0 сом'}
              </span>
            </div>

            <Link
              href='/profile'
              className='w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#2D2D2D] hover:bg-[#FFD600] transition-colors border-2 border-transparent hover:border-white/20'
            >
              <User size={20} />
            </Link>

            <button
              onClick={logout}
              className={clsx(
                'p-2 hover:text-[#FFD600] transition-colors',
                isDark ? 'text-[#2D2D2D]' : 'text-white',
              )}
              title='Выйти'
            >
              <LogOut size={20} />
            </button>
          </div>
        )}

        <AuthModal
          key={authMode} // Сбрасывает стейт при переключении режима
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          initialStep={authMode}
        />
      </div>
    </header>
  );
};
