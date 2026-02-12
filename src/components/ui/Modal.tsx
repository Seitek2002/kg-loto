'use client';

import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { clsx } from 'clsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string; // Для настройки ширины (по дефолту max-w-[480px])
  hideCloseButton?: boolean; // Если нужно запретить закрытие крестиком
}

export const Modal = ({
  isOpen,
  onClose,
  children,
  className,
  hideCloseButton = false,
}: ModalProps) => {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden'; // Блокируем скролл страницы
    } else {
      // Даем время на анимацию исчезновения перед удалением из DOM (опционально)
      // В простой версии просто убираем скролл и скрываем
      const timer = setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = 'unset';
      }, 300); // 300ms = время анимации
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!mounted) return null;

  if (!isOpen && !isVisible) return null;

  return createPortal(
    <div
      className={clsx(
        'fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6',
        isOpen ? 'pointer-events-auto' : 'pointer-events-none',
      )}
      role='dialog'
      aria-modal='true'
    >
      {/* ФОН (Backdrop) */}
      <div
        className={clsx(
          'absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out',
          isOpen ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
        aria-hidden='true'
      />

      {/* КОНТЕНТ МОДАЛКИ */}
      <div
        className={clsx(
          'relative w-full max-w-[480px] bg-white rounded-[32px] shadow-2xl overflow-hidden transform transition-all duration-300 ease-out',
          // Анимация масштаба и прозрачности самого окна
          isOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4',
          className,
        )}
      >
        {/* Кнопка закрытия (Крестик) */}
        {!hideCloseButton && (
          <button
            onClick={onClose}
            className='absolute top-5 right-5 z-50 p-2 rounded-full bg-[#F5F5F5] text-[#2D2D2D] hover:bg-gray-200 transition-colors active:scale-95'
            aria-label='Закрыть'
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        )}

        {/* Скролл внутри модалки, если контент слишком длинный */}
        <div className='max-h-[90vh] overflow-y-auto custom-scrollbar'>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
};
