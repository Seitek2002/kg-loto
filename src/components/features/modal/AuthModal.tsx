'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';

// Типы шагов
type AuthStep = 'login' | 'register' | 'otp';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStep: AuthStep; // С какого шага начинать (например, кликнул "Регистрация")
}

export const AuthModal = ({ isOpen, onClose, initialStep }: AuthModalProps) => {
  const [step, setStep] = useState<AuthStep>(initialStep);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className='max-w-120'>
      <div className='p-8 pt-10 text-center'>
        {step === 'login' && (
          <>
            <h2 className='text-2xl font-black font-benzin uppercase text-[#2D2D2D] mb-4'>
              Вход
            </h2>
            <p className='text-xs font-rubik font-medium text-gray-400 mb-8'>
              Войдите в аккаунт для продолжения работы
            </p>

            <form className='space-y-3 mb-6'>
              {/* Телефон */}
              <div className='relative'>
                <div className='absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2'>
                  <div className='w-5 h-5 rounded-full overflow-hidden relative border border-gray-200'>
                    {/* Флаг (заглушка) */}
                    <div className='w-full h-full bg-red-500 rounded-full flex items-center justify-center text-[8px] text-white'>
                      KG
                    </div>
                  </div>
                  <span className='text-sm font-bold font-rubik text-[#2D2D2D]'>
                    +996
                  </span>
                </div>
                <input
                  type='tel'
                  placeholder='(000) 00-00-00'
                  className='w-full bg-[#F5F5F5] rounded-2xl pl-24 pr-5 py-4 font-bold font-benzin text-sm text-[#2D2D2D] placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#FFD600] transition-all'
                />
              </div>

              {/* Пароль */}
              <input
                type='password'
                placeholder='Пароль'
                className='w-full bg-[#F5F5F5] rounded-2xl px-5 py-4 font-bold font-benzin text-sm text-[#2D2D2D] placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#FFD600] transition-all'
              />

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
                  className='ml-auto text-xs font-bold font-rubik text-[#FFD600] hover:underline'
                >
                  Забыли пароль?
                </button>
              </div>
            </form>

            <div className='flex gap-3'>
              <button
                onClick={onClose}
                className='flex-1 bg-white border border-gray-200 text-[#2D2D2D] font-bold font-benzin uppercase py-3 rounded-full hover:bg-gray-50 transition-colors text-xs'
              >
                Закрыть
              </button>
              <button className='flex-1 bg-[#FFD600] text-[#2D2D2D] font-black font-benzin uppercase py-3 rounded-full shadow-lg hover:bg-[#ffe033] active:scale-95 transition-all text-xs'>
                Войти
              </button>
            </div>
          </>
        )}

        {/* 2. РЕГИСТРАЦИЯ */}
        {step === 'register' && (
          <>
            <h2 className='text-2xl font-black font-benzin uppercase text-[#2D2D2D] mb-2'>
              Регистрация
            </h2>
            <p className='text-xs font-rubik font-medium text-gray-400 mb-6'>
              Зарегистрируйтесь, чтобы продолжить
            </p>

            <form className='space-y-3 mb-6'>
              {/* Телефон */}
              <div className='relative'>
                <div className='absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2'>
                  <div className='w-5 h-5 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center'>
                    KG
                  </div>
                  <span className='text-sm font-bold font-rubik text-[#2D2D2D]'>
                    +996
                  </span>
                </div>
                <input
                  type='tel'
                  placeholder='(000) 00-00-00'
                  className='w-full bg-[#F5F5F5] rounded-2xl pl-24 pr-5 py-3.5 font-bold font-benzin text-xs text-[#2D2D2D] outline-none focus:ring-2 focus:ring-[#FFD600]'
                />
              </div>

              {/* ФИО */}
              <input
                type='text'
                placeholder='Введите ФИО'
                className='w-full bg-[#F5F5F5] rounded-2xl px-5 py-3.5 font-bold font-benzin text-xs text-[#2D2D2D] outline-none focus:ring-2 focus:ring-[#FFD600]'
              />

              {/* ИНН */}
              <input
                type='text'
                placeholder='ИНН'
                className='w-full bg-[#F5F5F5] rounded-2xl px-5 py-3.5 font-bold font-benzin text-xs text-[#2D2D2D] outline-none focus:ring-2 focus:ring-[#FFD600]'
              />

              {/* Пароль */}
              <input
                type='password'
                placeholder='Пароль'
                className='w-full bg-[#F5F5F5] rounded-2xl px-5 py-3.5 font-bold font-benzin text-xs text-[#2D2D2D] outline-none focus:ring-2 focus:ring-[#FFD600]'
              />

              {/* Чекбокс */}
              <div className='flex items-start gap-2 mt-2 text-left'>
                <input
                  type='checkbox'
                  id='terms'
                  className='accent-[#FFD600] w-4 h-4 mt-0.5'
                />
                <label
                  htmlFor='terms'
                  className='text-[10px] font-medium font-rubik text-gray-500 leading-tight'
                >
                  Мне есть 18 лет. <br />
                  Согласен с{' '}
                  <a href='#' className='underline'>
                    офертой
                  </a>{' '}
                  /{' '}
                  <a href='#' className='underline'>
                    правилами
                  </a>{' '}
                  /{' '}
                  <a href='#' className='underline'>
                    политикой конфиденциальности
                  </a>
                </label>
              </div>
            </form>

            <div className='flex gap-3'>
              <button
                onClick={onClose}
                className='flex-1 bg-white border border-gray-200 text-[#2D2D2D] font-bold font-benzin uppercase py-3 rounded-full hover:bg-gray-50 transition-colors text-[10px]'
              >
                Закрыть
              </button>
              <button
                onClick={() => setStep('otp')} // Для теста переход на OTP
                className='flex-[1.5] bg-[#FFD600] text-[#2D2D2D] font-black font-benzin uppercase py-3 rounded-full shadow-lg hover:bg-[#ffe033] active:scale-95 transition-all text-[10px]'
              >
                Зарегистрироваться
              </button>
            </div>
          </>
        )}

        {/* 3. КОД ПОДТВЕРЖДЕНИЯ */}
        {step === 'otp' && (
          <>
            <h2 className='text-xl font-black font-benzin uppercase text-[#2D2D2D] mb-2'>
              Код подтверждения
            </h2>
            <p className='text-xs font-rubik font-medium text-gray-400 mb-6 px-4'>
              Мы отправили код на ваш номер. Введите его для продолжения.
            </p>

            <div className='flex justify-center gap-3 mb-8'>
              {[1, 2, 3, 4].map((_, i) => (
                <input
                  key={i}
                  type='text'
                  maxLength={1}
                  className='w-12 h-12 rounded-xl bg-[#F5F5F5] text-center font-black font-benzin text-xl focus:ring-2 focus:ring-[#FFD600] outline-none'
                />
              ))}
            </div>

            <div className='flex gap-3'>
              <button
                onClick={() => setStep('register')}
                className='flex-1 bg-white border border-gray-200 text-[#2D2D2D] font-bold font-benzin uppercase py-3 rounded-full hover:bg-gray-50 transition-colors text-xs'
              >
                Назад
              </button>
              <button className='flex-1 bg-[#FFD600] text-[#2D2D2D] font-black font-benzin uppercase py-3 rounded-full shadow-lg hover:bg-[#ffe033] active:scale-95 transition-all text-xs'>
                Подтвердить
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
