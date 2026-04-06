'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/store/auth';

// 🔥 1. ТИПИЗАЦИЯ ИНПУТОВ
interface InputFieldProps {
  label: string;
  type?: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

// 🔥 2. ТИПИЗАЦИЯ ДАННЫХ ФОРМЫ
interface FormData {
  lastName: string;
  firstName: string;
  patronymic: string;
  dateOfBirth: string;
  inn: string;
  email: string;
  phoneNumber: string;
}

// DRY: Та самая функция извлечения инициалов
const getInitials = (fullName: string) => {
  if (!fullName) return 'U';
  const names = fullName.trim().split(/\s+/);
  if (names.length >= 2) {
    return (names[0][0] + names[1][0]).toUpperCase();
  }
  return names[0][0].toUpperCase();
};

// DRY: Мини-компонент для инпутов (теперь контролируемый и без any)
const InputField = ({
  label,
  type = 'text',
  value,
  placeholder,
  onChange,
}: InputFieldProps) => (
  <div className='flex flex-col gap-3'>
    <label className='text-[20px] font-medium text-[#4B4B4B] pl-1'>
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className='w-full border border-[#A3A3A3] rounded-[10px] p-5 text-[20px] text-[#2D2D2D] outline-none focus:border-[#FF7600] transition-colors placeholder:text-gray-400'
    />
  </div>
);

export const AccountForm = () => {
  const t = useTranslations('account_form');
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [passportFront, setPassportFront] = useState<string | null>(null);
  const [passportBack, setPassportBack] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState(false);

  // 🔥 3. ВЫЧИСЛЯЕМ НАЧАЛЬНЫЕ ДАННЫЕ
  const initialData: FormData = useMemo(() => {
    const nameParts = user?.fullName ? user.fullName.trim().split(/\s+/) : [];
    return {
      lastName: user?.kglotteryProfile?.lastName || nameParts[0] || '',
      firstName: user?.kglotteryProfile?.firstName || nameParts[1] || '',
      patronymic:
        user?.kglotteryProfile?.middleName ||
        nameParts.slice(2).join(' ') ||
        '',
      dateOfBirth: user?.kglotteryProfile?.dateOfBirth || '',
      inn: user?.inn || '',
      email: user?.kglotteryProfile?.email || '',
      phoneNumber: user?.phoneNumber || '',
    };
  }, [user]);

  // 🔥 4. СОСТОЯНИЕ ФОРМЫ
  const [formData, setFormData] = useState<FormData>(initialData);

  // Синхронизируем стейт, если юзер в сторе обновился
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // Универсальный обработчик загрузки картинок
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

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // 🔥 5. ЛОГИКА ОПРЕДЕЛЕНИЯ ИЗМЕНЕНИЙ
  const isDataChanged =
    JSON.stringify(formData) !== JSON.stringify(initialData);
  const hasImagesChanged =
    avatarPreview !== null || passportFront !== null || passportBack !== null;
  const hasChanges = isDataChanged || hasImagesChanged;

  // 🔥 Сброс изменений
  const handleReset = () => {
    setFormData(initialData);
    setAvatarPreview(null);
    setPassportFront(null);
    setPassportBack(null);
  };

  if (!user) {
    return (
      <div className='animate-pulse h-96 bg-gray-100 rounded-3xl w-full'></div>
    );
  }

  const initials = getInitials(user.fullName || 'Аноним');
  const serverAvatar = user.kglotteryProfile?.avatar;

  return (
    <div className='flex flex-col gap-8'>
      {/* Аватар */}
      <div className='flex items-center gap-6'>
        <div className='relative flex items-center justify-center w-17.5 h-17.5 rounded-full overflow-hidden border border-gray-200 bg-[#FFD600] text-[#2D2D2D] text-xl font-black font-benzin tracking-wider shadow-sm shrink-0'>
          {(avatarPreview || serverAvatar) && !avatarError ? (
            <Image
              src={avatarPreview || serverAvatar!}
              alt={user.fullName || 'Аватар'}
              fill
              sizes='70px'
              className='object-cover'
              onError={() => setAvatarError(true)}
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
            onChange={(e) => {
              setAvatarError(false);
              handleImageUpload(e, setAvatarPreview);
            }}
          />
          <label
            htmlFor='avatar-upload'
            className='bg-[#4B4B4B] cursor-pointer text-white rounded-full px-5 py-2.5 active:scale-95 transition-transform inline-block'
          >
            {t('btn_change_photo')}
          </label>
          <button
            onClick={() => setAvatarPreview(null)}
            className='bg-white cursor-pointer border border-[#4B4B4B] text-[#4B4B4B] rounded-full px-5 py-2.5 hover:bg-gray-50 active:scale-95 transition-all'
          >
            {t('btn_delete')}
          </button>
        </div>
      </div>

      {/* Основные данные */}
      <div className='flex flex-col gap-5'>
        <InputField
          label={t('label_last_name')}
          value={formData.lastName}
          onChange={(val) => setFormData({ ...formData, lastName: val })}
        />
        <InputField
          label={t('label_first_name')}
          value={formData.firstName}
          onChange={(val) => setFormData({ ...formData, firstName: val })}
        />
        <InputField
          label={t('label_patronymic')}
          value={formData.patronymic}
          onChange={(val) => setFormData({ ...formData, patronymic: val })}
        />
        <InputField
          label={t('label_birth_date')}
          value={formData.dateOfBirth}
          onChange={(val) => setFormData({ ...formData, dateOfBirth: val })}
          placeholder='ДД.ММ.ГГГГ'
        />
        <InputField
          label={t('label_inn')}
          value={formData.inn}
          onChange={(val) => setFormData({ ...formData, inn: val })}
        />
      </div>

      {/* Паспортные данные */}
      <div className='flex flex-col gap-2'>
        <label className='text-[20px] font-medium text-[#4B4B4B] pl-1'>
          {t('label_passport')}
        </label>
        <div className='flex flex-col sm:flex-row rounded-[10px] p-5 gap-4 border border-[#A3A3A3]'>
          {/* Лицевая сторона */}
          <div className='relative w-full h-38.75 rounded-[3px] overflow-hidden group'>
            <Image
              src={
                passportFront ||
                user.kglotteryProfile?.passportFrontScan ||
                '/passport-front.png'
              }
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

            {(passportFront || user.kglotteryProfile?.passportFrontScan) && (
              <button
                onClick={() => setPassportFront(null)}
                className='absolute top-2 right-2 p-2 bg-white/80 backdrop-blur rounded-full text-[#DC2626] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm z-10'
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          {/* Оборотная сторона */}
          <div className='relative w-full h-38.75 rounded-[3px] overflow-hidden group'>
            <Image
              src={
                passportBack ||
                user.kglotteryProfile?.passportBackScan ||
                '/passport-back.png'
              }
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

            {(passportBack || user.kglotteryProfile?.passportBackScan) && (
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
          label={t('label_email')}
          value={formData.email}
          onChange={(val) => setFormData({ ...formData, email: val })}
          type='email'
          placeholder='example@gmail.com'
        />
        <InputField
          label={t('label_phone')}
          value={formData.phoneNumber}
          onChange={(val) => setFormData({ ...formData, phoneNumber: val })}
          type='tel'
        />
      </div>

      {/* 🔥 6. КНОПКИ СОХРАНЕНИЯ (показываются только если есть изменения) */}
      {hasChanges && (
        <div className='flex flex-col sm:flex-row gap-4 mt-4'>
          <button
            onClick={handleReset}
            className='flex-1 border border-[#4B4B4B] text-[#4B4B4B] font-bold uppercase py-4 rounded-full hover:bg-gray-50 transition-colors active:scale-95 text-[14px]'
          >
            Сбросить изменения
          </button>
          <button
            onClick={() => console.log('Сохранение...', formData)}
            className='flex-1 bg-[#FFD600] text-[#2D2D2D] font-bold uppercase py-4 rounded-full hover:bg-[#ffe033] shadow-md transition-all active:scale-95 text-[14px]'
          >
            Изменить
          </button>
        </div>
      )}

      {/* Опасная зона */}
      <div className='flex flex-col items-center gap-3 mt-4 text-[20px] font-medium'>
        <button className='text-[#DC2626] hover:underline transition-all cursor-pointer'>
          {t('btn_delete_account')}
        </button>
        <button
          onClick={handleLogout}
          className='text-[#4B4B4B] hover:underline transition-all cursor-pointer'
        >
          {t('btn_logout')}
        </button>
      </div>
    </div>
  );
};
