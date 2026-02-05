'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';
import { Winner } from '@/data/mock-content';

export const WinnerCard = ({ winner }: { winner: Winner }) => {
  return (
    <div className='relative w-full aspect-[4/5] rounded-[32px] overflow-hidden bg-gray-100 shadow-sm'>
      {/* Фото */}
      <Image
        src={winner.image}
        alt={winner.name}
        fill
        className='object-cover'
        sizes='(max-width: 768px) 50vw, 25vw'
      />

      {/* Бейдж лотереи (сверху слева) */}
      <div className='absolute top-3 left-3 bg-white rounded-full px-2.5 py-1.5 flex items-center gap-1.5 shadow-sm z-10'>
        <Star size={10} className='fill-[#6F51FF] text-[#6F51FF]' />
        <span className='text-[10px] font-black font-benzin uppercase text-[#6F51FF] tracking-wide leading-none pt-0.5'>
          {winner.lotteryBadge}
        </span>
      </div>

      {/* Информация (снизу) */}
      <div className='absolute bottom-3 left-3 right-3 bg-white/40 backdrop-blur-md border border-white/30 rounded-3xl p-3 md:p-4 flex flex-col items-center text-center shadow-lg'>
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
    </div>
  );
};
