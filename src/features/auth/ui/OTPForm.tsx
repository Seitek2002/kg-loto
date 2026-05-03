"use client";

import { useRef, useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { clsx } from "clsx";
import { Loader2 } from "lucide-react";

// import { AuthService } from "@/services/auth";
import { authApi } from "@/entities/user/api/authApi";
import { useAuthStore } from "@/entities/user/model/authStore";

interface OTPFormProps {
  flow: "login" | "register";
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
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const setTokens = useAuthStore((state) => state.setTokens);
  const isLogin = flow === "login";

  const verifyMutation = useMutation({
    mutationFn: (variables: {
      phoneNumber: string;
      code: string;
      purpose?: string;
    }) => {
      if (isLogin) {
        return authApi.loginVerify({
          phoneNumber: variables.phoneNumber,
          code: variables.code,
        });
      }
      return authApi.registerVerify({
        phoneNumber: variables.phoneNumber,
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
      setError(err.response?.data?.message || "Неверный код");
    },
  });

  const resendMutation = useMutation({
    mutationFn: () => {
      if (isLogin) {
        return authApi.loginPhone({ phoneNumber: phoneNumber });
      }
      return authApi.registerPhone({ phoneNumber: phoneNumber });
    },
    onSuccess: () => setError("Код отправлен заново"),
  });

  const handleSubmit = (currentOtp?: string[]) => {
    const code = (currentOtp || otp).join("");
    if (code.length < 4) return;

    verifyMutation.mutate({
      phoneNumber: phoneNumber,
      code,
      purpose: isLogin ? undefined : "register",
    });
  };

  // 🔥 ИСПРАВЛЕНО: Умный handleChange, который понимает автовставку от iOS
  const handleChange = (index: number, value: string) => {
    const cleanValue = value.replace(/\D/g, ""); // Оставляем только цифры

    // Если пользователь стер значение
    if (!cleanValue) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    // Если прилетело сразу несколько цифр (сработал iOS AutoFill)
    if (cleanValue.length > 1) {
      const newOtp = [...otp];
      let focusIndex = index;

      for (let i = 0; i < cleanValue.length && index + i < 4; i++) {
        newOtp[index + i] = cleanValue[i];
        focusIndex = index + i;
      }

      setOtp(newOtp);
      if (error) setError("");

      if (newOtp.join("").length === 4) {
        inputRefs.current[3]?.focus();
        handleSubmit(newOtp);
      } else if (focusIndex < 3) {
        inputRefs.current[focusIndex + 1]?.focus();
      }
      return;
    }

    // Обычный ввод одной цифры
    const newOtp = [...otp];
    newOtp[index] = cleanValue.substring(cleanValue.length - 1);
    setOtp(newOtp);

    if (cleanValue && index < 3) inputRefs.current[index + 1]?.focus();
    if (error) setError("");
    if (cleanValue && index === 3) handleSubmit(newOtp);
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pastedData) return;

    const newOtp = [...otp];
    let focusIndex = 0;

    for (let i = 0; i < 4; i++) {
      if (pastedData[i]) {
        newOtp[i] = pastedData[i];
        focusIndex = i;
      }
    }

    setOtp(newOtp);
    if (error) setError("");

    if (pastedData.length >= 4) {
      inputRefs.current[3]?.focus();
      handleSubmit(newOtp);
    } else {
      inputRefs.current[focusIndex + 1]?.focus();
    }
  };

  return (
    <div className="flex flex-col text-center font-rubik">
      <h2 className="text-3xl font-black font-benzin uppercase text-[#4B4B4B] mb-2">
        КОД ПОДТВЕРЖДЕНИЯ
      </h2>
      <p className="text-[#6E6E6E] text-[13px] font-medium mb-8">
        Введите код, отправленный на номер
        <br />
        <span className="text-[#F6C635] font-bold">{phoneNumber}</span>
      </p>

      <div className="flex justify-center gap-3 mb-4">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type="text" // Оставляем text для максимальной совместимости
            inputMode="numeric" // 🔥 Вызывает цифровую клавиатуру на смартфонах
            autoComplete="one-time-code" // 🔥 ГЛАВНАЯ МАГИЯ ДЛЯ iOS И ANDROID SMS AUTOFILL
            maxLength={4} // 🔥 Позволяем iOS вставить все 4 цифры разом (мы их обработаем в onChange)
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            disabled={verifyMutation.isPending}
            className={clsx(
              "w-17.5 h-17.5 rounded-2xl bg-white shadow-sm text-center font-black text-3xl text-[#4B4B4B] focus:ring-2 outline-none transition-all disabled:opacity-50",
              error && error !== "Код отправлен заново"
                ? "ring-2 ring-red-500"
                : "focus:ring-[#F6C635]",
            )}
          />
        ))}
      </div>

      <div className="flex items-center justify-between px-2 mb-8">
        <span
          className={clsx(
            "text-[10px] font-bold",
            error === "Код отправлен заново"
              ? "text-green-500"
              : "text-red-500",
          )}
        >
          {error}
        </span>

        <span className="text-[10px] font-bold text-[#4B4B4B]">
          Не получили код?{" "}
          <button
            onClick={() => resendMutation.mutate()}
            className="text-[#F6C635] hover:underline cursor-pointer disabled:opacity-50"
            disabled={resendMutation.isPending}
          >
            Отправить снова
          </button>
        </span>
      </div>

      <button
        onClick={() => handleSubmit()}
        disabled={verifyMutation.isPending || otp.join("").length < 4}
        className="w-full bg-[#F6C635] text-[#4B4B4B] font-black font-rubik uppercase py-4 rounded-full shadow-md hover:bg-[#E5B524] active:scale-95 transition-all text-[11px] disabled:opacity-60 disabled:active:scale-100 flex justify-center items-center"
      >
        {verifyMutation.isPending ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          "ПОДТВЕРДИТЬ"
        )}
      </button>

      <button
        onClick={onBack}
        className="mt-4 text-[10px] font-bold text-gray-400 hover:text-[#4B4B4B] uppercase"
      >
        Изменить номер
      </button>
    </div>
  );
};
