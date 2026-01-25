'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
}

export const PageHeader = ({ title }: PageHeaderProps) => {
  const router = useRouter();

  return (
    <div className='relative flex items-center justify-center py-4 mb-2'>
      {/* Кнопка Назад (абсолютно слева) */}
      <button
        onClick={() => router.back()}
        className='absolute left-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-800 active:scale-95 transition-transform'
      >
        <ArrowLeft size={20} strokeWidth={2.5} />
      </button>

      {/* Заголовок */}
      <h1 className='text-xl font-black font-benzin uppercase text-[#2D2D2D] tracking-wide'>
        {title}
      </h1>
    </div>
  );
};
