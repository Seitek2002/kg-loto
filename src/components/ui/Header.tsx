'use client';

import Link from 'next/link';
import Image from 'next/image';
import { clsx } from 'clsx';

interface HeaderProps {
  theme?: 'light' | 'dark';
}

export const Header = ({ theme = 'light' }: HeaderProps) => {
  const isDark = theme === 'dark';

  // Базовые стили для ссылок меню
  const navLinkClass = clsx(
    'text-xs font-bold uppercase font-benzin transition-colors',
    isDark
      ? 'text-[#2D2D2D]/70 hover:text-[#2D2D2D]' // Темный текст (для белого фона)
      : 'text-white/80 hover:text-white', // Белый текст (для темного фона)
  );

  // Стили для переключателя языка
  const langBtnClass = clsx(
    'text-xs font-bold uppercase font-benzin flex items-center gap-1',
    isDark ? 'text-[#2D2D2D]' : 'text-white',
  );

  // Стили для кнопки "Регистрация" (инвертируем цвета)
  const regBtnClass = clsx(
    'px-6 py-2.5 rounded-full text-[10px] font-black font-benzin uppercase transition-colors',
    isDark
      ? 'bg-[#2D2D2D] text-white hover:bg-black' // На светлом фоне кнопка черная
      : 'bg-white text-[#2D2D2D] hover:bg-gray-100', // На темном фоне кнопка белая
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

      {/* ЯЗЫК И ВХОД (Справа) */}
      <div className='flex items-center gap-4'>
        {/* Переключатель языка */}
        <button className={langBtnClass}>
          RU <span className='text-[10px]'>▼</span>
        </button>

        {/* Кнопки */}
        <Link href='/register' className={regBtnClass}>
          Регистрация
        </Link>

        {/* Кнопка "Войти" остается желтой в обоих вариантах */}
        <Link
          href='/login'
          className='bg-[#FFD600] text-[#2D2D2D] px-6 py-2.5 rounded-full text-[10px] font-black font-benzin uppercase hover:bg-[#FFC000] transition-colors'
        >
          Войти
        </Link>
      </div>
    </header>
  );
};
