'use client';

import Image from 'next/image';
import { Star, User } from 'lucide-react';
import { Winner } from '@/types/api';
import clsx from 'clsx';

export const WinnerCard = ({ winner }: { winner: Winner }) => {
  // Проверяем, есть ли валидная ссылка на изображение
  const hasImage = winner.image && winner.image.length > 0;

  return (
    <div className='relative w-full aspect-4/5 rounded-4xl overflow-hidden bg-white shadow-sm border border-gray-100'>
      {/* ЛОГИКА ОТОБРАЖЕНИЯ ФОТО ИЛИ ЗАГЛУШКИ */}
      {hasImage ? (
        <Image
          src={winner.image!}
          alt={winner.name}
          fill
          className='object-cover'
          sizes='(max-width: 768px) 50vw, 25vw'
        />
      ) : (
        <div className='w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-gray-100 to-gray-200'>
          <div className='w-20 h-20 rounded-full bg-white/50 flex items-center justify-center mb-6 backdrop-blur-sm'>
            <User size={40} className='text-gray-400' />
          </div>
        </div>
      )}

      {winner.lotteryPhoto ? (
        <div>
          <Image
            className='absolute top-2 left-2'
            width={105}
            height={59}
            src={winner.lotteryPhoto}
            alt={''}
          />
        </div>
      ) : (
        <div className='absolute top-3 left-3 bg-white rounded-full px-2.5 py-1.5 flex items-center gap-1.5 shadow-sm z-10'>
          <Star size={10} className='fill-[#6F51FF] text-[#6F51FF]' />
          <span className='text-[10px] font-black font-benzin uppercase text-[#6F51FF] tracking-wide leading-none pt-0.5'>
            {winner.lotteryBadge}
          </span>
        </div>
      )}

      {/* Информация (снизу) */}
      <div className='absolute bottom-3 left-3 right-3'>
        <div className='bg-white/60 backdrop-blur-md border border-white/40 rounded-3xl p-3 md:p-4 flex flex-col lg:flex-row lg:justify-between items-center text-center shadow-lg'>
          <div className='flex flex-col mb-1'>
            <h3 className='text-[10px] md:text-xs font-black text-[#2D2D2D] font-benzin uppercase mb-0.5'>
              {winner.name}
            </h3>
            <p className='text-[10px] md:text-xs text-[#2D2D2D]/80 font-rubik font-semibold'>
              {winner.city}
            </p>
          </div>
          <span className='text-xs md:text-sm font-black text-black font-benzin tracking-tight leading-tight'>
            {winner.prize}
          </span>
        </div>
        <div className='flex justify-center'>
          <button
            className={clsx(
              'w-auto bg-white mt-4 px-6 py-3 md:px-8 md:py-4 rounded-full shadow-lg transition-transform active:scale-95',
              'font-bold text-xs uppercase tracking-wider',
            )}
          >
            ИГРАТЬ • 100 с
          </button>
        </div>
      </div>
    </div>
  );
};
