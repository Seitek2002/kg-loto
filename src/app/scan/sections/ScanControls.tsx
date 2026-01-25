'use client';

import clsx from 'clsx';
import { Flashlight, Image as ImageIcon, PenLine } from 'lucide-react';

interface ScanControlsProps {
  onManualClick: () => void;
  onUploadClick: () => void;
  onFlashlightClick: () => void;
  isFlashOn: boolean;
}

export const ScanControls = ({
  onManualClick,
  onUploadClick,
  onFlashlightClick,
  isFlashOn,
}: ScanControlsProps) => {
  return (
    <div className='absolute max-w-[80%] mx-auto bottom-10 left-0 right-0 z-20'>
      <div
        className='glass flex-1 text-white pointer-events-auto 
        bg-black/30 backdrop-blur-xl rounded-full 
        border border-white/15 
        shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] 
        p-2 flex justify-between items-center'
      >
        {/* Фонарик */}
        <button
          onClick={onFlashlightClick}
          className={clsx(
            'flex flex-col items-center px-4 py-1 rounded-full transition-all duration-200 active:scale-95',
            // Если включен - подсвечиваем белым фоном, иначе прозрачным
            isFlashOn
              ? 'bg-white/20 text-yellow-300'
              : 'hover:bg-white/10 text-white',
          )}
        >
          <div className='w-6 h-6 flex items-center justify-center mb-1'>
            <Flashlight size={20} fill={isFlashOn ? "currentColor" : "none"} />
          </div>
          <span className='text-[10px] font-bold uppercase tracking-wider text-white/80'>
            Фонарик
          </span>
        </button>

        {/* Загрузить */}
        <button
          onClick={onUploadClick}
          className='flex flex-col items-center px-4 py-1 rounded-full transition-all duration-200 active:scale-95 hover:bg-white/10'
        >
          <div className='w-6 h-6 flex items-center justify-center mb-1'>
            <ImageIcon size={20} />
          </div>
          <span className='text-[10px] font-bold uppercase tracking-wider text-white/80'>
            Загрузить
          </span>
        </button>

        {/* Вручную */}
        <button
          onClick={onManualClick}
          className='flex flex-col items-center px-4 py-1 rounded-full transition-all duration-200 active:scale-95 hover:bg-white/10'
        >
          <div className='w-6 h-6 flex items-center justify-center mb-1'>
            <PenLine size={20} />
          </div>
          <span className='text-[10px] font-bold uppercase tracking-wider text-white/80'>
            Вручную
          </span>
        </button>
      </div>
    </div>
  );
};
