"use client";

import { Modal } from "@/shared/ui/Modal";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
}

// Показывает картинку в оригинальном виде (без object-cover обрезки карточки
// и без next/image оптимизации, которая требует заранее знать пропорции)
export const ImageModal = ({ isOpen, onClose, src, alt }: ImageModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="bg-transparent! shadow-none! max-w-4xl! w-auto! p-0 overflow-visible!"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- нужен именно оригинал, без обрезки/оптимизации */}
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-[85vh] w-auto h-auto rounded-2xl object-contain mx-auto block"
      />
    </Modal>
  );
};
