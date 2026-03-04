'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLocale } from 'next-intl';
import { clsx } from 'clsx';

interface LanguageSwitcherProps {
  isDark?: boolean;
}

export const LanguageSwitcher = ({ isDark }: LanguageSwitcherProps) => {
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 🔥 1. Создаем стейт для ожидания переключения языка
  const [pendingLocale, setPendingLocale] = useState<string | null>(null);

  const languages = [
    { code: 'ru', label: 'РУ' },
    { code: 'ky', label: 'КГ' },
  ];

  // Закрываем дропдаун при клике снаружи
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 🔥 2. Тот самый useEffect, который просил компилятор!
  useEffect(() => {
    if (pendingLocale) {
      // Теперь изменение document.cookie легально, так как оно внутри эффекта
      document.cookie = `NEXT_LOCALE=${pendingLocale}; path=/; max-age=31536000; SameSite=Lax`;
      window.location.reload();
    }
  }, [pendingLocale]);

  const switchLanguage = (newLocale: string) => {
    setIsOpen(false);
    // 🔥 3. Вместо прямой мутации мы просто обновляем стейт
    setPendingLocale(newLocale);
  };

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'text-xs font-black uppercase flex items-center gap-1 transition-colors outline-none',
          isDark
            ? 'text-white hover:text-gray-300'
            : 'text-[#2D2D2D] hover:text-[#FFD600]',
        )}
      >
        {locale === 'ky' ? 'КГ' : 'РУ'}
        <ChevronDown
          size={14}
          className={clsx(
            'transition-transform duration-200',
            isOpen ? 'rotate-180' : '',
          )}
        />
      </button>

      {/* Выпадающий список */}
      {isOpen && (
        <div className='absolute top-full right-0 mt-4 w-20 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden'>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLanguage(lang.code)}
              className={clsx(
                'w-full text-center py-2.5 text-xs font-bold uppercase transition-colors',
                locale === lang.code
                  ? 'text-[#FFD600] bg-yellow-50/50'
                  : 'text-[#2D2D2D] hover:bg-gray-50',
              )}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
