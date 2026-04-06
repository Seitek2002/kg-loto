'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { AuthService } from '@/services/auth';
import { useAuthStore } from '@/store/auth';

interface RegisterDetailsFormProps {
  phoneNumber: string;
  onSuccess: () => void;
}

export const RegisterDetailsForm = ({
  phoneNumber,
  onSuccess,
}: RegisterDetailsFormProps) => {
  const [fullName, setFullName] = useState('');
  const [inn, setInn] = useState('');
  const [isAdult, setIsAdult] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [error, setError] = useState('');

  const setTokens = useAuthStore((state) => state.setTokens);

  const mutation = useMutation({
    mutationFn: AuthService.registerComplete,
    onSuccess: (response: any) => {
      const { accessToken, refreshToken } = response.data.data || response.data;
      if (accessToken) setTokens(accessToken, refreshToken);
      onSuccess();
    },
    onError: (err: any) => {
      setError(
        err.response?.data?.message || 'Произошла ошибка при сохранении.',
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || inn.length < 14 || !isAdult || !isAgreed) return;

    mutation.mutate({
      phone_number: phoneNumber,
      full_name: fullName,
      inn: inn,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col text-center font-rubik'
    >
      <h2 className='text-3xl font-black font-benzin uppercase text-[#4B4B4B] mb-2'>
        РЕГИСТРАЦИЯ
      </h2>
      <p className='text-[#6E6E6E] text-[13px] font-medium mb-8'>
        Заполните данные, чтобы продолжить
      </p>

      <div className='text-left mb-4'>
        <label className='block text-[10px] font-bold text-[#4B4B4B] mb-2 pl-1'>
          Введите ФИО
        </label>
        <input
          type='text'
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder='Асанов Асан'
          className='w-full bg-white rounded-[20px] shadow-sm px-5 py-4 font-bold font-rubik text-[13px] text-[#4B4B4B] outline-none focus:ring-2 focus:ring-[#F6C635] transition-all placeholder:text-gray-300 placeholder:font-medium'
        />
      </div>

      <div className='text-left mb-6'>
        <label className='block text-[10px] font-bold text-[#4B4B4B] mb-2 pl-1'>
          ИНН
        </label>
        <input
          type='text'
          value={inn}
          onChange={(e) => setInn(e.target.value.replace(/[^0-9]/g, ''))}
          placeholder='12345678910111'
          maxLength={14}
          className='w-full bg-white rounded-[20px] shadow-sm px-5 py-4 font-bold font-rubik text-[13px] text-[#4B4B4B] outline-none focus:ring-2 focus:ring-[#F6C635] transition-all placeholder:text-gray-300 placeholder:font-medium'
        />
      </div>

      {/* Чекбоксы */}
      <div className='flex flex-col gap-4 text-left mb-8 pl-1'>
        <label className='flex items-center gap-3 cursor-pointer'>
          <input
            type='checkbox'
            checked={isAdult}
            onChange={(e) => setIsAdult(e.target.checked)}
            className='w-5 h-5 accent-[#4B4B4B] rounded shrink-0'
          />
          <span className='text-[11px] font-bold text-[#4B4B4B]'>
            Мне есть 18 лет
          </span>
        </label>
        <label className='flex items-start gap-3 cursor-pointer'>
          <input
            type='checkbox'
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
            className='w-5 h-5 accent-[#4B4B4B] rounded shrink-0 mt-0.5'
          />
          <span className='text-[10px] font-medium text-gray-500 leading-tight'>
            Согласен с{' '}
            <a href='#' className='underline hover:text-[#4B4B4B]'>
              офертой
            </a>{' '}
            /{' '}
            <a href='#' className='underline hover:text-[#4B4B4B]'>
              правилами
            </a>{' '}
            /{' '}
            <a href='#' className='underline hover:text-[#4B4B4B]'>
              политикой конфиденциальности
            </a>
          </span>
        </label>
      </div>

      {error && (
        <p className='text-red-500 text-[10px] font-bold mb-4'>{error}</p>
      )}

      <button
        type='submit'
        disabled={
          mutation.isPending ||
          !fullName.trim() ||
          inn.length < 14 ||
          !isAdult ||
          !isAgreed
        }
        className='w-full bg-[#F6C635] text-[#2D2D2D] font-black font-rubik uppercase py-4 rounded-full shadow-md hover:bg-[#E5B524] active:scale-95 transition-all text-[11px] disabled:opacity-60 disabled:active:scale-100 flex justify-center items-center'
      >
        {mutation.isPending ? (
          <Loader2 className='animate-spin' size={16} />
        ) : (
          'ПРОДОЛЖИТЬ'
        )}
      </button>
    </form>
  );
};
