'use client';

import Link from 'next/link';
import { clsx } from 'clsx';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onRestrictedClick: () => void;
}

export const MobileMenu = ({
  isOpen,
  onClose,
  onRestrictedClick,
}: MobileMenuProps) => {
  // Стейт аккордеона теперь живет только здесь!
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (name: string) => {
    setOpenAccordion(openAccordion === name ? null : name);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className='fixed inset-x-0 top-[64px] bottom-0 z-[100] bg-black/40 backdrop-blur-sm flex flex-col pb-24 overflow-y-auto'
        >
          <div className='m-4 bg-white rounded-[24px] p-5 shadow-2xl flex flex-col gap-4 font-rubik'>
            {/* Навигация */}
            <div className='flex flex-col'>
              {/* Аккордеон: Моментальные */}
              <div className='flex flex-col border-b border-gray-100'>
                <button
                  onClick={() => toggleAccordion('instant')}
                  className='flex items-center justify-between py-4 text-[13px] font-bold text-[#2D2D2D] uppercase'
                >
                  Моментальные билеты
                  <ChevronDown
                    size={18}
                    className={clsx(
                      'transition-transform text-gray-400',
                      openAccordion === 'instant' && 'rotate-180',
                    )}
                  />
                </button>
                <AnimatePresence>
                  {openAccordion === 'instant' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className='flex flex-col gap-3 pb-3 pl-4 overflow-hidden'
                    >
                      <Link
                        href='/#instant'
                        onClick={onClose}
                        className='text-sm text-gray-600 font-medium'
                      >
                        Мен миллионер
                      </Link>
                      <Link
                        href='/#instant'
                        onClick={onClose}
                        className='text-sm text-gray-600 font-medium'
                      >
                        Оной
                      </Link>
                      <Link
                        href='/#instant'
                        onClick={onClose}
                        className='text-sm text-gray-600 font-medium'
                      >
                        Уйго белек
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={onRestrictedClick} // Заглушка
                className='py-4 text-left text-[13px] font-bold text-[#2D2D2D] uppercase border-b border-gray-100'
              >
                Проверить билет
              </button>
              <Link
                href='/winners'
                onClick={onClose}
                className='py-4 text-[13px] font-bold text-[#2D2D2D] uppercase border-b border-gray-100'
              >
                Победители
              </Link>
              <Link
                href='/draws'
                onClick={onClose}
                className='py-4 text-[13px] font-bold text-[#2D2D2D] uppercase border-b border-gray-100'
              >
                Тиражные билеты
              </Link>
              <Link
                href='/about'
                onClick={onClose}
                className='py-4 text-[13px] font-bold text-[#2D2D2D] uppercase border-b border-gray-100'
              >
                О компании
              </Link>

              {/* Аккордеон: Контакты */}
              <div className='flex flex-col border-b border-gray-100'>
                <button
                  onClick={() => toggleAccordion('contacts')}
                  className='flex items-center justify-between py-4 text-[13px] font-bold text-[#2D2D2D] uppercase'
                >
                  Контакты
                  <ChevronDown
                    size={18}
                    className={clsx(
                      'transition-transform text-gray-400',
                      openAccordion === 'contacts' && 'rotate-180',
                    )}
                  />
                </button>
                <AnimatePresence>
                  {openAccordion === 'contacts' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className='flex flex-col gap-3 pb-3 pl-4 overflow-hidden'
                    >
                      <a
                        href='tel:996312440107'
                        className='text-sm text-gray-600 font-medium'
                      >
                        996 312 44 01 07
                      </a>
                      <a
                        href='mailto:support@kgloto.kg'
                        className='text-sm text-gray-600 font-medium'
                      >
                        support@kgloto.kg
                      </a>
                      <Link
                        href='/map'
                        onClick={onClose}
                        className='text-sm text-gray-600 font-medium'
                      >
                        Карта продаж
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Кнопки аутентификации */}
            <div className='flex gap-3 mt-4 pt-2'>
              <button
                onClick={onRestrictedClick}
                className='flex-1 bg-[#4A4A4A] text-white py-4 rounded-full font-black text-[10px] uppercase tracking-wider active:scale-95 transition-transform'
              >
                Регистрация
              </button>
              <button
                onClick={onRestrictedClick}
                className='flex-1 bg-[#FFD600] text-[#2D2D2D] py-4 rounded-full font-black text-[10px] uppercase tracking-wider active:scale-95 transition-transform shadow-[0_4px_14px_rgba(255,214,0,0.4)]'
              >
                Личный кабинет
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
