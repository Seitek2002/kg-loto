'use client';

import Link from 'next/link';
import Image from 'next/image';
import { clsx } from 'clsx';
import { useState, useRef, useEffect } from 'react';
import { AuthModal } from '@/components/features/modal/AuthModal';
import { useAuthStore } from '@/store/auth';
import {
  User,
  LogOut,
  Ticket,
  Settings,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

interface HeaderProps {
  theme?: 'light' | 'dark';
}

type ProfileView = 'menu' | 'personal' | 'tickets';

export const Header = ({ theme = 'light' }: HeaderProps) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Стейты для выпадашки профиля
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [profileView, setProfileView] = useState<ProfileView>('menu');

  const { isAuth, user, logout } = useAuthStore();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const isDark = theme === 'dark';

  const navLinkClass = clsx(
    'text-xs font-medium uppercase transition-colors',
    isDark
      ? 'text-[#2D2D2D]/70 hover:text-[#2D2D2D]'
      : 'text-white/80 hover:text-white',
  );

  const langBtnClass = clsx(
    'text-xs font-medium uppercase flex items-center gap-1',
    isDark ? 'text-[#2D2D2D]' : 'text-white',
  );

  const regBtnClass = clsx(
    'px-6 py-2.5 rounded-full text-[10px] font-black font-benzin uppercase transition-colors',
    isDark
      ? 'bg-[#2D2D2D] text-white hover:bg-black'
      : 'bg-white text-[#2D2D2D] hover:bg-gray-100',
  );

  // Закрытие меню при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
        // Возвращаем на главный экран меню через небольшую задержку (чтобы не было резкого скачка при закрытии)
        setTimeout(() => setProfileView('menu'), 200);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className='hidden font-rubik lg:flex w-full items-center justify-between px-8 absolute top-0 left-0 z-50 bg-transparent'>
      <Link href='/' className='relative w-[232px] h-[100px]'>
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
              className='bg-[#FFD600] text-[#2D2D2D] px-6 py-2.5 rounded-full text-[10px] font-black font-benzin uppercase hover:bg-[#FFC000] transition-colors'
            >
              Войти
            </button>
          </>
        ) : (
          <div className='flex items-center gap-3 animate-in fade-in'>
            {/* Имя и Баланс (слева от аватарки) */}
            <div className='hidden sm:flex flex-col text-right'>
              <span className='text-sm py-3 px-6 font-medium bg-[#FCC400] rounded-full cursor-pointer'>ПРОВЕРИТЬ</span>
            </div>

            {/* 🔥 КОНТЕЙНЕР АВАТАРКИ И УМНОЙ ВЫПАДАШКИ */}
            <div className='relative' ref={dropdownRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className='w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#2D2D2D] hover:bg-[#FFD600] transition-colors border-2 border-transparent hover:border-white/20 active:scale-95'
              >
                <User size={20} />
              </button>

              {/* УМНОЕ ОКНО ПРОФИЛЯ */}
              {isProfileMenuOpen && (
                <div className='absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 p-5 flex flex-col z-50 text-[#2D2D2D] overflow-hidden transition-all'>
                  {/* --- ЭКРАН 1: ГЛАВНОЕ МЕНЮ --- */}
                  {profileView === 'menu' && (
                    <div className='flex flex-col animate-in fade-in slide-in-from-left-2'>
                      {/* Шапка меню (Игрок) */}
                      <div className='flex items-center gap-4 mb-4'>
                        <div className='w-12 h-12 rounded-full bg-[#F5F5F5] flex items-center justify-center shrink-0'>
                          <User size={24} className='text-gray-400' />
                        </div>
                        <div className='flex flex-col overflow-hidden'>
                          <span className='text-sm font-black font-benzin uppercase truncate'>
                            {user?.fullName || 'Игрок'}
                          </span>
                          <span className='text-xs font-bold font-rubik text-[#FFD600]'>
                            {user?.balance ? `${user.balance} сом` : '0 сом'}
                          </span>
                        </div>
                      </div>

                      <div className='h-px bg-gray-100 my-2' />

                      {/* Внутренние переключатели */}
                      <button
                        onClick={() => setProfileView('personal')}
                        className='flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded-xl transition-colors'
                      >
                        <div className='flex items-center gap-3 text-xs font-bold font-rubik'>
                          <Settings size={18} className='text-gray-400' />
                          Личные данные
                        </div>
                        <ChevronRight size={16} className='text-gray-400' />
                      </button>

                      <button
                        onClick={() => setProfileView('tickets')}
                        className='flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded-xl transition-colors'
                      >
                        <div className='flex items-center gap-3 text-xs font-bold font-rubik'>
                          <Ticket size={18} className='text-gray-400' />
                          Мои билеты
                        </div>
                        <ChevronRight size={16} className='text-gray-400' />
                      </button>

                      <div className='h-px bg-gray-100 my-2' />

                      <button
                        onClick={() => {
                          logout();
                          setIsProfileMenuOpen(false);
                        }}
                        className='flex items-center gap-3 py-3 px-2 hover:bg-red-50 rounded-xl transition-colors text-xs font-bold font-rubik text-red-500 text-left'
                      >
                        <LogOut size={18} />
                        Выйти
                      </button>
                    </div>
                  )}

                  {/* --- ЭКРАН 2: ЛИЧНЫЕ ДАННЫЕ --- */}
                  {profileView === 'personal' && (
                    <div className='flex flex-col animate-in fade-in slide-in-from-right-2'>
                      <button
                        onClick={() => setProfileView('menu')}
                        className='flex items-center gap-2 text-xs font-bold font-rubik text-gray-400 hover:text-[#2D2D2D] mb-4 transition-colors w-fit'
                      >
                        <ChevronLeft size={16} /> Назад
                      </button>
                      <h3 className='text-sm font-black font-benzin uppercase mb-4'>
                        Личные данные
                      </h3>

                      <div className='space-y-3 text-xs font-rubik'>
                        <div className='bg-[#F5F5F5] p-3 rounded-xl flex flex-col'>
                          <span className='text-[10px] text-gray-400 mb-1'>
                            ФИО
                          </span>
                          <span className='font-bold'>
                            {user?.fullName || 'Не указано'}
                          </span>
                        </div>
                        <div className='bg-[#F5F5F5] p-3 rounded-xl flex flex-col'>
                          <span className='text-[10px] text-gray-400 mb-1'>
                            Номер телефона
                          </span>
                          <span className='font-bold'>
                            {user?.phoneNumber || 'Не указан'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- ЭКРАН 3: МОИ БИЛЕТЫ --- */}
                  {profileView === 'tickets' && (
                    <div className='flex flex-col animate-in fade-in slide-in-from-right-2'>
                      <button
                        onClick={() => setProfileView('menu')}
                        className='flex items-center gap-2 text-xs font-bold font-rubik text-gray-400 hover:text-[#2D2D2D] mb-4 transition-colors w-fit'
                      >
                        <ChevronLeft size={16} /> Назад
                      </button>
                      <h3 className='text-sm font-black font-benzin uppercase mb-4'>
                        Мои билеты
                      </h3>

                      <div className='flex flex-col items-center justify-center py-8 text-center'>
                        <Ticket size={32} className='text-gray-300 mb-2' />
                        <span className='text-xs font-medium font-rubik text-gray-400'>
                          У вас пока нет активных билетов
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <AuthModal
          key={authMode}
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          initialStep={authMode}
        />
      </div>
    </header>
  );
};
