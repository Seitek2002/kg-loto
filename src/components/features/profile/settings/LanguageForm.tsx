'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';

const LANGUAGES = [
  { id: 'ru', name: 'Русский', icon: '/flags/ru.svg' },
  { id: 'kg', name: 'Кыргызча', icon: '/flags/kg.svg' },
  { id: 'en', name: 'English', icon: '/flags/en.svg' },
];

// 🔥 Выносим мутацию глобального объекта ВНЕ компонента,
// чтобы строгий React Compiler не ругался на изменение внешних переменных
const setLocaleCookie = (locale: string) => {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000;`;
};

export const LanguageForm = () => {
  const router = useRouter();
  const currentLocale = useLocale();
  const [isPending, startTransition] = useTransition();

  const [activeLang, setActiveLang] = useState(currentLocale);

  const handleLanguageChange = (newLocale: string) => {
    setActiveLang(newLocale);

    // 🔥 Вызываем нашу безопасную внешнюю функцию
    setLocaleCookie(newLocale);

    // Плавно обновляем страницу, чтобы применились новые переводы
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className='flex flex-col gap-4'>
      {LANGUAGES.map((lang) => {
        const isActive = activeLang === lang.id;
        return (
          <button
            key={lang.id}
            onClick={() => handleLanguageChange(lang.id)}
            disabled={isPending}
            className={clsx(
              'flex items-center justify-between w-full border rounded-[20px] p-5 transition-all active:scale-[0.98]',
              isActive
                ? 'border-[#FF7600] bg-[#FFF8F3]'
                : 'border-[#E5E5E5] bg-white hover:border-gray-300 opacity-100',
              isPending && 'opacity-70 pointer-events-none',
            )}
          >
            <div className='flex items-center gap-4'>
              <div className='relative w-7.25 h-5.5 overflow-hidden shadow-sm'>
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
