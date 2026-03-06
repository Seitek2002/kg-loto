'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import { Plus, Minus } from 'lucide-react';

const FAQ_ITEMS = [
  {
    id: 1,
    question: 'Кто является организатором лотереи?',
    answer: 'Организатором лотереи является государственная компания...',
  },
  {
    id: 2,
    question: 'Как получить выигрыш?',
    answer: 'Выигрыш можно получить в личном кабинете или в точках продаж.',
  },
  {
    id: 3,
    question: 'Безопасно ли привязывать карту?',
    answer: 'Да, мы используем современные протоколы шифрования.',
  },
];

export const FaqSettings = () => {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <div className='flex flex-col gap-5 overflow-y-auto max-h-screen'>
      {FAQ_ITEMS.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className='bg-[#F9F9F9] rounded-[20px] overflow-hidden'
          >
            <button
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className='w-full flex items-center justify-between p-5 text-left'
            >
              <span className='text-[20px] text-[#4B4B4B] pr-4'>
                {item.id}. {item.question}
              </span>
              {isOpen ? (
                <Minus size={20} className='text-[#4B4B4B] shrink-0' />
              ) : (
                <Plus size={20} className='text-[#4B4B4B] shrink-0' />
              )}
            </button>
            <div
              className={clsx(
                'grid transition-all duration-300 ease-in-out',
                isOpen
                  ? 'grid-rows-[1fr] opacity-100'
                  : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div className='overflow-hidden'>
                <p className='px-5 pb-5 text-[13px] text-[#6E6E6E] leading-relaxed'>
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
