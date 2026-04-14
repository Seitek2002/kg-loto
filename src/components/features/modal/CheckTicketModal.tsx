'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // 🔥 Импортируем Портал
import { X, Trophy, Frown, Loader2 } from 'lucide-react';
import { useCheckTicket } from '@/hooks/useTickets';
import { useMounted } from '@/hooks/useMounted';

interface CheckTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
}

export const CheckTicketModal = ({
  isOpen,
  onClose,
  initialCode = '',
}: CheckTicketModalProps) => {
  const mounted = useMounted();
  const [ticketNumber, setTicketNumber] = useState(initialCode || '');

  const {
    mutate: checkTicket,
    data: result,
    isPending,
    error,
    reset,
  } = useCheckTicket();

  useEffect(() => {
    if (isOpen && initialCode) {
      const timer = setTimeout(() => setTicketNumber(initialCode), 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialCode]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      const timer = setTimeout(() => {
        setTicketNumber('');
        reset();
      }, 300);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, reset]);

  // 🔥 Если не открыто ИЛИ еще не смонтировано на клиенте - ничего не рендерим
  if (!isOpen || !mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketNumber.trim()) return;
    checkTicket(ticketNumber);
  };

  // 🔥 Оборачиваем всю верстку в переменную
  const modalContent = (
    <div className='fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200'>
      <div className='absolute inset-0 z-0' onClick={onClose} />

      <div className='bg-white w-full max-w-105 rounded-4xl p-8 relative shadow-2xl animate-in zoom-in-95 duration-200 z-10 overflow-hidden'>
        <button
          onClick={onClose}
          className='absolute top-6 right-6 text-gray-400 hover:text-[#4B4B4B] transition-colors z-20'
        >
          <X size={24} />
        </button>

        {/* ЕСЛИ ИДЕТ ЗАГРУЗКА */}
        {isPending ? (
          <div className='flex flex-col items-center justify-center py-10'>
            <Loader2 className='w-12 h-12 text-[#FFD600] animate-spin mb-4' />
            <p className='text-[#4B4B4B] font-bold font-rubik'>
              Проверяем билет...
            </p>
          </div>
        ) : /* ЕСЛИ ЕСТЬ РЕЗУЛЬТАТ */
        result ? (
          <div className='flex flex-col items-center text-center pt-4'>
            {result.isWinning ? (
              <>
                <div className='w-20 h-20 bg-[#D1F5D3] rounded-full flex items-center justify-center mb-4 shadow-sm'>
                  <Trophy className='w-10 h-10 text-[#1FAF38]' />
                </div>
                <h2 className='text-2xl font-black text-[#4B4B4B] uppercase font-benzin mb-2'>
                  Победа!
                </h2>
                <p className='text-[#737373] font-medium mb-6'>
                  {result.message}
                </p>
                <div className='bg-[#FFF0D4] px-6 py-3 rounded-2xl border border-[#F58220]/20'>
                  <span className='block text-[#F58220] text-xs font-bold uppercase mb-1'>
                    Ваш выигрыш
                  </span>
                  <span className='text-2xl font-black text-[#F58220]'>
                    {result.prizeAmount
                      ? `${result.prizeAmount} сом`
                      : result.prizeProduct}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 shadow-sm'>
                  <Frown className='w-10 h-10 text-gray-400' />
                </div>
                <h2 className='text-2xl font-black text-[#4B4B4B] uppercase font-benzin mb-2'>
                  Увы...
                </h2>
                <p className='text-[#737373] font-medium mb-6'>
                  {result.message || 'Этот билет не выиграл'}
                </p>
              </>
            )}

            <button
              onClick={() => reset()}
              className='mt-8 text-sm font-bold text-gray-400 hover:text-[#4B4B4B] underline cursor-pointer'
            >
              Проверить другой билет
            </button>
          </div>
        ) : (
          /* ЕСЛИ ЭТО ПРОСТО ФОРМА ВВОДА */
          <>
            <h2 className='text-3xl leading-tight font-black font-benzin uppercase text-[#4B4B4B] mb-2 pr-6'>
              Проверка билета
            </h2>
            <p className='text-sm font-medium font-rubik text-gray-400 mb-8'>
              Узнайте выиграли ли вы приз!
            </p>

            <form onSubmit={handleSubmit} className='flex flex-col'>
              <label className='block text-xs font-bold text-[#4B4B4B] font-rubik mb-2 ml-1'>
                Номер билета
              </label>
              <input
                type='text'
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value)}
                placeholder='Например: YT2357912'
                className='w-full bg-[#F5F5F5] rounded-2xl px-5 py-4 font-bold font-rubik text-sm text-[#4B4B4B] outline-none focus:ring-2 focus:ring-[#FFD600] transition-all placeholder:text-gray-300 mb-2'
              />

              <div className='h-6 mb-2 text-center flex items-center justify-center'>
                {error && (
                  <span className='text-red-500 text-xs font-bold'>
                    Код не найден или недействителен
                  </span>
                )}
              </div>

              <button
                type='submit'
                disabled={!ticketNumber.trim()}
                className='w-full bg-[#FFD600] text-[#4B4B4B] font-black uppercase py-4 rounded-full shadow-lg hover:bg-[#ffe033] active:scale-95 transition-all text-xs disabled:opacity-50 disabled:active:scale-100 cursor-pointer'
              >
                Проверить
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );

  // 🔥 Выкидываем модалку в корень документа (body)
  return createPortal(modalContent, document.body);
};
