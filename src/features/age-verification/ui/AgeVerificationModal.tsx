"use client";

import { useState } from "react";

import { Modal } from "@/shared/ui/Modal";

export const AgeVerificationModal = () => {
  const [isOpen, setIsOpen] = useState(true);

  const handleConfirm = () => {
    // 🔥 Ставим куку на 1 год (31536000 секунд)
    document.cookie = "age_verified=true; path=/; max-age=31536000;";
    setIsOpen(false);
  };

  const handleReject = () => {
    // 🔥 Уводим несовершеннолетних с сайта
    window.location.href = "https://google.com";
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleConfirm}
      hideCloseButton
      closeOnBackdropClick={false}
      closeOnEscape={false}
      className="bg-white! rounded-4xl! max-w-140 p-6 sm:p-10"
    >
      <div className="flex flex-col items-center text-center">
        <h2 className="text-[20px] sm:text-[24px] font-black font-benzin uppercase text-[#4B4B4B] mb-4">
          Подтверждение возраста
        </h2>

        <p className="text-sm sm:text-base text-[#6E6E6E] mb-8 max-w-90 leading-relaxed">
          Доступ к сервису предоставляется только пользователям старше 18 лет.
        </p>

        <div className="flex flex-col sm:flex-row-reverse w-full gap-3 sm:gap-4">
          <button
            onClick={handleReject}
            className="w-full sm:flex-1 bg-white text-[#4B4B4B] border border-[#A3A3A3] py-4 rounded-full font-bold text-[14px] hover:bg-gray-50 active:scale-95 transition-all"
          >
            Мне нет 18 лет
          </button>

          <button
            onClick={handleConfirm}
            className="w-full sm:flex-1 bg-[#4B4B4B] text-white py-4 rounded-full font-bold text-[14px] hover:bg-[#4B4B4B] active:scale-95 transition-all"
          >
            Мне есть 18 лет
          </button>
        </div>
      </div>
    </Modal>
  );
};
