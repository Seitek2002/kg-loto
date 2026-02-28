'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Description } from '@/components/ui/Description';
import { Title } from '@/components/ui/Title';
import CheckResultModal from '@/components/features/modal/CheckResultModal';
import { AuthModal } from '@/components/features/modal/AuthModal';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { useAuthStore } from '@/store/auth';
import { TicketService } from '@/services/ticket'; // 🔥 Импортируем наш сервис
import { Loader2, AlertCircle, X } from 'lucide-react';
import clsx from 'clsx';

export const CheckLottery = () => {
  const [ticketNumber, setTicketNumber] = useState('');
  const { isAuth } = useAuthStore();

  // Стейты модалок и ошибок
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [genericError, setGenericError] = useState<string | null>(null);

  // Стейт результата
  const [isWin, setIsWin] = useState(false);
  const [winAmount, setWinAmount] = useState<string | null>(null);

  // 🔥 Элегантная мутация через React Query
  const checkMutation = useMutation({
    mutationFn: (code: string) => TicketService.checkCombination(code),
    onSuccess: (data) => {
      // Бэк ответил 200 OK
      setIsWin(data.is_winning);
      setWinAmount(data.prize_amount || null);
      setIsResultModalOpen(true);
    },
    onError: (error: any) => {
      console.error('Ошибка проверки билета:', error);
      const status = error.response?.status;

      if (status === 401 || status === 403) {
        setIsAuthModalOpen(true); // Токен протух
      } else if (status === 404 || status === 400) {
        // Билет не найден или код невалидный -> проигрыш
        setIsWin(false);
        setWinAmount(null);
        setIsResultModalOpen(true);
      } else {
        // Упал сервер (500)
        setGenericError('Что-то пошло не так. Пожалуйста, попробуйте позже.');
      }
    },
  });

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedNumber = ticketNumber.trim();

    // Защита от пустых сабмитов и если запрос уже идет (checkMutation.isPending)
    if (!trimmedNumber || checkMutation.isPending) return;

    if (!isAuth) {
      setIsAuthModalOpen(true);
      return;
    }

    setGenericError(null);
    // 🔥 Запускаем мутацию
    checkMutation.mutate(trimmedNumber);
  };

  return (
    <section className='my-12 lg:my-25' id='check'>
      <Title>ПРОВЕРКА ЛОТЕРЕИ</Title>
      <Description>
        Популярные лотереи привлекают внимание благодаря крупным джекпотам,
        частым тиражам и удобным условиям участия.
      </Description>

      <form
        onSubmit={handleCheck}
        className='flex flex-col lg:flex-row gap-6 lg:items-end lg:mt-10'
      >
        <div className='flex flex-col gap-2 lg:w-1/2'>
          <label
            htmlFor='draw-number'
            className='text-xs lg:text-xl font-bold text-gray-900 font-rubik'
          >
            Номер билета
          </label>
          <input
            id='draw-number'
            type='text'
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value)}
            placeholder='Например: 100'
            disabled={checkMutation.isPending} // 🔥 Используем состояние мутации
            className='w-full lg:text-xl p-4 lg:py-7 lg:px-10 rounded-full lg:rounded-r-none bg-white text-sm text-gray-900 placeholder:text-gray-400 border-none outline-none focus:ring-2 focus:ring-[#FFD600] focus:shadow-lg transition-all duration-300 font-rubik disabled:opacity-60 disabled:cursor-not-allowed'
          />
        </div>

        <MagneticButton className='w-full lg:w-1/2 mt-4 lg:mt-0'>
          <button
            type='submit'
            disabled={!ticketNumber.trim() || checkMutation.isPending} // 🔥 Используем состояние мутации
            className={clsx(
              'cursor-pointer lg:rounded-l-none lg:text-xl w-full h-11.5 lg:h-auto lg:py-7 bg-[#262626] text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2',
              !ticketNumber.trim() || checkMutation.isPending
                ? 'opacity-70 cursor-not-allowed'
                : 'hover:bg-black active:scale-[0.98]',
            )}
          >
            {checkMutation.isPending ? (
              <>
                <Loader2 size={18} className='animate-spin' />
                Проверка...
              </>
            ) : (
              'Проверить'
            )}
          </button>
        </MagneticButton>
      </form>

      {/* Модалки оставляем как есть */}
      <CheckResultModal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        isWin={isWin}
        ticketNumber={ticketNumber}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialStep='login'
      />

      {genericError && (
        <div className='fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in'>
          <div className='bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full flex flex-col items-center text-center shadow-2xl relative animate-in zoom-in-95'>
            <button
              onClick={() => setGenericError(null)}
              className='absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors'
            >
              <X size={24} />
            </button>
            <div className='w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4'>
              <AlertCircle size={32} />
            </div>
            <h3 className='text-xl font-black font-benzin uppercase text-[#1C2035] mb-2'>
              Ошибка сервера
            </h3>
            <p className='text-sm text-gray-500 font-rubik mb-6'>
              {genericError}
            </p>
            <button
              onClick={() => setGenericError(null)}
              className='w-full py-4 bg-[#FFD600] text-[#2D2D2D] rounded-full font-bold uppercase tracking-wider text-sm hover:bg-[#FFC000] active:scale-95 transition-all'
            >
              Понятно
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
