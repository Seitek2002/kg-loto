'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = () => {
  return (
    <div className='mt-8 sm:mt-12 flex justify-center items-center gap-2'>
      <button className='w-8 h-8 flex items-center justify-center rounded bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors'>
        <ChevronLeft size={16} />
      </button>
      <button className='w-8 h-8 flex items-center justify-center rounded bg-[#4B4B4B] text-white font-semibold text-sm'>
        1
      </button>
      <button className='w-8 h-8 flex items-center justify-center rounded bg-white border border-gray-200 text-[#4B4B4B] font-semibold text-sm hover:bg-gray-50'>
        2
      </button>
      <button className='w-8 h-8 flex items-center justify-center rounded bg-white border border-gray-200 text-[#4B4B4B] font-semibold text-sm hover:bg-gray-50'>
        3
      </button>
      <button className='w-8 h-8 flex items-center justify-center rounded bg-white border border-gray-200 text-[#4B4B4B] hover:bg-gray-50 transition-colors'>
        <ChevronRight size={16} />
      </button>
    </div>
  );
};
