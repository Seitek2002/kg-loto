'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { PhoneForm } from './PhoneForm';
import { RegisterDetailsForm } from './RegisterDetailsForm';
import { useAuthStore } from '@/store/auth';
import { OTPForm } from '../auth/OTPForm';

type AuthFlow = 'login' | 'register';
type AuthStep = 'phone' | 'otp' | 'details';

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
  const [step, setStep] = useState<AuthStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');

  const fetchUser = useAuthStore((state) => state.fetchUser);

  // Сброс состояния при закрытии
  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep('phone');
      setPhoneNumber('');
    }, 300); // Ждем окончания анимации
  };

  const handleAuthSuccess = async () => {
    await fetchUser();
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className='max-w-[480px] p-0 rounded-[32px] overflow-hidden bg-[#F5F5F5]'
    >
      <div className='p-8 pt-12 relative'>
        {/* Кнопка закрытия (крестик) как на макетах */}
        <button
          onClick={handleClose}
          className='absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors'
        >
          <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
          >
            <path d='M18 6L6 18M6 6l12 12' />
          </svg>
        </button>

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
    </Modal>
  );
};
