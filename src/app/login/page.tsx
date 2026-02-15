'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';

// Подключаем твои готовые компоненты
// Проверь правильность путей импорта!
import { LoginForm } from '@/components/features/auth/LoginForm';
import { RegisterForm } from '@/components/features/auth/RegisterForm';
import { OTPForm } from '@/components/features/auth/OTPForm';
import { RegisterSchema } from '@/lib/schemas';

type AuthStep = 'login' | 'register' | 'otp' | 'forgot-password';

export default function LoginPage() {
  const router = useRouter();

  // Состояние текущего шага
  const [step, setStep] = useState<AuthStep>('login');

  // Храним номер телефона для передачи из шага регистрации в шаг OTP
  const [phoneForOtp, setPhoneForOtp] = useState('');

  // Обработчики успешной авторизации
  const handleSuccess = () => {
    // Перекидываем на главную или в профиль
    router.push('/profile');
  };

  const handleRegisterSubmit = (data: RegisterSchema) => {
    setPhoneForOtp(data.phoneNumber);
    setStep('otp'); // Переключаем на ввод кода
  };

  // Имитация повторной отправки (если у тебя есть метод в AuthService, вызови его здесь)
  const [isResending, setIsResending] = useState(false);
  const handleResendOtp = async () => {
    setIsResending(true);
    // await AuthService.resend(phoneForOtp);
    setTimeout(() => setIsResending(false), 1500);
  };

  return (
    <div className='min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center p-4 font-rubik relative'>

      {/* Карточка авторизации */}
        {step === 'login' && (
          <LoginForm
            onRegisterClick={() => setStep('register')}
            onForgotPasswordClick={() => setStep('forgot-password')}
            onSuccess={handleSuccess}
          />
        )}

        {step === 'register' && (
          <RegisterForm
            onLoginClick={() => setStep('login')}
            onSubmit={handleRegisterSubmit}
          />
        )}

        {step === 'otp' && (
          <OTPForm
            phoneNumber={phoneForOtp}
            onBack={() => setStep('register')}
            onSuccess={handleSuccess}
            onResend={handleResendOtp}
            isResending={isResending}
          />
        )}

        {step === 'forgot-password' && (
          <div className='text-left'>
            <h2 className='text-2xl font-black font-benzin uppercase text-[#2D2D2D] mb-4'>
              Восстановление
            </h2>
            <p className='text-xs font-rubik font-medium text-gray-500 mb-6'>
              Функция восстановления пароля находится в разработке. Пожалуйста,
              обратитесь в поддержку.
            </p>
            <button
              onClick={() => setStep('login')}
              className='w-full bg-[#FFD600] text-[#2D2D2D] font-black font-benzin uppercase py-4 rounded-full shadow-lg hover:bg-[#ffe033] transition-all text-[10px]'
            >
              Вернуться ко входу
            </button>
          </div>
        )}
    </div>
  );
}
