'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { clsx } from 'clsx';

import { AuthService } from '@/services/auth';
import { registerSchema, RegisterSchema } from '@/lib/schemas';
import { Title } from '@/components/ui/Title';
import { Description } from '@/components/ui/Description';

interface RegisterFormProps {
  onLoginClick: () => void;
  onSubmit: (data: RegisterSchema) => void;
}

export const RegisterForm = ({ onLoginClick, onSubmit }: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 1. Хук формы
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      phoneNumber: '',
      fullName: '',
      inn: '',
      birthYear: '',
      password: '',
      passwordConfirm: '',
      terms: false,
    },
  });

  // 2. Мутация регистрации
  const mutation = useMutation({
    mutationFn: AuthService.register,
    onSuccess: (_, variables) => {
      onSubmit(variables as RegisterSchema);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const errorData = error.response?.data;

      if (errorData?.errors) {
        // 🔥 Улучшенный текст ошибки для пользователя
        setError('root', {
          message: 'Пожалуйста, проверьте правильность заполнения всех полей.',
        });
      } else {
        setError('root', {
          message:
            errorData?.message || 'Ошибка регистрации. Попробуйте позже.',
        });
      }
    },
  });

  // 3. Отправка
  const onFormSubmit = (data: RegisterSchema) => {
    let phone = data.phoneNumber;
    if (!phone.startsWith('+')) {
      phone = `+996${phone.replace(/^0+/, '')}`;
    }

    mutation.mutate({
      phoneNumber: phone,
      fullName: data.fullName,
      inn: data.inn || undefined,
      birth_year: Number(data.birthYear), // 🔥 Передаем на бэкенд в формате числа (как требует API)
      password: data.password,
      passwordConfirm: data.passwordConfirm,
    });
  };

  // Вспомогательный класс для инпутов
  const inputClass = (hasError: boolean) =>
    clsx(
      'w-full bg-[#F5F5F5] rounded-2xl px-5 py-3.5 font-bold font-rubik text-xs text-[#2D2D2D] outline-none focus:ring-2 transition-all placeholder:text-gray-400 placeholder:font-medium',
      hasError ? 'ring-2 ring-red-500 bg-red-50' : 'focus:ring-[#FFD600]',
    );

  return (
    <>
      <div className='text-left w-full'>
        <Title>Регистрация</Title>
        <Description>Зарегистрируйтесь, чтобы продолжить</Description>
      </div>

      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className='space-y-4 mb-6 text-left font-rubik'
      >
        {/* Общая ошибка */}
        {errors.root && (
          <div className='p-3 bg-red-50 text-red-500 text-xs rounded-xl font-medium text-center'>
            {errors.root.message}
          </div>
        )}

        {/* Телефон */}
        <div>
          <label className='block text-[10px] font-bold text-[#2D2D2D] mb-1.5 pl-1'>
            Номер телефона
          </label>
          <div className='relative'>
            <div className='absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs font-bold'>
              +996
            </div>
            <input
              {...register('phoneNumber')}
              type='tel'
              placeholder='500 111 000'
              className={clsx(
                'w-full bg-[#F5F5F5] rounded-2xl pl-12 pr-5 py-3.5 font-bold font-rubik text-xs text-[#2D2D2D] outline-none focus:ring-2 transition-all placeholder:text-gray-400 placeholder:font-medium',
                errors.phoneNumber
                  ? 'ring-2 ring-red-500 bg-red-50'
                  : 'focus:ring-[#FFD600]',
              )}
            />
          </div>
          {errors.phoneNumber && (
            <p className='text-[10px] text-red-500 ml-2 mt-1'>
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        {/* ФИО */}
        <div>
          <label className='block text-[10px] font-bold text-[#2D2D2D] mb-1.5 pl-1'>
            Введите ФИО
          </label>
          <input
            {...register('fullName')}
            type='text'
            placeholder='Алексеева Александра Александровна'
            className={inputClass(!!errors.fullName)}
          />
          {errors.fullName && (
            <p className='text-[10px] text-red-500 ml-2 mt-1'>
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* ИНН */}
        <div>
          <label className='block text-[10px] font-bold text-[#2D2D2D] mb-1.5 pl-1'>
            ИНН
          </label>
          <input
            {...register('inn')}
            type='text'
            placeholder='123456789101'
            maxLength={14}
            autoComplete='username'
            className={inputClass(!!errors.inn)}
          />
          {errors.inn && (
            <p className='text-[10px] text-red-500 ml-2 mt-1'>
              {errors.inn.message}
            </p>
          )}
        </div>

        {/* 🔥 НОВОЕ ПОЛЕ: Год рождения */}
        <div>
          <label className='block text-[10px] font-bold text-[#2D2D2D] mb-1.5 pl-1'>
            Год рождения
          </label>
          <input
            {...register('birthYear')}
            type='text'
            placeholder='2002'
            maxLength={4}
            className={inputClass(!!errors.birthYear)}
          />
          {errors.birthYear && (
            <p className='text-[10px] text-red-500 ml-2 mt-1'>
              {errors.birthYear.message}
            </p>
          )}
        </div>

        {/* Пароль */}
        <div>
          <label className='block text-[10px] font-bold text-[#2D2D2D] mb-1.5 pl-1'>
            Пароль
          </label>
          <div className='relative'>
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder='••••••••••••••'
              autoComplete='new-password'
              className={inputClass(!!errors.password)}
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className='text-[10px] text-red-500 ml-2 mt-1'>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Повтор пароля */}
        <div>
          <label className='block text-[10px] font-bold text-[#2D2D2D] mb-1.5 pl-1'>
            Повторите пароль
          </label>
          <div className='relative'>
            <input
              {...register('passwordConfirm')}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder='••••••••••••••'
              autoComplete='new-password'
              className={inputClass(!!errors.passwordConfirm)}
            />
            <button
              type='button'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.passwordConfirm && (
            <p className='text-[10px] text-red-500 ml-2 mt-1'>
              {errors.passwordConfirm.message}
            </p>
          )}
        </div>

        {/* Чекбокс (Условия) */}
        <div className='pt-2'>
          <div className='flex items-start gap-3 text-left'>
            <input
              {...register('terms')}
              type='checkbox'
              id='terms'
              className='accent-[#FFD600] w-5 h-5 mt-0.5 rounded shrink-0 cursor-pointer'
            />
            <div className='flex flex-col gap-1'>
              <label
                htmlFor='terms'
                className='text-xs font-bold font-rubik text-[#2D2D2D] cursor-pointer'
              >
                Мне есть 18 лет
              </label>
              <span className='text-[10px] font-medium font-rubik text-gray-500 leading-tight'>
                Согласен с{' '}
                <a href='#' className='underline hover:text-[#FFD600]'>
                  офертой
                </a>{' '}
                /{' '}
                <a href='#' className='underline hover:text-[#FFD600]'>
                  правилами
                </a>{' '}
                /{' '}
                <a href='#' className='underline hover:text-[#FFD600]'>
                  политикой конфиденциальности
                </a>
              </span>
            </div>
          </div>
          {errors.terms && (
            <p className='text-[10px] text-red-500 ml-8 mt-1'>
              {errors.terms.message}
            </p>
          )}
        </div>
      </form>

      {/* Кнопки */}
      <div className='flex gap-3 w-full'>
        <button
          type='button'
          onClick={onLoginClick}
          className='flex-1 bg-white border border-gray-200 text-[#2D2D2D] font-bold font-rubik uppercase py-4 rounded-full hover:bg-gray-50 transition-colors text-[10px]'
        >
          Уже есть аккаунт?
        </button>
        <button
          onClick={handleSubmit(onFormSubmit)}
          disabled={mutation.isPending}
          className='flex-[1.5] bg-[#FFD600] text-[#2D2D2D] font-black font-rubik uppercase py-4 rounded-full shadow-lg hover:bg-[#ffe033] active:scale-95 transition-all text-[10px] flex justify-center items-center'
        >
          {mutation.isPending ? (
            <Loader2 className='animate-spin' size={16} />
          ) : (
            'Зарегистрироваться'
          )}
        </button>
      </div>
    </>
  );
};
