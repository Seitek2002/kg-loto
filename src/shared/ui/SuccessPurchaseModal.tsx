"use client";

import Link from "next/link";

import { Check, X } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Modal } from "@/shared/ui/Modal";

export interface TicketDetails {
  drawNumber: string;
  price: number;
  prize: string;
  date: string;
  combinations: number[];
}

interface SuccessPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  details?: TicketDetails;
}

export const SuccessPurchaseModal = ({
  isOpen,
  onClose,
  details,
}: SuccessPurchaseModalProps) => {
  // Моковые данные на случай, если пропсы не передали
  const data = details || {
    drawNumber: "№005034",
    price: 100,
    prize: "6 000 000",
    date: "2 апр, 2026. 16:00",
    combinations: [1, 20, 32, 16, 8],
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hideCloseButton // Прячем внутренний крестик Modal, так как по дизайну он снаружи
      // 🔥 Переопределяем фон, скругления и отключаем скрытие контента для внешнего крестика
      className="bg-white! rounded-4xl! max-w-md w-full overflow-visible! p-0"
    >
      <div className="flex flex-col items-center p-6 sm:p-8">
        {/* Кнопка закрытия (Крестик) снаружи */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 sm:-right-2 w-10 h-10 flex items-center justify-center text-white/80 hover:text-white transition-colors"
        >
          <X size={28} strokeWidth={2} />
        </button>

        {/* Иконка успеха */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-[#1FAF38] flex items-center justify-center mb-4 sm:mb-6">
          <Check size={48} className="text-[#1FAF38]" strokeWidth={3} />
        </div>

        {/* Заголовок */}
        <h2 className="text-[18px] sm:text-[22px] font-black font-benzin uppercase text-[#4B4B4B] mb-6 text-center leading-tight">
          Успешная покупка!
        </h2>

        {/* Карточка с деталями */}
        <div className="w-full bg-white border border-gray-100 shadow-sm rounded-2xl p-5 flex flex-col gap-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-[13px] sm:text-[14px] font-medium text-[#737373]">
              Тираж
            </span>
            <span className="text-[14px] sm:text-[15px] font-bold text-[#4B4B4B]">
              {data.drawNumber}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[13px] sm:text-[14px] font-medium text-[#737373]">
              Стоимость
            </span>
            <span className="text-[14px] sm:text-[15px] font-bold text-[#4B4B4B]">
              {data.price} <span className="underline text-[12px]">с</span>
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[13px] sm:text-[14px] font-medium text-[#737373]">
              Приз
            </span>
            <span className="text-[14px] sm:text-[15px] font-bold text-[#4B4B4B]">
              {data.prize} <span className="underline text-[12px]">с</span>
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[13px] sm:text-[14px] font-medium text-[#737373]">
              Дата
            </span>
            <span className="text-[14px] sm:text-[15px] font-bold text-[#4B4B4B]">
              {data.date}
            </span>
          </div>

          <div className="flex justify-between items-center pt-1">
            <span className="text-[13px] sm:text-[14px] font-medium text-[#737373]">
              Комбинации
            </span>
            <div className="flex gap-1.5 flex-wrap justify-end">
              {data.combinations.map((num, idx) => (
                <div
                  key={idx}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#1FAF38] text-white flex items-center justify-center text-[11px] sm:text-[12px] font-bold shadow-sm"
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Кнопки */}
        <div className="w-full flex flex-col sm:flex-row gap-3">
          <Button
            variant="ghost" // Используем ghost, чтобы затереть дефолтный фон и поставить свой
            onClick={() => console.log("Скачивание PDF...")}
            className="flex-1 bg-[#FFD600]! hover:bg-[#FFC000]! text-[#4B4B4B] text-[11px]! sm:text-[12px]! shadow-sm uppercase font-black py-4 sm:py-3.5"
          >
            Скачать билет
          </Button>

          <Link href="/tickets" className="flex-1 contents">
            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full bg-[#FFD600]! hover:bg-[#FFC000]! text-[#4B4B4B] text-[11px]! sm:text-[12px]! shadow-sm uppercase font-black py-4 sm:py-3.5"
            >
              К моим билетам
            </Button>
          </Link>
        </div>
      </div>
    </Modal>
  );
};
