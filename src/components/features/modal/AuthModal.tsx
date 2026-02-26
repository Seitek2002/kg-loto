'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Modal } from '@/components/ui/Modal';
import { LoginForm } from '@/components/features/auth/LoginForm';
import { RegisterForm } from '@/components/features/auth/RegisterForm';
import { OTPForm } from '@/components/features/auth/OTPForm';
import { AuthService, RegisterData } from '@/services/auth'; // 🔥 Импортируем RegisterData вместо RegisterSchema

type AuthStep = 'login' | 'register' | 'otp';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStep: AuthStep;
}

export const AuthModal = ({ isOpen, onClose, initialStep }: AuthModalProps) => {
  const [step, setStep] = useState<AuthStep>(initialStep);

  // 🔥 Храним уже готовые для бэкенда данные (RegisterData)
  const [registerData, setRegisterData] = useState<RegisterData | null>(null);

  const resendMutation = useMutation({
    mutationFn: AuthService.register,
    onSuccess: () => {
      console.log('Resend success');
    },
    onError: (e) => console.error(e),
  });

  // 🔥 Принимаем RegisterData (телефон и ФИО уже отформатированы в RegisterForm)
  const handleRegisterSuccess = (data: RegisterData) => {
    setRegisterData(data);
    setStep('otp');
  };

  const handleResend = () => {
    if (registerData) {
      // 🔥 Данные уже в идеальном формате, просто отправляем их заново!
      resendMutation.mutate(registerData);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className='max-w-120'>
      <div className='p-8 pt-10 bg-[#f5f5f5]'>
        {step === 'login' && (
          <LoginForm
            onRegisterClick={() => setStep('register')}
            onForgotPasswordClick={() => console.log('Forgot')}
            onSuccess={onClose}
          />
        )}

        {step === 'register' && (
          <RegisterForm
            onLoginClick={() => setStep('login')}
            onSubmit={handleRegisterSuccess}
          />
        )}

        {step === 'otp' && registerData && (
          <OTPForm
            phoneNumber={registerData.phoneNumber}
            onBack={() => setStep('register')}
            onSuccess={onClose}
            onResend={handleResend}
            isResending={resendMutation.isPending}
          />
        )}
      </div>
    </Modal>
  );
};
