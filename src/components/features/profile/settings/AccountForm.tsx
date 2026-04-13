'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/store/auth';
import { useMutation } from '@tanstack/react-query';
import { AuthService } from '@/services/auth';

// 🔥 1. ТИПИЗАЦИЯ ИНПУТОВ (добавили disabled)
interface InputFieldProps {
  label: string;
  type?: string;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

// 🔥 2. СТРОГАЯ ТИПИЗАЦИЯ ПОД ТВОЙ СВАГГЕР
interface FormData {
  lastName: string;
  firstName: string;
  middleName: string; // Заменили patronymic на middleName
  birthDate: string; // Заменили dateOfBirth на birthDate
  inn: string;
  email: string;
  phone: string;
}

// Извлекаем инициалы (теперь берем из нормальных полей)
const getInitials = (firstName?: string, lastName?: string) => {
  if (!firstName && !lastName) return 'U';
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
};

const InputField = ({
  label,
  type = 'text',
  value,
  placeholder,
  disabled = false,
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
      disabled={disabled}
      className={`w-full border border-[#A3A3A3] rounded-[10px] p-5 text-[20px] text-[#2D2D2D] outline-none transition-colors placeholder:text-gray-400
        ${disabled ? 'bg-gray-100/60 text-gray-500 cursor-not-allowed border-gray-200' : 'focus:border-[#FF7600] bg-white'}`}
    />
  </div>
);

export const AccountForm = () => {
  const t = useTranslations('account_form');
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [passportFront, setPassportFront] = useState<string | null>(null);
  const [passportBack, setPassportBack] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState(false);

  // 🔥 3. ЧИСТОЕ ИЗВЛЕЧЕНИЕ ДАННЫХ ИЗ USER
  const initialData: FormData = useMemo(() => {
    // Форматируем телефон из объекта PhoneData, если он есть
    const formattedPhone = user?.phone
      ? `${user.phone.dialCode} ${user.phone.number}`
      : user?.phoneNumber || '';

    return {
      lastName: user?.lastName || '',
      firstName: user?.firstName || '',
      middleName: user?.middleName || '',
      birthDate: user?.birthDate || '',
      inn: user?.inn || '',
      email: user?.email || '',
      phone: formattedPhone,
    };
  }, [user]);

  const [formData, setFormData] = useState<FormData>(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // 🔥 4. МУТАЦИЯ ДЛЯ СОХРАНЕНИЯ ИЗМЕНЕНИЙ
  const updateMutation = useMutation({
    mutationFn: async (dataToUpdate: Partial<FormData>) => {
      // Отправляем только те поля, которые можно менять
      return AuthService.updateProfile({
        lastName: dataToUpdate.lastName,
        firstName: dataToUpdate.firstName,
        middleName: dataToUpdate.middleName,
        birthDate: dataToUpdate.birthDate,
        email: dataToUpdate.email,
        // TODO: загрузка файлов avatar и passport, если они изменились
      });
    },
    onSuccess: async () => {
      // После успешного обновления перезапрашиваем юзера, чтобы стейт обновился
      await fetchUser();
      setAvatarPreview(null);
      setPassportFront(null);
      setPassportBack(null);
    },
    onError: (err) => {
      console.error('Ошибка обновления профиля', err);
    },
  });

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: (url: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // ОПРЕДЕЛЯЕМ, БЫЛИ ЛИ ИЗМЕНЕНИЯ
  const isDataChanged =
    JSON.stringify(formData) !== JSON.stringify(initialData);
  const hasImagesChanged =
    avatarPreview !== null || passportFront !== null || passportBack !== null;
  const hasChanges = isDataChanged || hasImagesChanged;

  const handleReset = () => {
    setFormData(initialData);
    setAvatarPreview(null);
    setPassportFront(null);
    setPassportBack(null);
  };

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  if (!user) {
    return (
      <div className='animate-pulse h-96 bg-gray-100 rounded-3xl w-full'></div>
    );
  }

  const initials = getInitials(user.firstName, user.lastName);
  const serverAvatar = user.avatar; // Берем аватар напрямую из корня объекта

  return (
    <div className='flex flex-col gap-8'>
      {/* Аватар */}
      <div className='flex items-center gap-6'>
        <div className='relative flex items-center justify-center w-17.5 h-17.5 rounded-full overflow-hidden border border-gray-200 bg-[#FFD600] text-[#2D2D2D] text-xl font-black font-benzin tracking-wider shadow-sm shrink-0'>
          {(avatarPreview || serverAvatar) && !avatarError ? (
            <Image
              src={avatarPreview || serverAvatar!}
              alt={user.firstName || 'Аватар'}
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
          label={t('label_patronymic') || 'Отчество'}
          value={formData.middleName}
          onChange={(val) => setFormData({ ...formData, middleName: val })}
        />
        <InputField
          label={t('label_birth_date') || 'Дата рождения'}
          value={formData.birthDate}
          onChange={(val) => setFormData({ ...formData, birthDate: val })}
          placeholder='YYYY-MM-DD'
        />
        {/* ИНН ЗАБЛОКИРОВАН */}
        <InputField
          label={t('label_inn')}
          value={formData.inn}
          disabled={true}
          onChange={(val) => setFormData({ ...formData, inn: val })}
        />
      </div>

      {/* Паспортные данные */}
      <div className='flex flex-col gap-2'>
        <label className='text-[20px] font-medium text-[#4B4B4B] pl-1'>
          {t('label_passport')}
        </label>
        <div className='flex flex-col sm:flex-row rounded-[10px] p-5 gap-4 border border-[#A3A3A3]'>
          <div className='relative w-full h-38.75 rounded-[3px] overflow-hidden group'>
            <Image
              src={passportFront || user.passportFront || '/passport-front.png'}
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
            {(passportFront || user.passportFront) && (
              <button
                onClick={() => setPassportFront(null)}
                className='absolute top-2 right-2 p-2 bg-white/80 backdrop-blur rounded-full text-[#DC2626] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm z-10'
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <div className='relative w-full h-38.75 rounded-[3px] overflow-hidden group'>
            <Image
              src={passportBack || user.passportBack || '/passport-back.png'}
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
            {(passportBack || user.passportBack) && (
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
        {/* ТЕЛЕФОН ЗАБЛОКИРОВАН */}
        <InputField
          label={t('label_phone')}
          value={formData.phone}
          disabled={true}
          onChange={(val) => setFormData({ ...formData, phone: val })}
          type='tel'
        />
      </div>

      {/* 🔥 КНОПКИ СОХРАНЕНИЯ */}
      {hasChanges && (
        <div className='flex flex-col sm:flex-row gap-4 mt-4'>
          <button
            onClick={handleReset}
            disabled={updateMutation.isPending}
            className='flex-1 border border-[#4B4B4B] text-[#4B4B4B] font-bold uppercase py-4 rounded-full hover:bg-gray-50 transition-colors active:scale-95 text-[14px] disabled:opacity-50'
          >
            Сбросить изменения
          </button>
          <button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className='flex-1 flex justify-center items-center bg-[#FFD600] text-[#2D2D2D] font-bold uppercase py-4 rounded-full hover:bg-[#ffe033] shadow-md transition-all active:scale-95 text-[14px] disabled:opacity-70'
          >
            {updateMutation.isPending ? (
              <Loader2 className='animate-spin' size={20} />
            ) : (
              'Изменить'
            )}
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
