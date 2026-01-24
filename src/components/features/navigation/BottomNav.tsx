'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Star, Ticket, User, ScanLine } from 'lucide-react';
import { clsx } from 'clsx'; // Импортируем clsx

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Лотереи',
      href: '/',
      icon: Star,
    },
    {
      label: 'Билеты',
      href: '/tickets',
      icon: Ticket,
    },
    {
      label: 'Профиль',
      href: '/profile',
      icon: User,
    },
  ];

  return (
    <div className='fixed bottom-6 left-4 right-4 z-50 flex items-center justify-between gap-3 max-w-md mx-auto pointer-events-none'>
      {/* ЛЕВАЯ ЧАСТЬ: Основное меню (Капсула) */}
      <nav className='glass flex-1 pointer-events-auto border border-gray-100 rounded-full shadow-2xl shadow-gray-200/50 p-1.5 flex justify-between items-center'>
        {navItems.map((item) => {
          // Логика активности
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex flex-col items-center px-4 py-2.5 rounded-full transition-all duration-200',
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'bg-transparent text-gray-400 hover:text-gray-600',
              )}
            >
              <item.icon
                size={20}
                // Заполняем иконку, если активна (особенно для звезды)
                fill={isActive ? 'currentColor' : 'none'}
                className='shrink-0'
              />
              <span className='text-xs font-semibold'>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ПРАВАЯ ЧАСТЬ: Кнопка Сканера (Круг) */}
      <Link
        href='/scan'
        className='glass pointer-events-auto w-14 h-14 border border-gray-100 rounded-full shadow-2xl shadow-gray-200/50 flex items-center justify-center active:scale-95 transition-all text-gray-500 hover:text-gray-900'
      >
        <ScanLine size={24} />
      </Link>
    </div>
  );
}
