'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { clsx } from 'clsx';

interface FAQItemProps {
  question: string;
  answer: string;
}

export const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='border-b border-gray-100 last:border-none'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='w-full py-6 flex items-center justify-between gap-4 text-left group'
      >
        <span className='font-benzin font-bold text-sm md:text-base text-[#2D2D2D] uppercase leading-tight'>
          {question}
        </span>
        <span
          className={clsx(
            'transition-transform duration-300 ease-in-out shrink-0 text-gray-800',
            isOpen ? 'rotate-45' : 'rotate-0',
          )}
        >
          <Plus size={24} strokeWidth={1.5} />
        </span>
      </button>

      {/* Анимация высоты через CSS Grid */}
      <div
        className={clsx(
          'grid transition-[grid-template-rows] duration-300 ease-in-out',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className='overflow-hidden'>
          <p className='pb-6 text-sm text-[#6E6E6E] font-rubik leading-relaxed max-w-[90%]'>
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};
