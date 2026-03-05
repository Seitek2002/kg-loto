import { Title } from '@/components/ui/Title';
import { clsx } from 'clsx';
import { getTranslations } from 'next-intl/server';
import { LotteryPrizeTier } from '@/types/api';
import { DraggableScroll } from '@/components/ui/DraggableScroll';

export const LotteryPrizeFund = async ({
  prizeTiers,
}: {
  prizeTiers: LotteryPrizeTier[];
}) => {
  if (!prizeTiers || prizeTiers.length === 0) return null;
  const t = await getTranslations('lottery');

  return (
    <section className='mb-12 md:mb-20'>
      <div className='mb-10'>
        <Title>{t('prize_fund')}</Title>
      </div>

      {/* --- МОБИЛЬНАЯ ВЕРСИЯ --- */}
      <div className='md:hidden bg-white rounded-[24px] shadow-sm border border-gray-100 p-5 sm:p-6 mt-4'>
        <div className='grid grid-cols-2 gap-4 mb-5 border-b border-gray-100 pb-4'>
          <div className='text-center text-[11px] sm:text-xs font-medium text-[#4B4B4B] font-rubik leading-snug'>
            {t('win_amount')}
          </div>
          <div className='text-center text-[11px] sm:text-xs font-medium text-[#4B4B4B] font-rubik leading-snug'>
            {t('winners_count')}
          </div>
        </div>
        <div className='flex flex-col gap-4 sm:gap-5'>
          {prizeTiers.map((item) => (
            <div key={item.id} className='grid grid-cols-2 gap-4 items-center'>
              <span className='text-center font-black text-[#F5A623] text-xl sm:text-[22px] whitespace-nowrap leading-none'>
                {item.amount}
              </span>
              <span className='text-center font-bold text-[#2D2D2D] text-xl sm:text-[22px] whitespace-nowrap leading-none'>
                {item.winners}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* --- ДЕСКТОПНАЯ ВЕРСИЯ --- */}
      <div className='hidden md:block w-full mt-4 bg-white shadow-sm rounded-[32px] border border-gray-100 overflow-hidden relative'>
        {/* 🔥 Обертка, которая дает нам скролл мышкой */}
        <DraggableScroll
          className={clsx(
            'flex items-center w-full min-w-0 pb-6 pt-10',
            '[&::-webkit-scrollbar]:h-1.5',
            '[&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-50',
            '[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200',
            'hover:[&::-webkit-scrollbar-thumb]:bg-gray-300',
          )}
        >
          {/* 🔥 ЛИПКАЯ ЛЕВАЯ ЧАСТЬ */}
          <div className='sticky left-0 z-10 flex items-center bg-white pl-10 pr-6 py-2 shadow-[10px_0_15px_-3px_rgba(255,255,255,0.8)]'>
            <div className='flex flex-col gap-6 justify-center shrink-0'>
              <div className='text-base font-medium text-[#4B4B4B] font-rubik'>
                {t('win_amount')}
              </div>
              <div className='text-base font-medium text-[#4B4B4B] font-rubik'>
                {t('winners_count')}
              </div>
            </div>
            <div className='w-px h-[80px] bg-[#6E6E6E] ml-[22px]'></div>
          </div>

          {/* СПИСОК ПРИЗОВ */}
          <div className='flex gap-[73px] flex-nowrap pl-10 pr-10'>
            {prizeTiers.map((item) => (
              <div
                key={item.id}
                className='flex flex-col items-center shrink-0 gap-4 text-sm lg:text-[34px]'
              >
                <span className='font-black text-[#F5A623] whitespace-nowrap'>
                  {item.amount}
                </span>
                <span className='font-bold text-[#2D2D2D] whitespace-nowrap'>
                  {item.winners}
                </span>
              </div>
            ))}
          </div>
        </DraggableScroll>
      </div>
    </section>
  );
};
