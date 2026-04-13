'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useMutation } from '@tanstack/react-query';
import { AuthService } from '@/services/auth';
import { Loader2 } from 'lucide-react';

// Импортируем наши компоненты
import { OTPForm } from '@/components/features/auth/OTPForm';
import { PhoneForm } from '@/components/features/modal/PhoneForm'; // Проверь правильность путей
import {
  RegisterForm,
  RegisterData,
} from '@/components/features/modal/RegisterForm';

type AuthFlow = 'login' | 'register';
type AuthStep = 'form' | 'otp'; // 🔥 Теперь только 2 шага, как в модалке

export default function LoginPage() {
  const router = useRouter();
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const setTokens = useAuthStore((state) => state.setTokens);

  // Стейты, управляющие экранами
  const [flow, setFlow] = useState<AuthFlow>('login');
  const [step, setStep] = useState<AuthStep>('form');

  // Хранилища данных
  const [phoneNumber, setPhoneNumber] = useState('');
  const [registerData, setRegisterData] = useState<RegisterData | null>(null);

  // Общий хендлер для успешного входа
  const handleAuthSuccess = async () => {
    await fetchUser();
    router.push('/profile'); // Перекидываем в профиль
  };

  // Мутация для тихого создания аккаунта ПОСЛЕ проверки OTP
  const completeRegMutation = useMutation({
    mutationFn: AuthService.registerComplete,
    onSuccess: async (response: any) => {
      const { accessToken, refreshToken } = response.data.data || response.data;
      if (accessToken) setTokens(accessToken, refreshToken);
      await handleAuthSuccess();
    },
    onError: (error) => {
      console.error('Ошибка при создании аккаунта:', error);
    },
  });

  return (
    <div className='min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center p-4 font-rubik relative'>
      {/* Белая карточка по центру экрана */}
      <div className='bg-white rounded-4xl shadow-sm p-8 pt-12 w-full max-w-120 relative overflow-hidden'>
        {/* ШАГ 1: ЛОГИН (Старая форма) */}
        {step === 'form' && flow === 'login' && (
          <PhoneForm
            flow={flow}
            onSwitchFlow={() => setFlow('register')}
            onSuccess={(phone) => {
              setPhoneNumber(phone);
              setStep('otp');
            }}
          />
        )}

        {/* ШАГ 1: РЕГИСТРАЦИЯ (Новая огромная форма) */}
        {step === 'form' && flow === 'register' && (
          <RegisterForm
            onSwitchFlow={() => setFlow('login')}
            onSuccess={(data) => {
              setRegisterData(data); // Сохраняем ФИО, ИНН и т.д.
              setPhoneNumber(data.phoneNumber); // Запоминаем телефон для OTP
              setStep('otp'); // Переходим к коду
            }}
          />
        )}

        {/* ШАГ 2: Ввод кода (OTP) */}
        {step === 'otp' && (
          <div className='relative'>
            <OTPForm
              flow={flow}
              phoneNumber={phoneNumber}
              onBack={() => setStep('form')}
              onSuccess={() => {
                if (flow === 'login') {
                  handleAuthSuccess(); // Обычный логин
                } else {
                  // Если это регистрация, OTP верный!
                  // Тихо отправляем все сохраненные данные на сервер
                  if (registerData) {
                    completeRegMutation.mutate({
                      phoneNumber: registerData.phoneNumber,
                      fullName: registerData.fullName,
                      inn: registerData.inn,
                      // passportFront: ... (в будущем)
                    });
                  }
                }
              }}
            />

            {/* Экран загрузки поверх OTP, пока аккаунт создается на сервере */}
            {completeRegMutation.isPending && (
              <div className='absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-2xl'>
                <Loader2
                  className='animate-spin text-[#F6C635] mb-3'
                  size={36}
                />
                <p className='text-sm font-bold text-[#4B4B4B] font-rubik'>
                  Создаем аккаунт...
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
