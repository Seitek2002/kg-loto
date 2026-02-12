'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

import { AuthService } from '@/services/auth';
import { useAuthStore } from '@/store/auth';
import { loginSchema, LoginSchema } from '@/lib/schemas';

interface LoginFormProps {
  onRegisterClick: () => void;
  onForgotPasswordClick: () => void;
  onSuccess: () => void; // Чтобы закрыть модалку
}

export const LoginForm = ({
  onRegisterClick,
  onForgotPasswordClick,
  onSuccess,
}: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const setTokens = useAuthStore((state) => state.setTokens);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  // 1. Настройка формы
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phoneNumber: '', // Можно предустановить +996
      password: '',
    },
  });

  // 2. Настройка мутации (запрос к серверу)
  const mutation = useMutation({
    mutationFn: AuthService.login,
    onSuccess: async (response) => {
      const { accessToken, refreshToken } = response.data.data;
      setTokens(accessToken, refreshToken);

      await fetchUser();

      onSuccess();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      setError('root', {
        message:
          error.response?.data?.message ||
          'Ошибка авторизации. Проверьте данные.',
      });
    },
  });

  // 3. Обработчик отправки
  const onSubmit = (data: LoginSchema) => {
    // Небольшая нормализация номера перед отправкой, если юзер ввел без +
    let phone = data.phoneNumber;
    if (!phone.startsWith('+')) {
      phone = `+996${phone.replace(/^0+/, '')}`; // Убираем начальный 0 если есть
    }

    mutation.mutate({
      phoneNumber: phone,
      password: data.password,
    });
  };

  return (
    <>
      <h2 className='text-2xl font-black font-benzin uppercase text-[#2D2D2D] mb-4'>
        Вход
      </h2>
      <p className='text-xs font-rubik font-medium text-gray-400 mb-8'>
        Войдите в аккаунт для продолжения работы
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-3 mb-6 text-left'
      >
        {/* Ошибка сервера (общая) */}
        {errors.root && (
          <div className='p-3 bg-red-50 text-red-500 text-xs rounded-xl font-medium text-center'>
            {errors.root.message}
          </div>
        )}

        {/* Телефон */}
        <div className='relative'>
          <div className='absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2'>
              +996
          </div>
          <input
            {...register('phoneNumber')}
            type='tel'
            placeholder=' (___) __-__-__'
            className={clsx(
              'w-full bg-[#F5F5F5] rounded-2xl pl-14 pr-5 py-4 font-bold font-rubik text-sm text-[#2D2D2D] placeholder:text-gray-400 outline-none focus:ring-2 transition-all',
              errors.phoneNumber
                ? 'ring-2 ring-red-500 bg-red-50'
                : 'focus:ring-[#FFD600]',
            )}
          />
          {errors.phoneNumber && (
            <span className='text-[10px] text-red-500 ml-2'>
              {errors.phoneNumber.message}
            </span>
          )}
        </div>

        {/* Пароль */}
        <div className='relative'>
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder='Пароль'
            className={clsx(
              'w-full bg-[#F5F5F5] rounded-2xl px-5 py-4 font-bold font-rubik text-sm text-[#2D2D2D] placeholder:text-gray-400 outline-none focus:ring-2 transition-all',
              errors.password
                ? 'ring-2 ring-red-500 bg-red-50'
                : 'focus:ring-[#FFD600]',
            )}
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <span className='text-[10px] text-red-500 ml-2'>
            {errors.password.message}
          </span>
        )}

        <div className='flex items-center gap-2 mt-2'>
          <input
            type='checkbox'
            id='remember'
            className='accent-[#FFD600] w-4 h-4'
          />
          <label
            htmlFor='remember'
            className='text-xs font-bold font-rubik text-[#2D2D2D]'
          >
            Запомнить меня
          </label>
          <button
            type='button'
            onClick={onForgotPasswordClick}
            className='ml-auto text-xs font-bold font-rubik text-[#FFD600] hover:underline'
          >
            Забыли пароль?
          </button>
        </div>
      </form>

      <div className='flex gap-3'>
        <button
          type='button'
          onClick={onRegisterClick}
          className='flex-1 bg-white border border-gray-200 text-[#2D2D2D] font-bold font-rubik uppercase py-3 rounded-full hover:bg-gray-50 transition-colors text-xs'
        >
          Регистрация
        </button>

        <button
          onClick={handleSubmit(onSubmit)}
          disabled={mutation.isPending}
          className='flex-1 bg-[#FFD600] text-[#2D2D2D] font-black font-rubik uppercase py-3 rounded-full shadow-lg hover:bg-[#ffe033] active:scale-95 transition-all text-xs flex justify-center items-center'
        >
          {mutation.isPending ? (
            <Loader2 className='animate-spin' size={16} />
          ) : (
            'Войти'
          )}
        </button>
      </div>
    </>
  );
};
