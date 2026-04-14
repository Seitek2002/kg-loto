'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { AuthService } from '@/services/auth';
import api from '@/services/api/apiClient';

interface PhoneFormProps {
  flow: 'login' | 'register';
  onSwitchFlow: () => void;
  onSuccess: (phone: string) => void;
}

interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

export const PhoneForm = ({
  flow,
  onSwitchFlow,
  onSuccess,
}: PhoneFormProps) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const isLogin = flow === 'login';

  const { data: countries = [], isLoading: isCountriesLoading } = useQuery({
    queryKey: ['phone-countries'],
    queryFn: async () => {
      const { data } = await api.get('/meta/phone-countries/');
      return data.data as Country[];
    },
  });

  useEffect(() => {
    if (countries.length > 0 && !selectedCountry) {
      const defaultCountry =
        countries.find((c) => c.code === 'KG') || countries[0];

      // Оборачиваем в setTimeout, чтобы избежать ошибки каскадного рендера
      const timer = setTimeout(() => setSelectedCountry(defaultCountry), 0);
      return () => clearTimeout(timer);
    }
  }, [countries, selectedCountry]);

  const mutation = useMutation({
    mutationFn: isLogin ? AuthService.loginPhone : AuthService.registerPhone,
    onSuccess: (_, variables) => {
      // 🔥 ИСПРАВЛЕНО: phone_number -> phoneNumber
      onSuccess(variables.phoneNumber);
    },
    onError: (err: any) => {
      setError(
        err.response?.data?.message || 'Произошла ошибка. Попробуйте еще раз.',
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 6) {
      setError('Введите корректный номер');
      return;
    }
    if (!selectedCountry) return;

    const cleanPhone = phone.replace(/[^0-9]/g, '').replace(/^0+/, '');
    const formattedPhone = `${selectedCountry.dialCode}${cleanPhone}`;

    // 🔥 ИСПРАВЛЕНО: phone_number -> phoneNumber
    mutation.mutate({ phoneNumber: formattedPhone });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col text-center font-rubik'
    >
      <h2 className='text-3xl font-black font-benzin uppercase text-[#4B4B4B] mb-2'>
        {isLogin ? 'ВХОД' : 'РЕГИСТРАЦИЯ'}
      </h2>
      <p className='text-[#6E6E6E] text-[13px] font-medium mb-8'>
        {isLogin
          ? 'Заполните данные для входа в аккаунт'
          : 'На ваш номер будет отправлен код OTP'}
      </p>

      <div className='text-left mb-6'>
        <label className='block text-[10px] font-bold text-[#4B4B4B] mb-2 pl-1'>
          Номер телефона
        </label>

        <div className='relative flex items-center bg-white rounded-[20px] shadow-sm overflow-visible z-50'>
          <div
            className='flex items-center gap-2 pl-4 pr-2 py-4 border-r border-gray-100 bg-white cursor-pointer select-none rounded-l-[20px] hover:bg-gray-50 transition-colors'
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className='text-[10px] text-gray-400'>▼</span>

            {isCountriesLoading || !selectedCountry ? (
              <div className='flex items-center gap-2'>
                <div className='w-5 h-3.5 bg-gray-200 animate-pulse rounded-sm'></div>
                <div className='w-8 h-4 bg-gray-200 animate-pulse rounded-sm'></div>
              </div>
            ) : (
              <>
                <div className='w-5 h-3.5 relative rounded-sm overflow-hidden shrink-0 border border-gray-100'>
                  <Image
                    src={selectedCountry.flag}
                    alt={selectedCountry.code}
                    fill
                    className='object-cover'
                    unoptimized
                  />
                </div>
                <div className='flex items-center font-bold text-[13px] text-[#4B4B4B] ml-1 shrink-0'>
                  {selectedCountry.dialCode}
                </div>
              </>
            )}
          </div>

          {isDropdownOpen && (
            <>
              <div
                className='fixed inset-0 z-40'
                onClick={() => setIsDropdownOpen(false)}
              ></div>

              <div className='absolute top-[105%] left-0 w-60 bg-white border border-gray-100 shadow-xl rounded-2xl z-50 max-h-55 overflow-y-auto py-2'>
                {countries.map((country) => (
                  <div
                    key={country.code}
                    className='flex items-center gap-3 px-4 py-2.5 hover:bg-[#F9F9F9] cursor-pointer transition-colors'
                    onClick={() => {
                      setSelectedCountry(country);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <div className='w-6 h-4 relative rounded-sm overflow-hidden shrink-0 border border-gray-100'>
                      <Image
                        src={country.flag}
                        alt={country.code}
                        fill
                        className='object-cover'
                        unoptimized
                      />
                    </div>
                    <span className='text-[13px] font-bold text-[#4B4B4B] w-12'>
                      {country.dialCode}
                    </span>
                    <span className='text-[13px] font-medium text-gray-500 truncate'>
                      {country.name}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          <input
            type='tel'
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value.replace(/[^0-9]/g, ''));
              setError('');
            }}
            placeholder='500 111 000'
            className='w-full py-4 px-3 font-bold font-rubik text-[13px] text-[#4B4B4B] outline-none placeholder:text-gray-300 placeholder:font-medium bg-transparent'
            maxLength={12}
          />
        </div>

        {error && (
          <p className='text-red-500 text-[10px] font-bold mt-2 ml-2'>
            {error}
          </p>
        )}
      </div>

      <button
        type='submit'
        disabled={mutation.isPending || phone.length < 6}
        className='w-full bg-[#F6C635] text-[#4B4B4B] font-black font-rubik uppercase py-4 rounded-full shadow-md hover:bg-[#E5B524] active:scale-95 transition-all text-[11px] disabled:opacity-60 disabled:active:scale-100 flex justify-center items-center'
      >
        {mutation.isPending ? (
          <Loader2 className='animate-spin' size={16} />
        ) : (
          'ПРОДОЛЖИТЬ'
        )}
      </button>

      <button
        type='button'
        onClick={onSwitchFlow}
        className='mt-6 text-[11px] font-bold text-gray-400 hover:text-[#4B4B4B] transition-colors uppercase'
      >
        {isLogin
          ? 'Нет аккаунта? Зарегистрироваться'
          : 'Уже есть аккаунт? Войти'}
      </button>
    </form>
  );
};
