'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { LoginForm } from '@/components/features/auth/LoginForm';
import { RegisterForm } from '@/components/features/auth/RegisterForm';
import { OTPForm } from '@/components/features/auth/OTPForm';
import { RegisterData } from '@/services/auth'; // 🔥 Изменили импорт

type AuthStep = 'login' | 'register' | 'otp' | 'forgot-password';

export default function LoginPage() {
  const router = useRouter();

  const [step, setStep] = useState<AuthStep>('login');

  const [phoneForOtp, setPhoneForOtp] = useState('');

  const handleSuccess = () => {
    router.push('/profile');
  };

  // 🔥 Поменяли тип принимаемых данных на RegisterData
  const handleRegisterSubmit = (data: RegisterData) => {
    setPhoneForOtp(data.phoneNumber);
    setStep('otp');
  };

  const [isResending, setIsResending] = useState(false);
  const handleResendOtp = async () => {
    setIsResending(true);
    setTimeout(() => setIsResending(false), 1500);
  };

  return (
    <div className='min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center p-4 font-rubik relative'>
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
