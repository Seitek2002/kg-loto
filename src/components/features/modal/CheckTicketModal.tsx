'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface CheckTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckTicketModal = ({
  isOpen,
  onClose,
}: CheckTicketModalProps) => {
  const [ticketNumber, setTicketNumber] = useState('');

  // Блокируем скролл страницы, когда модалка открыта
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketNumber.trim()) return;

    // 🔥 Здесь будет логика отправки запроса на проверку билета
    console.log('Проверяем билет:', ticketNumber);

    // Если нужно перекинуть на страницу результатов:
    // router.push(`/scan/result?ticket=${ticketNumber}`);
  };

  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200'>
      {/* Клик по фону закрывает модалку */}
      <div className='absolute inset-0' onClick={onClose} />

      <div className='bg-white w-full max-w-[420px] rounded-[32px] p-8 relative shadow-2xl animate-in zoom-in-95 duration-200 z-10'>
        <button
          onClick={onClose}
          className='absolute top-6 right-6 text-gray-400 hover:text-[#2D2D2D] transition-colors'
        >
          <X size={24} />
        </button>

        <h2 className='text-3xl leading-tight font-black font-benzin uppercase text-[#2D2D2D] mb-2 pr-6'>
          Проверка билета
        </h2>
        <p className='text-sm font-medium font-rubik text-gray-400 mb-8'>
          Узнайте выиграли ли вы приз!
        </p>

        <form onSubmit={handleSubmit} className='flex flex-col'>
          <label className='block text-xs font-bold text-[#2D2D2D] font-rubik mb-2 ml-1'>
            Номер билета
          </label>
          <input
            type='text'
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value)}
            placeholder='YT2357912'
            className='w-full bg-[#F5F5F5] rounded-2xl px-5 py-4 font-bold font-rubik text-sm text-[#2D2D2D] outline-none focus:ring-2 focus:ring-[#FFD600] transition-all placeholder:text-gray-300 mb-8'
          />

          <button
            type='submit'
            disabled={!ticketNumber.trim()}
            className='w-full bg-[#FFD600] text-[#2D2D2D] font-black uppercase py-4 rounded-full shadow-lg hover:bg-[#ffe033] active:scale-95 transition-all text-xs disabled:opacity-50 disabled:active:scale-100'
          >
            Проверить
          </button>
        </form>
      </div>
    </div>
  );
};
