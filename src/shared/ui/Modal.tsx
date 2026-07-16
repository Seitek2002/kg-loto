"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { useMounted } from "@/hooks/useMounted";
import { clsx } from "clsx";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  hideCloseButton?: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  children,
  className,
  hideCloseButton = false,
}: ModalProps) => {
  const mounted = useMounted();

  // Отслеживаем, нужно ли держать DOM-узлы (для анимации закрытия)
  const [isRendered, setIsRendered] = useState(isOpen);

  // 🔥 Паттерн "Derived State": синхронизируем стейт без useEffect
  // Это решает проблему каскадных рендеров и предупреждений React
  if (isOpen && !isRendered) {
    setIsRendered(true);
  }

  // Закрытие по Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  // 🔥 Выгружаем компонент из DOM только когда CSS-транзакция затухания завершилась
  const handleTransitionEnd = () => {
    if (!isOpen) {
      setIsRendered(false);
    }
  };

  if (!mounted || (!isOpen && !isRendered)) return null;

  // 🔥 Портал в document.body — иначе если модалка открыта изнутри карточки
  // с hover:scale/transition-transform (например ArticleCard), тот transform
  // становится containing block для position:fixed, и модалка вместо
  // полноэкранного центрирования "прилипает" к позиции карточки
  return createPortal(
    <div
      className={clsx(
        "fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6",
        isOpen ? "pointer-events-auto" : "pointer-events-none",
      )}
      role="dialog"
      aria-modal="true"
    >
      {/* Фон модалки. Вешаем onTransitionEnd сюда */}
      <div
        className={clsx(
          "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out",
          isOpen ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
        aria-hidden="true"
        onTransitionEnd={handleTransitionEnd}
      />

      <div
        className={clsx(
          "relative w-full max-w-120 bg-[#F5F5F5] rounded-4xl sm:rounded-4xl shadow-2xl overflow-hidden transform transition-all duration-300 ease-out",
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4",
          className,
        )}
      >
        {!hideCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-50 p-2 rounded-full bg-white text-[#4B4B4B] hover:bg-gray-200 transition-colors active:scale-95"
            aria-label="Закрыть"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        )}
        <div className="max-h-[90vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
};
