'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { Ticket, Trophy, Headphones, Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/store/auth'; // 🔥 Подключаем наш стор

// 🔥 Обновленная функция: принимает имя и фамилию отдельно
const getInitials = (firstName?: string, lastName?: string) => {
  if (!firstName && !lastName) return 'U'; // U - User (по умолчанию)
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
};

export const ProfileHeader = () => {
  const pathname = usePathname();
  const t = useTranslations('profile_header');

  // 🔥 Достаем пользователя из глобального стора
  const user = useAuthStore((state) => state.user);

  const TABS = [
    { name: t('tabs.my_tickets'), href: '/profile', icon: Ticket },
    { name: t('tabs.my_prizes'), href: '/profile/prizes', icon: Trophy },
    { name: t('tabs.support'), href: '/profile/support', icon: Headphones },
    { name: t('tabs.settings'), href: '/profile/settings', icon: Settings },
  ];

  // 🔥 Формируем данные для отображения (с защитой на случай, если данные еще грузятся)
  const fullName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Пользователь'
    : 'Загрузка...';

  // Если email нет, можем показать номер телефона как запасной вариант
  const displayContact =
    user?.email ||
    (user?.phone ? `${user.phone.dialCode} ${user.phone.number}` : '');
  const avatarUrl = user?.avatar || null;
  const initials = getInitials(user?.firstName, user?.lastName);

  return (
    <div className='flex flex-col items-center max-w-[1045px] mb-4 mx-auto'>
      {/* Хлебные крошки */}
      <div className='w-full flex justify-start mb-6 text-base text-[#4B4B4B]'>
        <Link href='/' className='hover:opacity-80'>
          {t('breadcrumbs.home')}
        </Link>
        <span className='mx-2 md:mx-6'>/</span>
        <span className='text-[#4B4B4B] font-semibold'>
          {t('breadcrumbs.profile')}
        </span>
      </div>

      {/* Аватар и инфо */}
      <div className='flex flex-col items-center mb-10'>
        <div className='relative flex items-center justify-center w-15 h-15 sm:w-30 sm:h-30 rounded-full overflow-hidden mb-6 border border-gray-200 bg-[#FFD600] text-[#4B4B4B] text-2xl sm:text-3xl font-benzin tracking-wider shadow-sm'>
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={fullName}
              fill
              sizes='120px'
              className='object-cover'
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        <h1 className='text-xl sm:text-[28px] font-semibold text-[#4B4B4B] mb-3 leading-5'>
          {fullName}
        </h1>
        <p className='text-xs sm:text-base text-[#A3A3A3] font-medium'>
          {displayContact}
        </p>
      </div>

      {/* Главные вкладки навигации */}
      <div className='w-full overflow-x-auto scrollbar-hide'>
        <div className='flex justify-start sm:justify-between items-center'>
          {TABS.map((tab) => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon;

            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={clsx(
                  'flex items-center gap-2 px-6 py-3 rounded-full font-benzin uppercase transition-all whitespace-nowrap active:scale-95',
                  isActive
                    ? 'bg-[#4B4B4B] text-white shadow-md'
                    : 'bg-transparent text-[#4B4B4B] hover:bg-gray-200 hover:text-[#4B4B4B]',
                )}
              >
                <Icon
                  size={24}
                  className={clsx(isActive ? 'text-white' : 'text-[#4B4B4B]')}
                />
                <span className='font-extralight text-[10px] sm:text-base'>
                  {tab.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
