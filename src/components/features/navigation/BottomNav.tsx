'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Star, Ticket, User, ScanLine } from 'lucide-react';
import { clsx } from 'clsx';
import { useState, useEffect } from 'react'; // 🔥 Добавили хуки
import { useAuthStore } from '@/store/auth';

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuth } = useAuthStore();

  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const checkIsIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    const timer = setTimeout(() => {
      if (checkIsIOS) {
        setIsIOS(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const navItems = [
    {
      label: 'Лотереи',
      href: '/',
      icon: Star,
      protected: false,
    },
    {
      label: 'Билеты',
      href: '/tickets',
      icon: Ticket,
      protected: true,
    },
    {
      label: 'Профиль',
      href: '/profile',
      icon: User,
      protected: true,
    },
  ];

  const handleProtectedClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    isProtected: boolean,
  ) => {
    if (isProtected && !isAuth) {
      e.preventDefault();
      router.push('/login');
    }
  };

  return (
    <div className='fixed bottom-6 left-4 right-4 z-100 flex lg:hidden items-center justify-between gap-3 max-w-md mx-auto pointer-events-none'>
      {/* ЛЕВАЯ ЧАСТЬ: Основное меню (Капсула) */}
      <nav
        className={clsx(
          'flex-1 pointer-events-auto border border-gray-100 rounded-full shadow-2xl shadow-gray-200/50 p-1 flex justify-between items-center',
          isIOS ? 'backdrop-blur-sm bg-white/50' : 'glass bg-white/70',
        )}
      >
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => handleProtectedClick(e, item.protected)}
              className={clsx(
                'flex flex-col items-center px-3 py-1.5 rounded-full transition-all duration-200',
                isActive
                  ? ' text-gray-900 bg-gray-600/10 backdrop-blur-lg'
                  : 'bg-transparent text-gray-600',
              )}
            >
              <item.icon
                size={20}
                fill={isActive ? 'currentColor' : 'none'}
                className='shrink-0'
              />
              <span className='text-xs font-semibold'>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <Link
        href='/scan'
        onClick={(e) => handleProtectedClick(e, true)}
        className={clsx(
          'pointer-events-auto w-14 h-14 border border-gray-100 rounded-full shadow-2xl shadow-gray-200/50 flex items-center justify-center active:scale-95 transition-all text-gray-500 hover:text-gray-900 bg-white/70',
          isIOS ? 'backdrop-blur-xl' : 'glass', // 🔥 Динамический класс
        )}
      >
        <ScanLine size={24} />
      </Link>
    </div>
  );
}
