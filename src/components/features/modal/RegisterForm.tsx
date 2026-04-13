'use client';

import { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Loader2, CloudUpload, FileCheck } from 'lucide-react';
import Image from 'next/image';
import { AuthService } from '@/services/auth';
import api from '@/services/api/apiClient';

export interface RegisterData {
  phoneNumber: string;
  fullName: string;
  inn: string;
  passportFront?: File | null;
  passportBack?: File | null;
}

interface RegisterFormProps {
  onSuccess: (data: RegisterData) => void;
  onSwitchFlow: () => void;
}

interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

// 🔥 РУБИЛЬНИК ПАСПОРТОВ: Пока включен для тестов верстки
const IS_PASSPORT_REQUIRED = false;

export const RegisterForm = ({
  onSuccess,
  onSwitchFlow,
}: RegisterFormProps) => {
  // Стейты для телефона (как в PhoneForm)
  const [phone, setPhone] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  // Остальные стейты формы
  const [fullName, setFullName] = useState('');
  const [inn, setInn] = useState('');
  const [isAdult, setIsAdult] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [error, setError] = useState('');

  const [passportFront, setPassportFront] = useState<File | null>(null);
  const [passportBack, setPassportBack] = useState<File | null>(null);

  // Загружаем список стран
  const { data: countries = [], isLoading: isCountriesLoading } = useQuery({
    queryKey: ['phone-countries'],
    queryFn: async () => {
      const { data } = await api.get('/meta/phone-countries/');
      return data.data as Country[];
    },
  });

  // Устанавливаем страну по умолчанию (Кыргызстан)
  useEffect(() => {
    if (countries.length > 0 && !selectedCountry) {
      const defaultCountry =
        countries.find((c) => c.code === 'KG') || countries[0];
      const timer = setTimeout(() => setSelectedCountry(defaultCountry), 0);
      return () => clearTimeout(timer);
    }
  }, [countries, selectedCountry]);

  // Мутация ТОЛЬКО для отправки СМС (принимает уже отформатированный номер)
  const sendSmsMutation = useMutation({
    mutationFn: (formattedPhone: string) =>
      AuthService.registerPhone({ phoneNumber: formattedPhone }),
    onSuccess: (_, formattedPhone) => {
      // Если СМС ушла успешно, передаем все данные наверх в модалку
      onSuccess({
        phoneNumber: formattedPhone,
        fullName,
        inn,
        passportFront,
        passportBack,
      });
    },
    onError: (err: any) => {
      setError(
        err.response?.data?.message || 'Ошибка отправки СМС. Проверьте номер.',
      );
    },
  });

  const isFormValid =
    phone.length >= 6 && // Минимальная длина номера без кода страны
    selectedCountry !== null &&
    fullName.trim() &&
    inn.length >= 14 &&
    isAdult &&
    isAgreed &&
    (!IS_PASSPORT_REQUIRED || (passportFront && passportBack));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !selectedCountry) return;

    // Форматируем номер перед отправкой (убираем лишние нули и добавляем код страны)
    const cleanPhone = phone.replace(/[^0-9]/g, '').replace(/^0+/, '');
    const formattedPhone = `${selectedCountry.dialCode}${cleanPhone}`;

    // Запускаем отправку СМС с готовым номером
    sendSmsMutation.mutate(formattedPhone);
  };

  const FileUploadBox = ({
    label,
    file,
    setFile,
  }: {
    label: string;
    file: File | null;
    setFile: (file: File | null) => void;
  }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
    };

    return (
      <div className='flex flex-col flex-1'>
        <span className='block text-[10px] font-bold text-[#4B4B4B] mb-2 pl-1'>
          {label}
        </span>
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-4 h-[90px] rounded-xl border-2 border-dashed cursor-pointer transition-all bg-white ${file ? 'border-[#F58220] bg-orange-50/50' : 'border-[#F58220] hover:bg-gray-50'}`}
        >
          {file ? (
            <>
              <FileCheck className='text-[#F58220] mb-2' size={24} />
              <span className='text-[10px] font-medium text-[#4B4B4B] text-center line-clamp-1 px-2'>
                {file.name}
              </span>
            </>
          ) : (
            <>
              <CloudUpload className='text-[#F58220] mb-2' size={24} />
              <span className='text-[10px] font-medium text-gray-500'>
                Выберите файл
              </span>
            </>
          )}
          <input
            type='file'
            ref={fileInputRef}
            onChange={handleFileChange}
            accept='image/jpeg, image/png, image/webp'
            className='hidden'
          />
        </div>
      </div>
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col text-center font-rubik'
    >
      <h2 className='text-3xl font-black font-benzin uppercase text-[#4B4B4B] mb-2'>
        РЕГИСТРАЦИЯ
      </h2>
      <p className='text-[#6E6E6E] text-[13px] font-medium mb-6'>
        Заполните данные, чтобы продолжить
      </p>

      {/* 🔥 КРАСИВОЕ ПОЛЕ НОМЕРА ТЕЛЕФОНА С ВЫБОРОМ СТРАНЫ */}
      <div className='text-left mb-4'>
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
      </div>

      <div className='text-left mb-4'>
        <label className='block text-[10px] font-bold text-[#4B4B4B] mb-2 pl-1'>
          ФИО
        </label>
        <input
          type='text'
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder='Асанов Асан'
          className='w-full bg-white rounded-[20px] shadow-sm px-5 py-4 font-bold font-rubik text-[13px] text-[#4B4B4B] outline-none focus:ring-2 focus:ring-[#F6C635] transition-all placeholder:text-gray-400 placeholder:font-medium'
        />
      </div>

      <div className='text-left mb-6'>
        <label className='block text-[10px] font-bold text-[#4B4B4B] mb-2 pl-1'>
          ИНН
        </label>
        <input
          type='text'
          value={inn}
          onChange={(e) => setInn(e.target.value.replace(/[^0-9]/g, ''))}
          placeholder='12345678910111'
          maxLength={14}
          className='w-full bg-white rounded-[20px] shadow-sm px-5 py-4 font-bold font-rubik text-[13px] text-[#4B4B4B] outline-none focus:ring-2 focus:ring-[#F6C635] transition-all placeholder:text-gray-400 placeholder:font-medium'
        />
      </div>

      {IS_PASSPORT_REQUIRED && (
        <div className='flex flex-row gap-3 md:gap-4 mb-6 text-left'>
          <FileUploadBox
            label='Лицевая сторона'
            file={passportFront}
            setFile={setPassportFront}
          />
          <FileUploadBox
            label='Задняя сторона'
            file={passportBack}
            setFile={setPassportBack}
          />
        </div>
      )}

      <div className='flex flex-col gap-4 text-left mb-6 pl-1'>
        <label className='flex items-center gap-3 cursor-pointer'>
          <input
            type='checkbox'
            checked={isAdult}
            onChange={(e) => setIsAdult(e.target.checked)}
            className='w-5 h-5 accent-[#4B4B4B] rounded shrink-0'
          />
          <span className='text-[11px] font-bold text-[#4B4B4B]'>
            Мне есть 18 лет
          </span>
        </label>
        <label className='flex items-start gap-3 cursor-pointer'>
          <input
            type='checkbox'
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
            className='w-5 h-5 accent-[#4B4B4B] rounded shrink-0 mt-0.5'
          />
          <span className='text-[10px] font-medium text-gray-500 leading-tight'>
            Согласен с{' '}
            <a href='#' className='underline hover:text-[#4B4B4B]'>
              офертой
            </a>{' '}
            /{' '}
            <a href='#' className='underline hover:text-[#4B4B4B]'>
              правилами
            </a>
          </span>
        </label>
      </div>

      {error && (
        <p className='text-red-500 text-[10px] font-bold mb-4'>{error}</p>
      )}

      <button
        type='submit'
        disabled={sendSmsMutation.isPending || !isFormValid}
        className='w-full bg-[#F6C635] text-[#2D2D2D] font-black font-rubik uppercase py-4 rounded-full shadow-md hover:bg-[#E5B524] active:scale-95 transition-all text-[11px] disabled:opacity-60 disabled:active:scale-100 flex justify-center items-center mb-4 cursor-pointer'
      >
        {sendSmsMutation.isPending ? (
          <Loader2 className='animate-spin' size={16} />
        ) : (
          'ПРОДОЛЖИТЬ'
        )}
      </button>

      {/* Кнопка возврата к логину */}
      <button
        type='button'
        onClick={onSwitchFlow}
        className='text-xs font-bold text-gray-500 hover:text-[#2D2D2D] transition-colors'
      >
        Уже есть аккаунт? Войти
      </button>
    </form>
  );
};
