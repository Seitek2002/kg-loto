'use client';

import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

import { AuthService } from '@/services/auth';
import { useAuthStore } from '@/store/auth';

interface OTPFormProps {
  phoneNumber: string;
  onBack: () => void;
  onSuccess: () => void;
  onResend: () => void;
  isResending: boolean;
}

export const OTPForm = ({
  phoneNumber,
  onBack,
  onSuccess,
  onResend,
  isResending,
}: OTPFormProps) => {
  // Храним 4 цифры в массиве
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(59); // Таймер на 59 сек

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const setTokens = useAuthStore((state) => state.setTokens);

  // Таймер обратного отсчета
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const verifyMutation = useMutation({
    mutationFn: AuthService.verify,
    onSuccess: (response) => {
      const data = response.data.data;
      if (data && data.accessToken) {
        setTokens(data.accessToken, data.refreshToken);
        onSuccess();
      } else {
        // Если токенов нет, возможно нужно делать login()
        // Пока просто закроем или покажем успех
        onSuccess();
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Неверный код');
    },
  });

  // Обработка ввода цифр
  const handleChange = (index: number, value: string) => {
    // Разрешаем только цифры
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); // Берем последнюю цифру
    setOtp(newOtp);

    // Авто-фокус на следующий инпут
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Очистка ошибки при вводе
    if (error) setError(null);
  };

  // Обработка Backspace
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Если поле пустое и нажали Backspace, идем назад
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const code = otp.join('');
    if (code.length < 4) {
      setError('Введите 4 цифры');
      return;
    }

    verifyMutation.mutate({
      phoneNumber,
      code,
      purpose: 'register', // Согласно Swagger
    });
  };

  // Форматирование времени (00:59)
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <>
      <h2 className='text-xl font-black font-benzin uppercase text-[#2D2D2D] mb-2'>
        Код подтверждения
      </h2>
      <p className='text-xs font-rubik font-medium text-gray-400 mb-6 px-4'>
        Мы отправили код на ваш номер <br />
        <span className='text-[#2D2D2D] font-bold'>{phoneNumber}</span>
      </p>

      {/* Инпуты */}
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
            className={clsx(
              'w-12 h-12 rounded-xl bg-[#F5F5F5] text-center font-black font-benzin text-xl focus:ring-2 outline-none transition-all',
              error ? 'ring-2 ring-red-500 bg-red-50' : 'focus:ring-[#FFD600]',
            )}
          />
        ))}
      </div>

      {/* Ошибка */}
      {error && (
        <div className='text-red-500 text-[10px] font-bold mb-4'>{error}</div>
      )}

      {/* Таймер / Отправить снова */}
      <div className='mb-8 text-[10px] font-medium font-rubik text-gray-400'>
        {timer > 0 ? (
          <span>Отправить снова через {formatTime(timer)}</span>
        ) : (
          <button
            onClick={() => {
              onResend();
              setTimer(59); // Сбрасываем таймер при клике
            }}
            disabled={isResending}
            className='text-[#FFD600] font-bold hover:underline disabled:opacity-50'
          >
            {isResending ? 'Отправка...' : 'Отправить код снова'}
          </button>
        )}
      </div>

      <div className='flex gap-3'>
        <button
          onClick={onBack}
          className='flex-1 bg-white border border-gray-200 text-[#2D2D2D] font-bold font-benzin uppercase py-3 rounded-full hover:bg-gray-50 transition-colors text-xs'
        >
          Назад
        </button>
        <button
          onClick={handleSubmit}
          disabled={verifyMutation.isPending}
          className='flex-1 bg-[#FFD600] text-[#2D2D2D] font-black font-benzin uppercase py-3 rounded-full shadow-lg hover:bg-[#ffe033] active:scale-95 transition-all text-xs flex justify-center items-center'
        >
          {verifyMutation.isPending ? (
            <Loader2 className='animate-spin' size={16} />
          ) : (
            'Подтвердить'
          )}
        </button>
      </div>
    </>
  );
};
