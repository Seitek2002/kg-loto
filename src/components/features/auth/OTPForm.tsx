'use client';

import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

import { AuthService } from '@/services/auth';
import { useAuthStore } from '@/store/auth';
import { Title } from '@/components/ui/Title';
import { Description } from '@/components/ui/Description';

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
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(59);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const setTokens = useAuthStore((state) => state.setTokens);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const verifyMutation = useMutation({
    mutationFn: AuthService.verify,
    onSuccess: (response) => {
      // 🔥 Правильная деструктуризация ответа (response.data - это объект ApiResponse, внутри которого есть поле data)
      const { accessToken, refreshToken } = response.data.data;

      if (accessToken) {
        setTokens(accessToken, refreshToken || '');
        onSuccess();
      } else {
        onSuccess();
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Неверный код');
    },
  });

  const handleSubmit = (currentOtp?: string[]) => {
    // Если передали текущий стейт (при автоотправке) - используем его, иначе берем из стейта
    const codeArray = currentOtp || otp;
    const code = codeArray.join('');

    if (code.length < 4) {
      setError('Введите 4 цифры');
      return;
    }

    verifyMutation.mutate({
      phoneNumber,
      code,
      purpose: 'register',
    });
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (error) setError(null);

    // 🔥 АВТООТПРАВКА: Если ввели последнюю цифру, сразу отправляем запрос
    if (value && index === 3) {
      handleSubmit(newOtp);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <>
      <div className='text-left w-full'>
        <Title>Код подтверждения</Title>
        <Description>
          Мы отправили код на ваш номер <br />
          <span className='text-[#2D2D2D] font-bold'>{phoneNumber}</span>
        </Description>
      </div>

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
            // 🔥 Блокируем инпуты во время загрузки, чтобы юзер не натыкал лишнего
            disabled={verifyMutation.isPending}
            className={clsx(
              'w-12 h-12 rounded-xl bg-white text-center font-black font-benzin text-xl focus:ring-2 outline-none transition-all disabled:opacity-50',
              error ? 'ring-2 ring-red-500 bg-red-50' : 'focus:ring-[#FFD600]',
            )}
          />
        ))}
      </div>

      {error && (
        <div className='text-red-500 text-[10px] font-bold mb-4'>{error}</div>
      )}

      <div className='mb-8 text-[10px] font-medium font-rubik text-gray-400'>
        {timer > 0 ? (
          <span>Отправить снова через {formatTime(timer)}</span>
        ) : (
          <button
            onClick={() => {
              onResend();
              setTimer(59);
              setOtp(['', '', '', '']); // Очищаем инпуты при повторной отправке
              inputRefs.current[0]?.focus(); // Фокус на первый инпут
            }}
            disabled={isResending}
            className='text-[#FFD600] font-bold hover:underline disabled:opacity-50'
          >
            {isResending ? 'Отправка...' : 'Отправить код снова'}
          </button>
        )}
      </div>

      <div className='flex gap-3 w-full'>
        <button
          onClick={onBack}
          className='flex-1 bg-white border border-gray-200 text-[#2D2D2D] font-bold uppercase py-3 rounded-full hover:bg-gray-50 transition-colors text-xs'
        >
          Назад
        </button>
        <button
          onClick={() => handleSubmit()}
          disabled={verifyMutation.isPending || otp.join('').length < 4} // Кнопка неактивна, пока не введут 4 цифры
          className='flex-1 bg-[#FFD600] text-[#2D2D2D] font-black uppercase py-3 rounded-full shadow-lg hover:bg-[#ffe033] active:scale-95 transition-all text-xs flex justify-center items-center disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none'
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
