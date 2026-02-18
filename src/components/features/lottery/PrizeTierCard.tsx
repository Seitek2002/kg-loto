'use client';

import Image from 'next/image';

interface PrizeTierCardProps {
  category: string;
  description?: string;
  amount: string;
  winnersCount: number;
  backgroundImage?: string;
}

export const PrizeTierCard = ({
  category,
  description,
  amount,
  winnersCount,
  backgroundImage,
}: PrizeTierCardProps) => {
  return (
    <div className='relative w-full md:h-full p-5 rounded-[32px] md:flex items-center justify-between shadow-lg mb-4 overflow-hidden bg-gray-900'>
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt={category}
          fill
          className='object-cover z-0'
          sizes='(max-width: 768px) 100vw, 50vw'
        />
      )}

      {backgroundImage && <div className='absolute inset-0 bg-black/20 z-0' />}

      <div className='relative z-10 flex flex-col text-white'>
        <span className='text-[10px] font-bold font-benzin uppercase opacity-90 mb-1'>
          {category}
        </span>
        {description && (
          <span className='text-[9px] font-medium font-rubik opacity-80 mb-2 max-w-37.5 leading-tight'>
            {description}
          </span>
        )}
        <span className='text-xl font-black font-benzin uppercase tracking-tight'>
          {amount}
        </span>
      </div>

      <div className='relative z-10 bg-white rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm'>
        <div className='w-1.5 h-1.5 rounded-full bg-black' />
        <span className='text-[10px] font-bold font-benzin uppercase text-black whitespace-nowrap'>
          {winnersCount} ПОБЕДИТЕЛЕЙ
        </span>
      </div>
    </div>
  );
};
