'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Bell, Bookmark, Info, Shield, LogOut, User } from 'lucide-react'; // Добавили User
import { ProfileMenuItem } from '@/components/features/profile/ProfileMenuItem';
import { useUserStore } from '@/store/user';

export default function ProfilePage() {
  const { user, fetchUser, isLoading } = useUserStore();

  // Запрашиваем данные пользователя при монтировании компонента, если их еще нет
  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [user, fetchUser]);

  // Можно показывать лоадер, пока данные не загрузились
  if (isLoading || !user) {
    return (
      <div className='min-h-screen bg-[#F9F9F9] flex items-center justify-center font-rubik text-sm text-gray-400'>
        Загрузка профиля...
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#F9F9F9] pb-32'>
      {/* --- ХЕДЕР --- */}
      <div className='flex items-center justify-between px-4 py-6'>
        <h1 className='text-xl font-black font-benzin uppercase text-[#2D2D2D]'>
          ПРОФИЛЬ
        </h1>
        <button className='w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-800 active:scale-95 transition-transform'>
          <Bell size={20} />
        </button>
      </div>

      <div className='px-4 flex flex-col gap-6'>
        {/* --- КАРТОЧКА ПОЛЬЗОВАТЕЛЯ --- */}
        <Link href='/profile/edit'>
          <div className='bg-white p-4 rounded-3xl flex items-center justify-between shadow-sm active:scale-[0.99] transition-transform'>
            <div className='flex items-center gap-4'>
              {/* 🔥 ЗАГЛУШКА АВАТАРКИ ИЗ LUCIDE-REACT */}
              <div className='w-14 h-14 rounded-full bg-[#F5F5F5] flex items-center justify-center text-gray-400 shrink-0 border border-gray-100'>
                <User size={28} strokeWidth={1.5} />
              </div>

              {/* Инфо из сервера */}
              <div className='flex flex-col overflow-hidden'>
                <h3 className='text-sm font-black font-benzin text-[#2D2D2D] mb-1'>
                  {user.fullName}
                </h3>
                <p className='text-xs text-gray-400 font-rubik'>
                  {user.phoneNumber}
                </p>
              </div>
            </div>

            <div className='text-gray-300 ml-2'>
              <span className='text-xl'>›</span>
            </div>
          </div>
        </Link>

        {/* --- МЕНЮ --- */}
        <div className='flex flex-col rounded-3xl shadow-sm overflow-hidden'>
          <ProfileMenuItem
            icon={Bookmark}
            label='Мои призы'
            href='/profile/prizes'
          />
          <ProfileMenuItem icon={Info} label='Помощь' href='/help' />
          <ProfileMenuItem
            icon={Shield}
            label='Политика конфиденциальности'
            href='/privacy'
          />
        </div>

        {/* --- КНОПКА ВЫЙТИ --- */}
        <div className='rounded-3xl shadow-sm overflow-hidden'>
          <ProfileMenuItem
            icon={LogOut}
            label='Выйти'
            href='/logout'
            isDestructive
          />
        </div>
      </div>
    </div>
  );
}
