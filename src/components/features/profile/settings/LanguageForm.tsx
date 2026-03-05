'use client';

import { useState } from 'react';
import Image from 'next/image';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';

const LANGUAGES = [
  { id: 'ru', name: 'Русский', icon: '/flags/ru.svg' },
  { id: 'kg', name: 'Кыргызча', icon: '/flags/kg.svg' },
  { id: 'en', name: 'English', icon: '/flags/en.svg' },
];

export const LanguageForm = () => {
  const [activeLang, setActiveLang] = useState('ru');

  return (
    <div className='flex flex-col gap-4'>
      {LANGUAGES.map((lang) => {
        const isActive = activeLang === lang.id;
        return (
          <button
            key={lang.id}
            onClick={() => setActiveLang(lang.id)}
            className={clsx(
              'flex items-center justify-between w-full border rounded-[20px] p-5 transition-all active:scale-[0.98]',
              isActive
                ? 'border-[#FF7600] bg-[#FFF8F3]'
                : 'border-[#E5E5E5] bg-white hover:border-gray-300',
            )}
          >
            <div className='flex items-center gap-4'>
              <div className='relative w-6 h-6 rounded-full overflow-hidden shadow-sm'>
                <Image
                  src={lang.icon}
                  alt={lang.name}
                  fill
                  className='object-cover'
                />
              </div>
              <span className='text-[15px] font-medium text-[#2D2D2D]'>
                {lang.name}
              </span>
            </div>

            {/* Custom Checkbox */}
            <div
              className={clsx(
                'w-5 h-5 rounded flex items-center justify-center transition-colors',
                isActive ? 'bg-[#FF7600]' : 'border border-[#C4C4C4]',
              )}
            >
              {isActive && (
                <Check size={14} className='text-white' strokeWidth={3} />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};
