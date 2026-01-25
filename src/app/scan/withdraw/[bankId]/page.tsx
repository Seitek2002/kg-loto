'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/ui/PageHeader';
import { Loader2, ArrowRight } from 'lucide-react';

export default function WithdrawDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bankId = params.bankId as string;

  // Состояния
  const [step, setStep] = useState<'phone' | 'sms' | 'success'>('phone');
  const [phone, setPhone] = useState('+996 ');
  const [otp, setOtp] = useState(['', '', '', '']); // 4 цифры кода
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(59);

  // Таймер для СМС
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'sms' && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Хендлер отправки телефона
  const handlePhoneSubmit = () => {
    setIsLoading(true);
    // Имитация запроса
    setTimeout(() => {
      setIsLoading(false);
      setStep('sms');
    }, 1500);
  };

  // Хендлер ввода СМС
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Только 1 символ
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Авто-фокус на следующий инпут
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Хендлер подтверждения СМС
  const handleSmsSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('success'); // Или редирект на главную
      // router.push('/profile');
    }, 1500);
  };

  // Форматирование имени банка для заголовка
  const bankName = bankId.charAt(0).toUpperCase() + bankId.slice(1);

  return (
    <div className='min-h-screen bg-[#F9F9F9] px-4 pt-2 pb-10'>
      <PageHeader title={bankName} />

      {/* --- ШАГ 1: ТЕЛЕФОН --- */}
      {step === 'phone' && (
        <div className='mt-8 flex flex-col gap-6 animate-in fade-in slide-in-from-right-8 duration-300'>
          <div>
            <h2 className='text-sm font-bold font-benzin uppercase text-[#2D2D2D] mb-1'>
              Номер телефона
            </h2>
            <div className='flex gap-2 mt-2'>
              {/* Флаг */}
              <div className='w-16 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-xl'>
                🇰🇬
              </div>
              <input
                type='tel'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className='flex-1 h-14 px-5 rounded-2xl bg-white text-sm font-bold text-gray-900 shadow-sm border-none outline-none font-rubik'
              />
            </div>
          </div>

          <div>
            <h2 className='text-sm font-bold font-benzin uppercase text-[#2D2D2D] mb-1'>
              Сумма пополнения:{' '}
              <span className='text-green-500'>10 000 сом</span>
            </h2>
          </div>

          <button
            onClick={handlePhoneSubmit}
            disabled={isLoading}
            className='mt-4 w-full h-14 bg-[#FFD600] text-black rounded-full font-benzin font-bold text-sm uppercase tracking-wider hover:bg-[#FFC000] active:scale-[0.98] transition-all shadow-lg flex items-center justify-center'
          >
            {isLoading ? <Loader2 className='animate-spin' /> : 'Продолжить'}
          </button>
        </div>
      )}

      {/* --- ШАГ 2: СМС --- */}
      {step === 'sms' && (
        <div className='mt-8 flex flex-col gap-6 animate-in fade-in slide-in-from-right-8 duration-300'>
          <div className='text-center mb-4'>
            <h2 className='text-sm font-bold font-benzin uppercase text-[#2D2D2D] mb-2'>
              Введите код из СМС
            </h2>
            <p className='text-xs text-gray-400 font-rubik max-w-62.5 mx-auto'>
              Мы отправили код подтверждения на номер <br />
              <span className='text-[#FFD600] font-bold'>{phone}</span>
            </p>
          </div>

          {/* OTP Инпуты */}
          <div className='flex justify-center gap-3'>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type='text'
                inputMode='numeric'
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                className='w-14 h-16 rounded-2xl bg-white shadow-sm text-center text-2xl font-black font-benzin text-[#2D2D2D] outline-none focus:ring-2 focus:ring-[#FFD600] transition-all'
              />
            ))}
          </div>

          <div className='text-center'>
            <p className='text-[10px] font-bold text-gray-400 font-benzin uppercase'>
              {timer > 0 ? (
                `Отправить снова (${timer < 10 ? `0${timer}` : timer})`
              ) : (
                <button
                  onClick={() => setTimer(59)}
                  className='text-[#FFD600] hover:underline'
                >
                  Отправить код еще раз
                </button>
              )}
            </p>
          </div>

          <button
            onClick={handleSmsSubmit}
            disabled={isLoading}
            className='mt-4 w-full h-14 bg-[#FFD600] text-black rounded-full font-benzin font-bold text-sm uppercase tracking-wider hover:bg-[#FFC000] active:scale-[0.98] transition-all shadow-lg flex items-center justify-center'
          >
            {isLoading ? <Loader2 className='animate-spin' /> : 'Подтвердить'}
          </button>
        </div>
      )}

      {/* --- ШАГ 3: УСПЕХ --- */}
      {step === 'success' && (
        <div className='mt-20 flex flex-col items-center animate-in zoom-in-95 duration-500'>
          <div className='w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-500 shadow-lg shadow-green-100'>
            <svg
              width='40'
              height='40'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='3'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <polyline points='20 6 9 17 4 12'></polyline>
            </svg>
          </div>
          <h2 className='text-xl font-black font-benzin uppercase text-[#2D2D2D] mb-2 text-center'>
            Успешно!
          </h2>
          <p className='text-sm text-gray-500 font-rubik text-center max-w-xs mb-10'>
            Деньги отправлены на ваш счет. Ожидайте поступления.
          </p>

          <button
            onClick={() => router.push('/profile')}
            className='w-full h-14 bg-white border-2 border-gray-100 text-[#2D2D2D] rounded-full font-benzin font-bold text-sm uppercase tracking-wider hover:bg-gray-50 flex items-center justify-center gap-2'
          >
            В профиль <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
