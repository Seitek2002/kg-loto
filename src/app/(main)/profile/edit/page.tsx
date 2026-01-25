'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/ui/PageHeader'; // Твой компонент хедера

export default function EditProfilePage() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className='min-h-screen bg-[#F9F9F9] px-4 pt-2 pb-10 relative'>
      <PageHeader title='ПРОФИЛЬ' />

      {/* Аватар по центру */}
      <div className='flex justify-center my-8'>
        <div className='relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg'>
          <Image
            src='https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop'
            alt='User'
            fill
            className='object-cover'
          />
        </div>
      </div>

      {/* ФОРМА */}
      <form className='flex flex-col gap-5'>
        {/* Телефон */}
        <div className='flex flex-col gap-2'>
          <label className='text-xs font-bold text-gray-900 font-benzin uppercase ml-2'>
            Номер телефона
          </label>
          <div className='flex gap-2'>
            {/* Флаг (заглушка) */}
            <div className='w-20 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-lg'>
              🇰🇬
            </div>
            <input
              type='tel'
              defaultValue='+996 500 111 000'
              className='flex-1 h-14 px-5 rounded-2xl bg-white text-sm font-bold text-gray-900 shadow-sm border-none outline-none font-rubik'
            />
          </div>
        </div>

        {/* ФИО */}
        <div className='flex flex-col gap-2'>
          <label className='text-xs font-bold text-gray-900 font-benzin uppercase ml-2'>
            Введите ФИО
          </label>
          <input
            type='text'
            defaultValue='Алексеева Александра Александровна'
            className='w-full h-14 px-5 rounded-2xl bg-white text-sm font-bold text-gray-900 shadow-sm border-none outline-none font-rubik'
          />
        </div>

        {/* ИНН */}
        <div className='flex flex-col gap-2'>
          <label className='text-xs font-bold text-gray-900 font-benzin uppercase ml-2'>
            ИНН
          </label>
          <input
            type='text'
            defaultValue='123456789101'
            className='w-full h-14 px-5 rounded-2xl bg-white text-sm font-bold text-gray-900 shadow-sm border-none outline-none font-rubik'
          />
        </div>

        {/* Кнопка Удалить */}
        <button
          type='button'
          onClick={() => setShowDeleteModal(true)}
          className='mt-8 w-full h-14 bg-white text-red-500 rounded-full font-benzin font-bold text-xs uppercase tracking-wider hover:bg-red-50 active:scale-[0.98] transition-all shadow-sm'
        >
          Удалить аккаунт
        </button>
      </form>

      {/* --- МОДАЛКА УДАЛЕНИЯ --- */}
      {showDeleteModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center px-4'>
          {/* Фон затемнения */}
          <div
            className='absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity'
            onClick={() => setShowDeleteModal(false)}
          />

          {/* Карточка */}
          <div className='relative bg-white w-full max-w-sm rounded-[32px] p-6 text-center animate-in fade-in zoom-in-95 duration-200'>
            <h3 className='text-lg font-black font-benzin uppercase text-[#2D2D2D] mb-2'>
              Удаление аккаунта!
            </h3>
            <p className='text-xs text-gray-500 font-rubik mb-6 leading-relaxed'>
              Попробуйте в следующий раз — у вас всё получится!
            </p>

            <div className='flex gap-3'>
              <button
                onClick={() => setShowDeleteModal(false)}
                className='flex-1 h-12 rounded-full border-2 border-gray-100 text-[#2D2D2D] font-benzin font-bold text-[10px] uppercase hover:bg-gray-50'
              >
                Отменить
              </button>
              <button className='flex-1 h-12 rounded-full bg-[#EF4444] text-white font-benzin font-bold text-[10px] uppercase shadow-lg shadow-red-200 hover:bg-red-600'>
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
