"use client";

import { ReactNode, useState } from "react";

import { X } from "lucide-react";

import { useTopUp } from "@/entities/finance/api/financeApi";

import { Button } from "@/shared/ui/Button";
import { ErrorModal } from "@/shared/ui/ErrorModal";
import { Modal } from "@/shared/ui/Modal";

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  initialAmount?: number | string;
  // Куда вернуть пользователя после оплаты (по умолчанию /wallet)
  redirectPath?: string;
}

export const TopUpModal = ({
  isOpen,
  onClose,
  title,
  description,
  initialAmount,
  redirectPath,
}: TopUpModalProps) => {
  const [amount, setAmount] = useState("");
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setAmount(initialAmount ? String(initialAmount) : "");
    }
  }

  const { mutate: createPaylink, isPending } = useTopUp();

  const handleClose = () => {
    onClose();
    setTimeout(() => setAmount(""), 200);
  };

  const handleTopUp = () => {
    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) return;

    createPaylink(
      { amount, redirectPath },
      {
        onSuccess: (data) => {
          if (data.paylinkUrl) {
            window.location.href = data.paylinkUrl;
          }
        },
        onError: (error) => {
          console.error("Ошибка пополнения:", error);
          setIsErrorOpen(true);
        },
      },
    );
  };

  const isFormValid = amount.trim() !== "" && Number(amount) > 0;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        hideCloseButton
        className="bg-[#F5F5F7]! max-w-md p-6 lg:p-10"
      >
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-[#4B4B4B] transition-colors active:scale-90"
          aria-label="Закрыть"
        >
          <X size={24} strokeWidth={2} />
        </button>

        <h2 className="text-[20px] lg:text-[24px] font-black text-[#4B4B4B] uppercase leading-tight mb-2">
          {title || "Пополнение баланса"}
        </h2>

        <div className="text-[#8C8C8C] text-[11px] lg:text-[13px] mb-6 lg:mb-8 font-medium leading-relaxed">
          {description || "Деньги поступят на счет моментально после оплаты"}
        </div>

        <div className="flex flex-col gap-2 mb-6">
          <label className="text-[13px] font-bold text-[#4B4B4B] ml-1">
            Сумма пополнения (сом)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Например: 100"
            min="1"
            className="w-full bg-white rounded-2xl px-5 py-4 text-[16px] font-bold text-[#4B4B4B] outline-none border-2 border-transparent focus:border-[#FFD600] transition-all shadow-sm placeholder:text-gray-300"
          />
        </div>

        <Button
          onClick={handleTopUp}
          disabled={!isFormValid || isPending}
          isLoading={isPending}
          className={
            isFormValid
              ? "w-full bg-[#FFD600] text-[#4B4B4B]"
              : "w-full bg-gray-200 text-gray-400 cursor-not-allowed"
          }
        >
          Перейти к оплате
        </Button>
      </Modal>

      <ErrorModal isOpen={isErrorOpen} onClose={() => setIsErrorOpen(false)} />
    </>
  );
};
