'use client';

import { Image as ImageIcon, FolderOpen, X } from 'lucide-react';

interface AndroidUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGallery: () => void;
  onSelectFiles: () => void;
}

export const AndroidUploadModal = ({
  isOpen,
  onClose,
  onSelectGallery,
  onSelectFiles,
}: AndroidUploadModalProps) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center px-4'>
      <div
        className='absolute inset-0 bg-black/60 backdrop-blur-sm'
        onClick={onClose}
      />

      <div className='relative bg-white w-full max-w-xs rounded-[32px] p-6 animate-in fade-in zoom-in-95 duration-200'>
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-400'
        >
          <X size={20} />
        </button>

        <h3 className='text-lg font-black font-benzin uppercase text-[#2D2D2D] mb-6 text-center'>
          Загрузить из...
        </h3>

        <div className='flex flex-col gap-3'>
          <button
            onClick={onSelectGallery}
            className='flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors'
          >
            <div className='w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center'>
              <ImageIcon size={20} />
            </div>
            <span className='font-bold font-benzin text-sm uppercase text-gray-800'>
              Галерея
            </span>
          </button>

          <button
            onClick={onSelectFiles}
            className='flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors'
          >
            <div className='w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center'>
              <FolderOpen size={20} />
            </div>
            <span className='font-bold font-benzin text-sm uppercase text-gray-800'>
              Файлы
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
