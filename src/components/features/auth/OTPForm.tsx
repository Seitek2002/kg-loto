'use client';

import { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { AuthService } from '@/services/auth';
import { useAuthStore } from '@/store/auth';

interface OTPFormProps {
  flow: 'login' | 'register';
  phoneNumber: string;
  onBack: () => void;
  onSuccess: () => void;
}

export const OTPForm = ({
  flow,
  phoneNumber,
  onBack,
  onSuccess,
}: OTPFormProps) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const setTokens = useAuthStore((state) => state.setTokens);
  const isLogin = flow === 'login';

  // 🔥 ИСПРАВЛЕНО: Заменили phone_number на phoneNumber
  const verifyMutation = useMutation({
    mutationFn: (variables: {
      phoneNumber: string; // <-- здесь
      code: string;
      purpose?: string;
    }) => {
      if (isLogin) {
        return AuthService.loginVerify({
          phoneNumber: variables.phoneNumber, // <-- здесь
          code: variables.code,
        });
      }
      return AuthService.registerVerify({
        phoneNumber: variables.phoneNumber, // <-- и здесь
        code: variables.code,
        purpose: variables.purpose!,
      });
    },
    onSuccess: (response: any) => {
      if (isLogin) {
        const { accessToken, refreshToken } =
          response.data.data || response.data;
        if (accessToken) setTokens(accessToken, refreshToken);
      }
      onSuccess();
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Неверный код');
    },
  });

  // 🔥 ИСПРАВЛЕНО: Заменили phone_number на phoneNumber
  const resendMutation = useMutation({
    mutationFn: () => {
      if (isLogin) {
        return AuthService.loginPhone({ phoneNumber: phoneNumber }); // <-- здесь
      }
      return AuthService.registerPhone({ phoneNumber: phoneNumber }); // <-- здесь
    },
    onSuccess: () => setError('Код отправлен заново'),
  });

  const handleSubmit = (currentOtp?: string[]) => {
    const code = (currentOtp || otp).join('');
    if (code.length < 4) return;

    verifyMutation.mutate({
      phoneNumber: phoneNumber, // 🔥 ИСПРАВЛЕНО: Заменили phone_number на phoneNumber
      code,
      purpose: isLogin ? undefined : 'register',
    });
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 3) inputRefs.current[index + 1]?.focus();
    if (error) setError('');
    if (value && index === 3) handleSubmit(newOtp);
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className='flex flex-col text-center font-rubik'>
      <h2 className='text-3xl font-black font-benzin uppercase text-[#4B4B4B] mb-2'>
        КОД ПОДТВЕРЖДЕНИЯ
      </h2>
      <p className='text-[#6E6E6E] text-[13px] font-medium mb-8'>
        Введите код, отправленный на номер
        <br />
        <span className='text-[#F6C635] font-bold'>{phoneNumber}</span>
      </p>

      <div className='flex justify-center gap-3 mb-4'>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type='text'
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            disabled={verifyMutation.isPending}
            className={clsx(
              'w-[70px] h-[70px] rounded-2xl bg-white shadow-sm text-center font-black text-3xl text-[#4B4B4B] focus:ring-2 outline-none transition-all disabled:opacity-50',
              error && error !== 'Код отправлен заново'
                ? 'ring-2 ring-red-500'
                : 'focus:ring-[#F6C635]',
            )}
          />
        ))}
      </div>

      <div className='flex items-center justify-between px-2 mb-8'>
        <span
          className={clsx(
            'text-[10px] font-bold',
            error === 'Код отправлен заново'
              ? 'text-green-500'
              : 'text-red-500',
          )}
        >
          {error}
        </span>

        <span className='text-[10px] font-bold text-[#4B4B4B]'>
          Не получили код?{' '}
          <button
            onClick={() => resendMutation.mutate()}
            className='text-[#F6C635] hover:underline cursor-pointer disabled:opacity-50'
            disabled={resendMutation.isPending}
          >
            Отправить снова
          </button>
        </span>
      </div>

      <button
        onClick={() => handleSubmit()}
        disabled={verifyMutation.isPending || otp.join('').length < 4}
        className='w-full bg-[#F6C635] text-[#4B4B4B] font-black font-rubik uppercase py-4 rounded-full shadow-md hover:bg-[#E5B524] active:scale-95 transition-all text-[11px] disabled:opacity-60 disabled:active:scale-100 flex justify-center items-center'
      >
        {verifyMutation.isPending ? (
          <Loader2 className='animate-spin' size={16} />
        ) : (
          'ПОДТВЕРДИТЬ'
        )}
      </button>

      <button
        onClick={onBack}
        className='mt-4 text-[10px] font-bold text-gray-400 hover:text-[#4B4B4B] uppercase'
      >
        Изменить номер
      </button>
    </div>
  );
};
