'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { PhoneForm } from './PhoneForm';
import { RegisterForm, RegisterData } from './RegisterForm'; // 🔥 Новый импорт
import { useAuthStore } from '@/store/auth';
import { OTPForm } from '../auth/OTPForm';
import { useMutation } from '@tanstack/react-query';
import { AuthService } from '@/services/auth';
import { Loader2, X } from 'lucide-react';

type AuthFlow = 'login' | 'register';
type AuthStep = 'form' | 'otp'; // 🔥 Оставили только 2 шага

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFlow?: AuthFlow;
}

export const AuthModal = ({
  isOpen,
  onClose,
  initialFlow = 'login',
}: AuthModalProps) => {
  const [flow, setFlow] = useState<AuthFlow>(initialFlow);
  const [step, setStep] = useState<AuthStep>('form');

  // Хранилища данных
  const [phoneNumber, setPhoneNumber] = useState('');
  const [registerData, setRegisterData] = useState<RegisterData | null>(null);

  const fetchUser = useAuthStore((state) => state.fetchUser);
  const setTokens = useAuthStore((state) => state.setTokens);

  // Мутация для тихого создания аккаунта ПОСЛЕ проверки OTP
  const completeRegMutation = useMutation({
    mutationFn: AuthService.registerComplete,
    onSuccess: async (response: any) => {
      const { accessToken, refreshToken } = response.data.data || response.data;
      if (accessToken) setTokens(accessToken, refreshToken);
      await fetchUser();
      handleClose(); // Закрываем, все готово!
    },
    onError: (error) => {
      console.error('Ошибка при создании аккаунта:', error);
      // Можно показать алерт или сбросить стейт
    },
  });

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep('form');
      setPhoneNumber('');
      setRegisterData(null);
    }, 300);
  };

  const handleAuthSuccess = async () => {
    await fetchUser();
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className='max-w-[480px] p-0 rounded-4xl overflow-hidden bg-[#F5F5F5]'
    >
      <div className='p-8 pt-12 relative'>
        <button
          onClick={handleClose}
          className='absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors z-20'
        >
          <X size={24} />
        </button>

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
              setRegisterData(data); // Сохраняем ФИО, ИНН и Паспорта в памяти
              setPhoneNumber(data.phoneNumber); // Запоминаем телефон для OTP
              setStep('otp'); // Переключаем на ввод кода
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
                  // 🔥 Если это регистрация, OTP верный!
                  // Теперь тихо отправляем все сохраненные данные на сервер:
                  if (registerData) {
                    completeRegMutation.mutate({
                      phoneNumber: registerData.phoneNumber,
                      fullName: registerData.fullName,
                      inn: registerData.inn,
                      // passportFront: ... (в будущем, когда настроим загрузку)
                    });
                  }
                }
              }}
            />

            {/* Экран загрузки поверх OTP, пока аккаунт создается на сервере */}
            {completeRegMutation.isPending && (
              <div className='absolute inset-0 bg-[#F5F5F5]/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-2xl'>
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
    </Modal>
  );
};
