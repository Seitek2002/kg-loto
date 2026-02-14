'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/ui/PageHeader';
import { LotteryCard } from '@/components/features/lottery/LotteryCard';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function ManualCheckPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [modalState, setModalState] = useState<'none' | 'loss' | 'win'>('none');

  // Эмуляция проверки
  const handleCheck = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const isWin = Math.random() > 0.5;
      setModalState(isWin ? 'win' : 'loss');
    }, 1500);
  };

  return (
    <div className='min-h-screen bg-[#F9F9F9] px-4 pt-2'>
      <PageHeader title='ПРОВЕРКА БИЛЕТА' />

      {/* ФОРМА */}
      <div className='mt-8 flex flex-col gap-6'>
        <div className='flex flex-col gap-2'>
          <label className='text-xs font-bold text-gray-900 font-benzin uppercase ml-2'>
            Номер тиража
          </label>
          <input
            type='text'
            placeholder='YT-2637-23'
            className='w-full h-14 px-5 rounded-2xl bg-white text-sm font-bold text-gray-900 shadow-sm border-none outline-none font-rubik placeholder:text-gray-300'
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label className='text-xs font-bold text-gray-900 font-benzin uppercase ml-2'>
            Номер билета
          </label>
          <input
            type='text'
            placeholder='YT2357912'
            className='w-full h-14 px-5 rounded-2xl bg-white text-sm font-bold text-gray-900 shadow-sm border-none outline-none font-rubik placeholder:text-gray-300'
          />
        </div>

        <button
          onClick={handleCheck}
          disabled={isLoading}
          className='mt-4 w-full h-14 bg-[#FFD600] text-black rounded-full font-benzin font-bold text-sm uppercase tracking-wider hover:bg-[#FFC000] active:scale-[0.98] transition-all shadow-lg flex items-center justify-center disabled:opacity-80'
        >
          {isLoading ? <Loader2 className='animate-spin' /> : 'Проверить'}
        </button>
      </div>

      {/* --- МОДАЛКА ПРОИГРЫША --- */}
      {modalState === 'loss' && (
        <div className='fixed inset-0 z-50 flex items-center justify-center px-6'>
          <div
            className='absolute inset-0 bg-black/60 backdrop-blur-sm'
            onClick={() => setModalState('none')}
          />

          <div className='relative bg-white w-full max-w-sm rounded-4xl p-8 text-center animate-in fade-in zoom-in-95'>
            <h3 className='text-xl font-black font-benzin uppercase text-[#2D2D2D] mb-3'>
              Билет не выиграл
            </h3>
            <p className='text-xs text-gray-500 font-rubik mb-8 leading-relaxed px-4'>
              Попробуйте в следующий раз — у вас всё получится!
            </p>

            <div className='flex gap-3'>
              <button
                onClick={() => setModalState('none')}
                className='flex-1 h-12 rounded-full border-2 border-gray-100 text-[#2D2D2D] font-benzin font-bold text-[10px] uppercase hover:bg-gray-50'
              >
                ОК
              </button>
              <button
                onClick={() => setModalState('none')}
                className='flex-1 h-12 rounded-full bg-[#FFD600] text-black font-benzin font-bold text-[10px] uppercase shadow-lg hover:bg-[#FFC000]'
              >
                Играть
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- МОДАЛКА ВЫИГРЫША --- */}
      {modalState === 'win' && (
        <div className='fixed inset-0 z-50 flex flex-col bg-[#F9F9F9] animate-in slide-in-from-bottom duration-300'>
          {/* Хедер модалки */}
          <div className='px-4 pt-4 flex items-center justify-between'>
            <button
              onClick={() => setModalState('none')}
              className='w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm'
            >
              <ArrowLeft size={20} />
            </button>
          </div>

          <div className='flex-1 px-4 flex flex-col justify-center pb-20'>
            <h2 className='text-xl font-black font-benzin uppercase text-[#2D2D2D] mb-2 text-left'>
              ПОЗДРАВЛЯЕМ! <br /> ВЫ ВЫИГРАЛИ!
            </h2>
            <p className='text-xs text-gray-500 font-rubik mb-8 leading-relaxed max-w-xs'>
              Популярные лотереи привлекают внимание благодаря крупным
              джекпотам...
            </p>

            <LotteryCard
              title='НАЗВАНИЕ ЛОТЕРЕИ'
              description='Популярные лотереи привлекают внимание...'
              prize='1 000 000 KGS'
              price={0}
              time='20:00'
              theme='white'
              variant='prize'
              ticketStatus='winning'
              backgroundId='8'
              prizeFontId='benzin'
            />

            {/* Кнопки действий */}
            <div className='flex flex-col gap-3 mt-4'>
              <button
                onClick={() => router.push('/scan/withdraw')}
                className='w-full h-14 bg-white border border-gray-200 text-black rounded-full font-benzin font-bold text-xs uppercase tracking-wider hover:bg-gray-50 shadow-sm'
              >
                Пополнить кошелек
              </button>
              <button className='w-full h-14 bg-white border border-gray-200 text-black rounded-full font-benzin font-bold text-xs uppercase tracking-wider hover:bg-gray-50 shadow-sm'>
                Забрать бесплатные билеты
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
