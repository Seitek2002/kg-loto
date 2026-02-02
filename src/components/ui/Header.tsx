'use client';

import Link from 'next/link';
import Image from 'next/image';

export const Header = () => {
  return (
    <header className='hidden lg:flex w-full h-20 items-center justify-between px-8 absolute top-0 left-0 z-50 bg-transparent'>
      <Link href='/' className='relative w-32 h-10'>
        <Image src='/logo.png' alt='KGLOTO' fill className='object-contain' />
      </Link>

      <nav className='flex items-center gap-8'>
        <Link
          href='/'
          className='text-xs font-bold text-white/80 hover:text-white uppercase font-benzin transition-colors'
        >
          Главная
        </Link>
        <Link
          href='/instant'
          className='text-xs font-bold text-white/80 hover:text-white uppercase font-benzin transition-colors'
        >
          Моментальные
        </Link>
        <Link
          href='/draws'
          className='text-xs font-bold text-white/80 hover:text-white uppercase font-benzin transition-colors'
        >
          Тиражные
        </Link>
        <Link
          href='/winners'
          className='text-xs font-bold text-white/80 hover:text-white uppercase font-benzin transition-colors'
        >
          Победители
        </Link>
        <Link
          href='/about'
          className='text-xs font-bold text-white/80 hover:text-white uppercase font-benzin transition-colors'
        >
          О компании
        </Link>
      </nav>

      {/* ЯЗЫК И ВХОД (Справа) */}
      <div className='flex items-center gap-4'>
        {/* Переключатель языка (упрощенно) */}
        <button className='text-xs font-bold text-white uppercase font-benzin flex items-center gap-1'>
          RU <span className='text-[10px]'>▼</span>
        </button>

        {/* Кнопки */}
        <Link
          href='/register'
          className='bg-white text-[#2D2D2D] px-6 py-2.5 rounded-full text-[10px] font-black font-benzin uppercase hover:bg-gray-100 transition-colors'
        >
          Регистрация
        </Link>

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
