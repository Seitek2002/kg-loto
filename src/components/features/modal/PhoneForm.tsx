'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { AuthService } from '@/services/auth';

interface PhoneFormProps {
  flow: 'login' | 'register';
  onSwitchFlow: () => void;
  onSuccess: (phone: string) => void;
}

export const PhoneForm = ({
  flow,
  onSwitchFlow,
  onSuccess,
}: PhoneFormProps) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const isLogin = flow === 'login';

  const mutation = useMutation({
    mutationFn: isLogin ? AuthService.loginPhone : AuthService.registerPhone,
    onSuccess: () => {
      // Форматируем телефон для бэка (если ввели без кода)
      let formattedPhone = phone.replace(/\s+/g, '');
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = `+996${formattedPhone.replace(/^0+/, '')}`;
      }
      onSuccess(formattedPhone);
    },
    onError: (err: any) => {
      setError(
        err.response?.data?.message || 'Произошла ошибка. Попробуйте еще раз.',
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 9) {
      setError('Введите корректный номер');
      return;
    }

    let formattedPhone = phone.replace(/\s+/g, '');
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = `+996${formattedPhone.replace(/^0+/, '')}`;
    }

    mutation.mutate({ phone_number: formattedPhone });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col text-center font-rubik'
    >
      <h2 className='text-3xl font-black font-benzin uppercase text-[#4B4B4B] mb-2'>
        {isLogin ? 'ВХОД' : 'РЕГИСТРАЦИЯ'}
      </h2>
      <p className='text-[#6E6E6E] text-[13px] font-medium mb-8'>
        {isLogin
          ? 'Заполните данные для входа в аккаунт'
          : 'На ваш номер будет отправлен код OTP'}
      </p>

      <div className='text-left mb-6'>
        <label className='block text-[10px] font-bold text-[#4B4B4B] mb-2 pl-1'>
          Номер телефона
        </label>
        <div className='relative flex items-center bg-white rounded-[20px] shadow-sm overflow-hidden'>
          {/* Имитация дропдауна с флагом */}
          <div className='flex items-center gap-2 pl-4 pr-3 py-4 border-r border-gray-100 bg-white'>
            <span className='text-xs text-gray-400'>▼</span>
            <div className='w-5 h-3.5 bg-red-600 rounded-sm relative overflow-hidden flex items-center justify-center'>
              <div className='w-1.5 h-1.5 bg-yellow-400 rounded-full'></div>
            </div>
          </div>
          <div className='flex items-center font-bold text-[13px] text-[#4B4B4B] pl-3'>
            +996
          </div>
          <input
            type='tel'
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value.replace(/[^0-9]/g, ''));
              setError('');
            }}
            placeholder='500 111 000'
            className='w-full py-4 px-2 font-bold font-rubik text-[13px] text-[#4B4B4B] outline-none placeholder:text-gray-300 placeholder:font-medium'
            maxLength={10}
          />
        </div>
        {error && (
          <p className='text-red-500 text-[10px] font-bold mt-2 ml-2'>
            {error}
          </p>
        )}
      </div>

      <button
        type='submit'
        disabled={mutation.isPending || phone.length < 9}
        className='w-full bg-[#F6C635] text-[#2D2D2D] font-black font-rubik uppercase py-4 rounded-full shadow-md hover:bg-[#E5B524] active:scale-95 transition-all text-[11px] disabled:opacity-60 disabled:active:scale-100 flex justify-center items-center'
      >
        {mutation.isPending ? (
          <Loader2 className='animate-spin' size={16} />
        ) : (
          'ПРОДОЛЖИТЬ'
        )}
      </button>

      {/* Переключатель Логин/Регистрация */}
      <button
        type='button'
        onClick={onSwitchFlow}
        className='mt-6 text-[11px] font-bold text-gray-400 hover:text-[#4B4B4B] transition-colors uppercase'
      >
        {isLogin
          ? 'Нет аккаунта? Зарегистрироваться'
          : 'Уже есть аккаунт? Войти'}
      </button>
    </form>
  );
};
