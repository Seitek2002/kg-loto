'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl'; // 🔥 Импортируем хук

// 🔥 DRY: Та самая функция извлечения инициалов
const getInitials = (fullName: string) => {
  if (!fullName) return '';
  const names = fullName.trim().split(/\s+/);
  if (names.length >= 2) {
    return (names[0][0] + names[1][0]).toUpperCase();
  }
  return names[0][0].toUpperCase();
};

// DRY: Мини-компонент для инпутов
const InputField = ({
  label,
  type = 'text',
  defaultValue,
  placeholder,
}: any) => (
  <div className='flex flex-col gap-3'>
    <label className='text-[20px] font-medium text-[#4B4B4B] pl-1'>
      {label}
    </label>
    <input
      type={type}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className='w-full border border-[#A3A3A3] rounded-[10px] p-5 text-[20px] text-[#2D2D2D] outline-none focus:border-[#FF7600] transition-colors placeholder:text-gray-400'
    />
  </div>
);

export const AccountForm = () => {
  // 🔥 Инициализируем переводы для формы аккаунта
  const t = useTranslations('account_form');

  // Моковые данные пользователя
  const user = {
    name: 'Бегалиев Сейтек',
    avatarUrl: null, // Если тут null — покажутся инициалы "БС"
  };

  const initials = getInitials(user.name);

  // Стейты для предпросмотра
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [passportFront, setPassportFront] = useState<string | null>(null);
  const [passportBack, setPassportBack] = useState<string | null>(null);

  // Универсальный обработчик загрузки
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: (url: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  return (
    <div className='flex flex-col gap-8'>
      {/* Аватар */}
      <div className='flex items-center gap-6'>
        <div className='relative flex items-center justify-center w-[70px] h-[70px] rounded-full overflow-hidden border border-gray-200 bg-[#FFD600] text-[#2D2D2D] text-xl font-black font-benzin tracking-wider shadow-sm shrink-0'>
          {avatarPreview || user.avatarUrl ? (
            <Image
              src={avatarPreview || user.avatarUrl!}
              alt={user.name}
              width={70}
              height={70}
              className='object-cover'
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        <div className='flex items-center gap-2 text-[14px] font-medium'>
          <input
            type='file'
            id='avatar-upload'
            accept='image/*'
            className='hidden'
            onChange={(e) => handleImageUpload(e, setAvatarPreview)}
          />
          <label
            htmlFor='avatar-upload'
            className='bg-[#4B4B4B] cursor-pointer text-white rounded-full px-5 py-2.5 active:scale-95 transition-transform inline-block'
          >
            {t('btn_change_photo')} {/* 🔥 Перевод */}
          </label>
          <button
            onClick={() => setAvatarPreview(null)}
            className='bg-white cursor-pointer border border-[#4B4B4B] text-[#4B4B4B] rounded-full px-5 py-2.5 hover:bg-gray-50 active:scale-95 transition-all'
          >
            {t('btn_delete')} {/* 🔥 Перевод */}
          </button>
        </div>
      </div>

      {/* Основные данные */}
      <div className='flex flex-col gap-5'>
        <InputField label={t('label_last_name')} defaultValue='Дастан' />{' '}
        {/* 🔥 Перевод */}
        <InputField
          label={t('label_first_name')}
          defaultValue='Дастанов'
        />{' '}
        {/* 🔥 Перевод */}
        <InputField
          label={t('label_patronymic')}
          defaultValue='Дастанович'
        />{' '}
        {/* 🔥 Перевод */}
        <InputField
          label={t('label_birth_date')}
          defaultValue='09.09.2009'
        />{' '}
        {/* 🔥 Перевод */}
        <InputField label={t('label_inn')} defaultValue='10909200943586' />{' '}
        {/* 🔥 Перевод */}
      </div>

      {/* Паспортные данные */}
      <div className='flex flex-col gap-2'>
        <label className='text-[20px] font-medium text-[#4B4B4B] pl-1'>
          {t('label_passport')} {/* 🔥 Перевод */}
        </label>
        <div className='flex flex-col sm:flex-row rounded-[10px] p-5 gap-4 border border-[#A3A3A3]'>
          {/* Лицевая сторона */}
          <div className='relative w-full h-[155px] rounded-[3px] overflow-hidden group'>
            <Image
              src={passportFront || '/passport-front.png'}
              alt='Passport Front'
              fill
              className='object-contain'
            />

            <input
              type='file'
              id='passport-front'
              accept='image/*'
              className='hidden'
              onChange={(e) => handleImageUpload(e, setPassportFront)}
            />
            <label
              htmlFor='passport-front'
              className='absolute inset-0 cursor-pointer hover:bg-black/5 transition-colors'
            />

            {passportFront && (
              <button
                onClick={() => setPassportFront(null)}
                className='absolute top-2 right-2 p-2 bg-white/80 backdrop-blur rounded-full text-[#DC2626] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm z-10'
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          {/* Оборотная сторона */}
          <div className='relative w-full h-[155px] rounded-[3px] overflow-hidden group'>
            <Image
              src={passportBack || '/passport-back.png'}
              alt='Passport Back'
              fill
              className='object-contain'
            />

            <input
              type='file'
              id='passport-back'
              accept='image/*'
              className='hidden'
              onChange={(e) => handleImageUpload(e, setPassportBack)}
            />
            <label
              htmlFor='passport-back'
              className='absolute inset-0 cursor-pointer hover:bg-black/5 transition-colors'
            />

            {passportBack && (
              <button
                onClick={() => setPassportBack(null)}
                className='absolute top-2 right-2 p-2 bg-white/80 backdrop-blur rounded-full text-[#DC2626] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm z-10'
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Контакты */}
      <div className='flex flex-col gap-5'>
        <InputField
          label={t('label_email')} // 🔥 Перевод
          defaultValue='seitek.seitekov@gmail.com'
          type='email'
        />
        <InputField
          label={t('label_phone')} // 🔥 Перевод
          defaultValue='+996 555 555 555'
          type='tel'
        />
      </div>

      {/* Опасная зона */}
      <div className='flex flex-col items-center gap-3 mt-4 text-[20px] font-medium'>
        <button className='text-[#DC2626] hover:underline transition-all cursor-pointer'>
          {t('btn_delete_account')} {/* 🔥 Перевод */}
        </button>
        <button className='text-[#4B4B4B] hover:underline transition-all cursor-pointer'>
          {t('btn_logout')} {/* 🔥 Перевод */}
        </button>
      </div>
    </div>
  );
};
