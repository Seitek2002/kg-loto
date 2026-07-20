"use client";

import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";

import { useMounted } from "@/hooks/useMounted";
import { clsx } from "clsx";
import { X } from "lucide-react";

// Общий счетчик открытых модалок, чтобы вложенные модалки (например TopUpModal
// поверх которого открывается ErrorModal) не сбрасывали друг другу overflow
let openModalCount = 0;

const lockBodyScroll = () => {
  if (openModalCount === 0) document.body.style.overflow = "hidden";
  openModalCount += 1;
};

const unlockBodyScroll = () => {
  openModalCount = Math.max(0, openModalCount - 1);
  if (openModalCount === 0) document.body.style.overflow = "";
};

type ModalVariant = "center" | "top-sheet";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  hideCloseButton?: boolean;
  variant?: ModalVariant;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
}

// 🔥 Анимации входа/выхода держатся на CSS: `starting:` (@starting-style) задает
// стартовый кадр появления, а `transition-discrete` (transition-behavior: allow-discrete)
// откладывает display:none до конца transition при закрытии. Поэтому DOM-узел
// всегда смонтирован (пока модалка хоть раз открывалась в этой сессии рендера) —
// никакого JS-таймера на "подожди пока доиграет анимация, потом убери из DOM".
export const Modal = ({
  isOpen,
  onClose,
  children,
  className,
  hideCloseButton = false,
  variant = "center",
  closeOnBackdropClick = true,
  closeOnEscape = true,
}: ModalProps) => {
  const mounted = useMounted();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeOnEscape, handleKeyDown]);

  useEffect(() => {
    if (!isOpen) return;
    lockBodyScroll();
    return unlockBodyScroll;
  }, [isOpen]);

  if (!mounted) return null;

  if (variant === "top-sheet") {
    return createPortal(
      <div
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
        onClick={closeOnBackdropClick ? onClose : undefined}
        className={clsx(
          "fixed inset-x-0 top-16 bottom-0 z-9999 bg-black/40 backdrop-blur-sm overflow-y-auto",
          "transition-all transition-discrete duration-300 ease-out",
          isOpen
            ? "opacity-100 translate-y-0 starting:opacity-0 starting:-translate-y-5"
            : "opacity-0 -translate-y-5 hidden pointer-events-none",
          className,
        )}
      >
        {children}
      </div>,
      document.body,
    );
  }

  return createPortal(
    <div
      className={clsx(
        "fixed inset-0 z-9999 items-center justify-center p-4 sm:p-6 transition-all transition-discrete duration-300",
        isOpen ? "flex" : "hidden pointer-events-none",
      )}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
    >
      {/* Фон модалки */}
      <div
        className={clsx(
          "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out",
          isOpen ? "opacity-100" : "opacity-0 starting:opacity-0",
        )}
        onClick={closeOnBackdropClick ? onClose : undefined}
        aria-hidden="true"
      />

      <div
        className={clsx(
          "relative w-full max-w-120 bg-[#F5F5F5] rounded-4xl sm:rounded-4xl shadow-2xl overflow-hidden transform transition-all duration-300 ease-out",
          isOpen
            ? "opacity-100 scale-100 translate-y-0 starting:opacity-0 starting:scale-95 starting:translate-y-4"
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
