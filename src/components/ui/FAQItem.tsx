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
    // 🔥 ИЗМЕНЕНИЯ: Убрали border-b, добавили bg-white и скругление
    <div className='bg-white rounded-3xl overflow-hidden transition-shadow hover:shadow-sm'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        // Добавили padding (px-6 или px-8), чтобы текст не прилипал к краям карточки
        className='w-full py-6 px-6 md:px-8 flex items-center justify-between gap-4 text-left group'
      >
        <span className='font-benzin font-bold text-xs md:text-sm text-[#2D2D2D] uppercase leading-tight'>
          {question}
        </span>
        <span
          className={clsx(
            'transition-transform duration-300 ease-in-out shrink-0 text-gray-800',
            isOpen ? 'rotate-45' : 'rotate-0',
          )}
        >
          <Plus size={20} strokeWidth={2} />
        </span>
      </button>

      {/* Анимация высоты */}
      <div
        className={clsx(
          'grid transition-[grid-template-rows] duration-300 ease-in-out',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className='overflow-hidden'>
          {answer && (
            <div
              className='pb-6 px-6 md:px-8 text-sm text-[#6E6E6E] font-rubik leading-relaxed max-w-[95%]'
              dangerouslySetInnerHTML={{ __html: answer }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
