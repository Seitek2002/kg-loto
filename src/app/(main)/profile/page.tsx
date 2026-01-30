'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Bell, Bookmark, Info, Shield, LogOut } from 'lucide-react';
import { ProfileMenuItem } from '@/components/features/profile/ProfileMenuItem';
import { useUserStore } from '@/store/user'; // <--- Импорт стора

export default function ProfilePage() {
  // Получаем данные пользователя
  const user = useUserStore((state) => state.user);

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
        {/* --- КАРТОЧКА ПОЛЬЗОВАТЕЛЯ (ТЕПЕРЬ ДИНАМИЧЕСКАЯ) --- */}
        <Link href='/profile/edit'>
          <div className='bg-white p-4 rounded-3xl flex items-center justify-between shadow-sm active:scale-[0.99] transition-transform'>
            <div className='flex items-center gap-4'>
              {/* Аватар из стора */}
              <div className='relative w-14 h-14 rounded-full overflow-hidden bg-gray-200'>
                <Image
                  src={user.avatar}
                  alt={user.name}
                  fill
                  className='object-cover'
                />
              </div>

              {/* Инфо из стора */}
              <div>
                <h3 className='text-sm font-black font-benzin text-[#2D2D2D] mb-1'>
                  {user.name}
                </h3>
                <p className='text-xs text-gray-400 font-rubik'>{user.email}</p>
              </div>
            </div>

            <div className='text-gray-300'>
              <span className='text-xl'>›</span>
            </div>
          </div>
        </Link>

        {/* --- МЕНЮ --- */}
        <div className='flex flex-col rounded-3xl shadow-sm overflow-hidden'>
          <ProfileMenuItem
            icon={Bookmark}
            label='Мои призы'
            href='/profile/prizes' // <--- Сюда мы пойдем дальше
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
