'use client';

import Link from 'next/link';
import Image from 'next/image';
import { clsx } from 'clsx';
import { useState, useRef, useEffect } from 'react';
import { AuthModal } from '@/components/features/modal/AuthModal';
import { CheckTicketModal } from '@/components/features/modal/CheckTicketModal';
import { useAuthStore } from '@/store/auth';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  LogOut,
  Ticket,
  Settings,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

interface HeaderProps {
  theme?: 'light' | 'dark';
}

type ProfileView = 'menu' | 'personal' | 'tickets';

export const Header = ({ theme = 'light' }: HeaderProps) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckOpen, setIsCheckOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [profileView, setProfileView] = useState<ProfileView>('menu');

  // 🔥 Стейты для мобильного меню
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const { isAuth, user, logout } = useAuthStore();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
    setIsMobileMenuOpen(false); // Закрываем моб. меню при открытии авторизации
  };

  const isDark = theme === 'dark';

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
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
        setTimeout(() => setProfileView('menu'), 200);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Блокируем скролл при открытом мобильном меню
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMobileMenuOpen]);

  const toggleAccordion = (name: string) => {
    setOpenAccordion(openAccordion === name ? null : name);
  };

  return (
    <>
      <header className='relative z-50'>
        {/* ========================================================= */}
        {/* DESKTOP HEADER (Скрыт на мобилках) */}
        {/* ========================================================= */}
        <div className='hidden lg:flex bg-[#0B1F3B] justify-between text-white py-3 px-8 text-xs font-rubik'>
          <Link href='/about' className='hover:underline'>
            О компании
          </Link>
          <a href='tel:996312440107' className='flex hover:underline'>
            Горячая линия 996 312 44 01 07
          </a>
          <button
            onClick={() => setIsCheckOpen(true)}
            className='cursor-pointer hover:underline'
          >
            Проверить билет
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
            <Link href='/' className={navLinkClass}>
              Главная
            </Link>
            <Link href='/#instant' className={navLinkClass}>
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
            <button className='text-xs font-black uppercase flex items-center gap-1 text-[#2D2D2D]'>
              RU <ChevronDown size={14} />
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
                  className='bg-[#FFD600] cursor-pointer text-[#2D2D2D] px-6 py-2.5 rounded-full text-[10px] font-black uppercase hover:bg-[#FFC000] transition-colors'
                >
                  Войти
                </button>
              </>
            ) : (
              <div className='flex items-center gap-3 animate-in fade-in'>
                <button
                  onClick={() => setIsCheckOpen(true)}
                  className='text-xs py-3 px-6 font-bold uppercase text-[#2D2D2D] bg-[#FFD600] hover:bg-[#FFC000] rounded-full cursor-pointer transition-colors active:scale-95 shadow-sm'
                >
                  ПРОВЕРИТЬ
                </button>

                <div className='relative' ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className='w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#2D2D2D] hover:bg-[#FFD600] transition-colors active:scale-95'
                  >
                    <User size={20} />
                  </button>

                  {/* Выпадашка профиля ПК */}
                  {isProfileMenuOpen && (
                    <div className='absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 p-5 flex flex-col z-50 text-[#2D2D2D]'>
                      {profileView === 'menu' && (
                        <div className='flex flex-col animate-in fade-in slide-in-from-left-2'>
                          <div className='flex items-center gap-4 mb-4'>
                            <div className='w-12 h-12 rounded-full bg-[#F5F5F5] flex items-center justify-center shrink-0'>
                              <User size={24} className='text-gray-400' />
                            </div>
                            <div className='flex flex-col overflow-hidden'>
                              <span className='text-sm font-black font-benzin uppercase truncate'>
                                {user?.fullName || 'Игрок'}
                              </span>
                            </div>
                          </div>
                          <div className='h-px bg-gray-100 my-2' />
                          <button
                            onClick={() => setProfileView('personal')}
                            className='flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded-xl transition-colors'
                          >
                            <div className='flex items-center gap-3 text-xs font-bold font-rubik'>
                              <Settings size={18} className='text-gray-400' />{' '}
                              Личные данные
                            </div>
                            <ChevronRight size={16} className='text-gray-400' />
                          </button>
                          <button
                            onClick={() => setProfileView('tickets')}
                            className='flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded-xl transition-colors'
                          >
                            <div className='flex items-center gap-3 text-xs font-bold font-rubik'>
                              <Ticket size={18} className='text-gray-400' /> Мои
                              билеты
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
                            <LogOut size={18} /> Выйти
                          </button>
                        </div>
                      )}
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
          </div>
        </div>

        {/* ========================================================= */}
        {/* MOBILE HEADER (Скрыт на ПК) */}
        {/* ========================================================= */}
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
            <button
              className={clsx(
                'text-xs font-black uppercase flex items-center gap-1',
                isMobileMenuOpen || !isDark ? 'text-[#2D2D2D]' : 'text-white',
              )}
            >
              РУ <ChevronDown size={14} />
            </button>
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

        {/* ========================================================= */}
        {/* MOBILE MENU OVERLAY */}
        {/* ========================================================= */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className='fixed inset-x-0 top-[64px] bottom-0 z-[100] bg-black/40 backdrop-blur-sm flex flex-col pb-24 overflow-y-auto'
            >
              {/* Белая карточка меню (как на скриншоте) */}
              <div className='m-4 bg-white rounded-[24px] p-5 shadow-2xl flex flex-col gap-4 font-rubik'>
                {/* Если юзер авторизован - показываем профиль */}
                {isAuth && user ? (
                  <Link
                    href={'/profile'}
                    className='bg-[#F5F5F5] rounded-2xl p-4 flex items-center justify-between cursor-pointer'
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 bg-gray-300 rounded-full overflow-hidden shrink-0'>
                        {user.kglotteryProfile?.avatar ? (
                          <img
                            src={user.kglotteryProfile.avatar}
                            alt='avatar'
                            className='w-full h-full object-cover'
                          />
                        ) : (
                          <div className='w-full h-full flex items-center justify-center bg-gray-200 text-gray-500'>
                            <User size={20} />
                          </div>
                        )}
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-sm font-bold text-[#2D2D2D] leading-tight'>
                          {user.fullName || 'Игрок'}
                        </span>
                        <span className='text-[10px] font-medium text-gray-500'>
                          {user.kglotteryProfile?.email || user.phoneNumber}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={20} className='text-gray-400' />
                  </Link>
                ) : null}

                {/* Навигация */}
                <div className='flex flex-col'>
                  {/* Аккордеон: Моментальные */}
                  <div className='flex flex-col border-b border-gray-100 last:border-0'>
                    <button
                      onClick={() => toggleAccordion('instant')}
                      className='flex items-center justify-between py-4 text-[13px] font-bold text-[#2D2D2D] uppercase'
                    >
                      Моментальные билеты
                      <ChevronDown
                        size={18}
                        className={clsx(
                          'transition-transform text-gray-400',
                          openAccordion === 'instant' && 'rotate-180',
                        )}
                      />
                    </button>
                    <AnimatePresence>
                      {openAccordion === 'instant' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className='flex flex-col gap-3 pb-3 pl-4 overflow-hidden'
                        >
                          <Link
                            href='/#instant'
                            onClick={() => setIsMobileMenuOpen(false)}
                            className='text-sm text-gray-600 font-medium'
                          >
                            Мен миллионер
                          </Link>
                          <Link
                            href='/#instant'
                            onClick={() => setIsMobileMenuOpen(false)}
                            className='text-sm text-gray-600 font-medium'
                          >
                            Оной
                          </Link>
                          <Link
                            href='/#instant'
                            onClick={() => setIsMobileMenuOpen(false)}
                            className='text-sm text-gray-600 font-medium'
                          >
                            Уйго белек
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Обычные ссылки */}
                  <Link
                    href='/#check'
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsCheckOpen(true);
                    }}
                    className='py-4 text-[13px] font-bold text-[#2D2D2D] uppercase border-b border-gray-100'
                  >
                    Проверить билет
                  </Link>
                  <Link
                    href='/winners'
                    onClick={() => setIsMobileMenuOpen(false)}
                    className='py-4 text-[13px] font-bold text-[#2D2D2D] uppercase border-b border-gray-100'
                  >
                    Победители
                  </Link>
                  <Link
                    href='/draws'
                    onClick={() => setIsMobileMenuOpen(false)}
                    className='py-4 text-[13px] font-bold text-[#2D2D2D] uppercase border-b border-gray-100'
                  >
                    Тиражные билеты
                  </Link>
                  <Link
                    href='/about'
                    onClick={() => setIsMobileMenuOpen(false)}
                    className='py-4 text-[13px] font-bold text-[#2D2D2D] uppercase border-b border-gray-100'
                  >
                    О компании
                  </Link>

                  {/* Аккордеон: Контакты */}
                  <div className='flex flex-col border-b border-gray-100'>
                    <button
                      onClick={() => toggleAccordion('contacts')}
                      className='flex items-center justify-between py-4 text-[13px] font-bold text-[#2D2D2D] uppercase'
                    >
                      Контакты
                      <ChevronDown
                        size={18}
                        className={clsx(
                          'transition-transform text-gray-400',
                          openAccordion === 'contacts' && 'rotate-180',
                        )}
                      />
                    </button>
                    <AnimatePresence>
                      {openAccordion === 'contacts' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className='flex flex-col gap-3 pb-3 pl-4 overflow-hidden'
                        >
                          <a
                            href='tel:996312440107'
                            className='text-sm text-gray-600 font-medium'
                          >
                            996 312 44 01 07
                          </a>
                          <a
                            href='mailto:support@kgloto.kg'
                            className='text-sm text-gray-600 font-medium'
                          >
                            support@kgloto.kg
                          </a>
                          <Link
                            href='/map'
                            onClick={() => setIsMobileMenuOpen(false)}
                            className='text-sm text-gray-600 font-medium'
                          >
                            Карта продаж
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Link
                    href='/gift'
                    onClick={() => setIsMobileMenuOpen(false)}
                    className='py-4 text-[13px] font-bold text-[#2D2D2D] uppercase border-b border-gray-100'
                  >
                    Подарить билет
                  </Link>
                  <Link
                    href='/news'
                    onClick={() => setIsMobileMenuOpen(false)}
                    className='py-4 text-[13px] font-bold text-[#2D2D2D] uppercase border-b border-gray-100'
                  >
                    Новости
                  </Link>
                  <Link
                    href='/faq'
                    onClick={() => setIsMobileMenuOpen(false)}
                    className='py-4 text-[13px] font-bold text-[#2D2D2D] uppercase'
                  >
                    Вопросы и ответы
                  </Link>
                </div>

                {/* Если юзер НЕ авторизован - показываем кнопки */}
                {!isAuth && (
                  <div className='flex gap-3 mt-4 pt-2'>
                    <button
                      onClick={() => openAuth('register')}
                      className='flex-1 bg-[#4A4A4A] text-white py-4 rounded-full font-black text-[10px] uppercase tracking-wider active:scale-95 transition-transform'
                    >
                      Регистрация
                    </button>
                    <button
                      onClick={() => openAuth('login')}
                      className='flex-1 bg-[#FFD600] text-[#2D2D2D] py-4 rounded-full font-black text-[10px] uppercase tracking-wider active:scale-95 transition-transform shadow-[0_4px_14px_rgba(255,214,0,0.4)]'
                    >
                      Войти
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Модалки оставляем вне хидера, чтобы они рендерились поверх всего */}
      <AuthModal
        key={authMode}
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialStep={authMode}
      />

      <CheckTicketModal
        isOpen={isCheckOpen}
        onClose={() => setIsCheckOpen(false)}
      />
    </>
  );
};
