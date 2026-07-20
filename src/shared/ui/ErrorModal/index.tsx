"use client";

import { AlertCircle, X } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Modal } from "@/shared/ui/Modal";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export const ErrorModal = ({
  isOpen,
  onClose,
  title = "Упс! Что-то пошло не так",
  message = "Произошла непредвиденная ошибка. Пожалуйста, попробуйте позже.",
}: ErrorModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hideCloseButton
      className="bg-white! rounded-3xl! max-w-sm p-6 lg:p-8"
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-500">
          <AlertCircle size={32} strokeWidth={2} />
        </div>

        <h2 className="text-[20px] font-black text-[#4B4B4B] uppercase leading-tight mb-2">
          {title}
        </h2>

        <p className="text-[#737373] text-[14px] font-medium mb-8 leading-relaxed">
          {message}
        </p>

        <Button
          onClick={onClose}
          className="w-full bg-[#F58220] hover:bg-[#E57210] text-white"
        >
          Понятно
        </Button>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#4B4B4B] transition-colors active:scale-90"
          aria-label="Закрыть"
        >
          <X size={24} strokeWidth={2} />
        </button>
      </div>
    </Modal>
  );
};
