"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";

import { useMutation, useQuery } from "@tanstack/react-query";
import { CloudUpload, FileCheck, Loader2 } from "lucide-react";

import { authApi } from "@/entities/user/api/authApi";

import api from "@/shared/api/apiClient";
import { Input } from "@/shared/ui/Input";

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

const IS_PASSPORT_REQUIRED = false;

export const RegisterForm = ({
  onSuccess,
  onSwitchFlow,
}: RegisterFormProps) => {
  const [phone, setPhone] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const [fullName, setFullName] = useState("");
  const [inn, setInn] = useState("");
  const [isAdult, setIsAdult] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [error, setError] = useState("");

  const [passportFront, setPassportFront] = useState<File | null>(null);
  const [passportBack, setPassportBack] = useState<File | null>(null);

  const { data: countries = [], isLoading: isCountriesLoading } = useQuery({
    queryKey: ["phone-countries"],
    queryFn: async () => {
      const { data } = await api.get("/meta/phone-countries/");
      return data.data as Country[];
    },
  });

  useEffect(() => {
    if (countries.length > 0 && !selectedCountry) {
      const defaultCountry =
        countries.find((c) => c.code === "KG") || countries[0];
      setTimeout(() => setSelectedCountry(defaultCountry), 0);
    }
  }, [countries, selectedCountry]);

  const sendSmsMutation = useMutation({
    mutationFn: (formattedPhone: string) =>
      authApi.registerPhone({ phoneNumber: formattedPhone }),
    onSuccess: (_, formattedPhone) => {
      onSuccess({
        phoneNumber: formattedPhone,
        fullName,
        inn,
        passportFront,
        passportBack,
      });
    },
    onError: (err: any) => {
      // 🔥 Вытаскиваем ошибку бэкенда
      const backendErrorDetail = err.response?.data?.errors?.[0]?.detail;
      const backendMessage = err.response?.data?.message;

      // 🔥 АВТО-ПЕРЕКЛЮЧЕНИЕ НА ЛОГИН
      // Если юзер уже есть в базе, просто кидаем его на форму входа
      if (backendErrorDetail === "Пользователь уже существует") {
        setError(""); // Убираем красную надпись
        onSwitchFlow(); // Переключаем на логин
        return; // Тормозим выполнение
      }

      // Если это другая ошибка (например, слишком частые запросы)
      setError(
        backendErrorDetail ||
          backendMessage ||
          "Ошибка отправки СМС. Проверьте номер.",
      );
    },
  });

  const isFormValid =
    phone.length >= 6 &&
    selectedCountry &&
    fullName.trim() &&
    inn.length >= 14 &&
    isAdult &&
    isAgreed &&
    (!IS_PASSPORT_REQUIRED || (passportFront && passportBack));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !selectedCountry) return;
    const cleanPhone = phone.replace(/[^0-9]/g, "").replace(/^0+/, "");
    const formattedPhone = `${selectedCountry.dialCode}${cleanPhone}`;
    sendSmsMutation.mutate(formattedPhone);
  };

  // Компонент селектора страны для передачи в iconLeft
  const CountrySelector = () => (
    <div className="relative">
      <div
        className="flex items-center gap-2 pr-3 border-r border-gray-200 cursor-pointer select-none hover:opacity-80 transition-opacity"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <span className="text-[10px] text-gray-400">▼</span>
        {isCountriesLoading || !selectedCountry ? (
          <div className="w-5 h-3.5 bg-gray-200 animate-pulse rounded-sm"></div>
        ) : (
          <>
            <div className="w-5 h-3.5 relative rounded-sm overflow-hidden shrink-0 border border-gray-100">
              <Image
                src={selectedCountry.flag}
                alt={selectedCountry.code}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <span className="font-bold text-[13px] text-[#4B4B4B]">
              {selectedCountry.dialCode}
            </span>
          </>
        )}
      </div>

      {isDropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsDropdownOpen(false)}
          ></div>
          <div className="absolute top-full mt-2 left-0 w-60 bg-white border border-gray-100 shadow-xl rounded-2xl z-50 max-h-55 overflow-y-auto py-2">
            {countries.map((country) => (
              <div
                key={country.code}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F9F9F9] cursor-pointer transition-colors"
                onClick={() => {
                  setSelectedCountry(country);
                  setIsDropdownOpen(false);
                }}
              >
                <div className="w-6 h-4 relative rounded-sm overflow-hidden shrink-0 border border-gray-100">
                  <Image
                    src={country.flag}
                    alt={country.code}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <span className="text-[13px] font-bold text-[#4B4B4B] w-12">
                  {country.dialCode}
                </span>
                <span className="text-[13px] font-medium text-[#737373] truncate">
                  {country.name}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col font-rubik">
      <h2 className="text-3xl font-black font-benzin uppercase text-[#4B4B4B] mb-2">
        РЕГИСТРАЦИЯ
      </h2>
      <p className="text-[#6E6E6E] text-[13px] font-medium mb-6">
        Заполните данные, чтобы продолжить
      </p>

      <div className="text-left mb-4">
        <label className="block text-[10px] font-bold text-[#4B4B4B] mb-2 pl-1">
          Номер телефона
        </label>
        {/* 🔥 ИСПОЛЬЗУЕМ НАШ НОВЫЙ INPUT */}
        <Input
          type="tel"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value.replace(/[^0-9]/g, ""));
            setError("");
          }}
          placeholder="500 111 000"
          maxLength={12}
          iconLeft={<CountrySelector />}
        />
      </div>

      <div className="text-left mb-4">
        <label className="block text-[10px] font-bold text-[#4B4B4B] mb-2 pl-1">
          ФИО
        </label>
        <Input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Асанов Асан"
        />
      </div>

      <div className="text-left mb-6">
        <label className="block text-[10px] font-bold text-[#4B4B4B] mb-2 pl-1">
          ИНН
        </label>
        <Input
          type="text"
          value={inn}
          onChange={(e) => setInn(e.target.value.replace(/[^0-9]/g, ""))}
          placeholder="12345678910111"
          maxLength={14}
        />
      </div>

      <div className="flex flex-col gap-4 text-left mb-6 pl-1">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isAdult}
            onChange={(e) => setIsAdult(e.target.checked)}
            className="w-5 h-5 accent-[#4B4B4B] rounded shrink-0"
          />
          <span className="text-[11px] font-bold text-[#4B4B4B]">
            Мне есть 18 лет
          </span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
            className="w-5 h-5 accent-[#4B4B4B] rounded shrink-0 mt-0.5"
          />
          <span className="text-[10px] font-medium text-[#737373] leading-tight">
            Согласен с{" "}
            <a href="#" className="underline hover:text-[#4B4B4B]">
              офертой
            </a>{" "}
            /{" "}
            <a href="#" className="underline hover:text-[#4B4B4B]">
              правилами
            </a>
          </span>
        </label>
      </div>

      {error && (
        <p className="text-red-500 text-[10px] font-bold mb-4">{error}</p>
      )}

      <button
        type="submit"
        disabled={sendSmsMutation.isPending || !isFormValid}
        className="w-full bg-[#F6C635] text-[#4B4B4B] font-black font-rubik uppercase py-4 rounded-full shadow-md hover:bg-[#E5B524] active:scale-95 transition-all text-[11px] disabled:opacity-60 disabled:active:scale-100 flex justify-center items-center mb-4 cursor-pointer"
      >
        {sendSmsMutation.isPending ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          "ПРОДОЛЖИТЬ"
        )}
      </button>

      <button
        type="button"
        onClick={onSwitchFlow}
        className="text-xs font-bold text-[#737373] hover:text-[#4B4B4B] transition-colors"
      >
        Уже есть аккаунт? Войти
      </button>
    </form>
  );
};
