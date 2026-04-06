'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

// 🔥 Импортируем наши новые компоненты для SMS-авторизации
import { OTPForm } from '@/components/features/auth/OTPForm';
import { PhoneForm } from '@/components/features/modal/PhoneForm';
import { RegisterDetailsForm } from '@/components/features/modal/RegisterDetailsForm';

type AuthFlow = 'login' | 'register';
type AuthStep = 'phone' | 'otp' | 'details';

export default function LoginPage() {
  const router = useRouter();
  const fetchUser = useAuthStore((state) => state.fetchUser);

  // Стейты, управляющие экранами (как в AuthModal)
  const [flow, setFlow] = useState<AuthFlow>('login');
  const [step, setStep] = useState<AuthStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Общий хендлер для успешного входа/регистрации
  const handleAuthSuccess = async () => {
    await fetchUser();
    router.push('/profile'); // Перекидываем в профиль
  };

  return (
    <div className='min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center p-4 font-rubik relative'>
      {/* Белая карточка по центру экрана */}
      <div className='bg-white rounded-4xl shadow-sm p-8 pt-12 w-full max-w-120'>
        {/* ШАГ 1: Ввод телефона (используется и для логина, и для регистрации) */}
        {step === 'phone' && (
          <PhoneForm
            flow={flow}
            onSwitchFlow={() =>
              setFlow(flow === 'login' ? 'register' : 'login')
            }
            onSuccess={(phone) => {
              setPhoneNumber(phone);
              setStep('otp');
            }}
          />
        )}

        {/* ШАГ 2: Ввод кода (OTP) */}
        {step === 'otp' && (
          <OTPForm
            flow={flow}
            phoneNumber={phoneNumber}
            onBack={() => setStep('phone')}
            onSuccess={() => {
              if (flow === 'login') {
                handleAuthSuccess(); // Логин завершен
              } else {
                setStep('details'); // Регистрация идет дальше
              }
            }}
          />
        )}

        {/* ШАГ 3: ФИО и ИНН (только для регистрации) */}
        {step === 'details' && flow === 'register' && (
          <RegisterDetailsForm
            phoneNumber={phoneNumber}
            onSuccess={handleAuthSuccess}
          />
        )}
      </div>
    </div>
  );
}
