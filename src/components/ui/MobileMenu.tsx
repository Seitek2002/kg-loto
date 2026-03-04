'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl'; // 🔥 Импортируем хук

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
  const t = useTranslations('header'); // 🔥 Подключаем словарь 'header'

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
              <Link
                href='/'
                onClick={onClose}
                className='py-4 text-[13px] font-bold text-[#2D2D2D] uppercase border-b border-gray-100 hover:text-[#F5A623] transition-colors'
              >
                {t('home')}
              </Link>

              <Link
                href='/lottery'
                onClick={onClose}
                className='py-4 text-[13px] font-bold text-[#2D2D2D] uppercase border-b border-gray-100 hover:text-[#F5A623] transition-colors'
              >
                {t('instant')}
              </Link>

              <Link
                href='/about'
                onClick={onClose}
                className='py-4 text-[13px] font-bold text-[#2D2D2D] uppercase border-b border-gray-100 hover:text-[#F5A623] transition-colors'
              >
                {t('about')}
              </Link>

              <button
                onClick={onRestrictedClick} // Заглушка
                className='py-4 text-left text-[13px] font-bold text-[#2D2D2D] uppercase border-b border-gray-100 hover:text-[#F5A623] transition-colors'
              >
                {t('check_ticket')}
              </button>

              <a
                href='tel:996312440107'
                onClick={onClose}
                className='py-4 text-[13px] font-bold text-[#2D2D2D] uppercase border-b border-gray-100 hover:text-[#F5A623] transition-colors'
              >
                {t('hotline')}: 996 312 44 01 07
              </a>
            </div>

            {/* Кнопки аутентификации */}
            <div className='flex gap-3 mt-4 pt-2'>
              <button
                onClick={onRestrictedClick}
                className='flex-1 bg-[#4A4A4A] text-white py-4 rounded-full font-black text-[10px] uppercase tracking-wider active:scale-95 transition-transform'
              >
                {t('register')}
              </button>
              <button
                onClick={onRestrictedClick}
                className='flex-1 bg-[#FFD600] text-[#2D2D2D] py-4 rounded-full font-black text-[10px] uppercase tracking-wider active:scale-95 transition-transform shadow-[0_4px_14px_rgba(255,214,0,0.4)]'
              >
                {t('profile')}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
