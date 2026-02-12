'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query'; // Добавляем мутацию сюда
import { Modal } from '@/components/ui/Modal';
import { LoginForm } from '@/components/features/auth/LoginForm';
import { RegisterForm } from '@/components/features/auth/RegisterForm';
import { OTPForm } from '@/components/features/auth/OTPForm';
import { AuthService } from '@/services/auth';
import { RegisterSchema } from '@/lib/schemas'; // Импортируем тип

type AuthStep = 'login' | 'register' | 'otp';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStep: AuthStep;
}

export const AuthModal = ({ isOpen, onClose, initialStep }: AuthModalProps) => {
  const [step, setStep] = useState<AuthStep>(initialStep);

  const [registerData, setRegisterData] = useState<RegisterSchema | null>(null);

  const resendMutation = useMutation({
    mutationFn: AuthService.register,
    onSuccess: () => {
      console.log('Resend success');
    },
    onError: (e) => console.error(e),
  });

  const handleRegisterSuccess = (data: RegisterSchema) => {
    setRegisterData(data);
    setStep('otp');
  };

  const handleResend = () => {
    if (registerData) {
      let phone = registerData.phoneNumber;
      if (!phone.startsWith('+')) {
        phone = `+996${phone.replace(/^0+/, '')}`;
      }

      resendMutation.mutate({
        ...registerData,
        phoneNumber: phone,
        inn: registerData.inn || undefined,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className='max-w-120'>
      <div className='p-8 pt-10'>
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
            onResend={handleResend} // 🔥 Передаем функцию
            isResending={resendMutation.isPending} // 🔥 Передаем состояние загрузки
          />
        )}
      </div>
    </Modal>
  );
};
