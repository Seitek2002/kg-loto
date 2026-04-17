'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { useCurrentLotteries, CurrentLottery } from '@/hooks/useLotteries';

// 🔥 Компонент живого таймера
const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft('Продажи закрыты');
        clearInterval(interval);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // Форматируем вывод
      if (days > 0) {
        setTimeLeft(
          `${days} дн. ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
        );
      } else {
        setTimeLeft(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
        );
      }
    }, 1000);

    // Вызываем сразу, чтобы не было задержки в 1 секунду при рендере
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className='absolute top-4 left-4 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full px-3 py-1.5 flex items-center gap-2 text-[12px] md:text-[14px] font-medium shadow-sm z-10'>
      <Clock size={16} />
      {timeLeft || 'Вычисление...'}
    </div>
  );
};

export default function DrawTicketsPage() {
  // 🔥 Достаем данные из кэшируемого хука
  const { data: lotteries, isLoading, isError } = useCurrentLotteries();

  return (
    <div className='min-h-screen bg-[#F5F5F5] font-rubik pb-32 md:pb-12 select-none'>
      <div className='max-w-[1045px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-10'>
        {/* Хлебные крошки */}
        <div className='flex items-center gap-2 text-[13px] md:text-base text-[#4B4B4B] font-medium mb-6 md:mb-8'>
          <Link href='/' className='hover:opacity-80 transition-opacity'>
            Главная
          </Link>
          <span className='text-gray-400'>/</span>
          <span className='font-bold text-[#2D2D2D]'>Тиражные лотереи</span>
        </div>

        {/* Сетка карточек лотерей */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
          {isLoading ? (
            // Рендерим 4 скелетона для красивой загрузки
            Array.from({ length: 4 }).map((_, i) => (
              <LotteryCardSkeleton key={i} />
            ))
          ) : isError ? (
            <div className='col-span-full flex flex-col items-center justify-center py-10 text-red-500 font-medium gap-2'>
              Ошибка при загрузке лотерей
            </div>
          ) : lotteries && lotteries.length > 0 ? (
            lotteries.map((lottery) => (
              <LotteryCard key={lottery.lotteryId} lottery={lottery} />
            ))
          ) : (
            <div className='col-span-full text-center py-10 text-gray-500 font-medium'>
              Нет доступных лотерей
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 🔥 Компонент Карточки
function LotteryCard({ lottery }: { lottery: CurrentLottery }) {
  // Заглушки, пока бэкенд не добавит эти поля
  const fallbackImage =
    'https://images.unsplash.com/photo-1621360841013-c76831f1dbce?q=80&w=600&auto=format&fit=crop';
  const fallbackPrize = '6 000 000';

  return (
    <Link
      href={`/draw-tickets/${lottery.lotteryId}`} // Переход на детали по lotteryId
      className='group relative w-full aspect-[16/9] sm:aspect-[4/2.5] rounded-[24px] overflow-hidden block active:scale-[0.98] transition-transform duration-200'
    >
      {/* Фоновая картинка (единая заглушка) */}
      <Image
        src={fallbackImage}
        alt={lottery.name}
        fill
        sizes='(max-width: 768px) 100vw, 50vw'
        className='object-cover transition-transform duration-500 group-hover:scale-105'
      />

      {/* Затемнение для читаемости текста */}
      <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10' />

      {/* Таймер (Слева сверху) */}
      <CountdownTimer targetDate={lottery.saleEndAt} />

      {/* Контент (Слева снизу) */}
      <div className='absolute bottom-5 left-5 md:bottom-6 md:left-6 flex flex-col gap-1 md:gap-2 z-10'>
        <span className='text-white font-bold text-[14px] md:text-[18px]'>
          {lottery.name}
        </span>

        <div className='text-[#FFD600] font-black text-[28px] md:text-[40px] leading-none drop-shadow-md flex items-end gap-2'>
          {fallbackPrize}
          <span className='text-white text-[20px] md:text-[28px] underline decoration-2 underline-offset-4 mb-1'>
            с
          </span>
        </div>

        <button className='mt-2 bg-white text-[#2D2D2D] rounded-full px-5 py-2 md:py-2.5 text-[12px] md:text-[14px] font-black uppercase tracking-wide w-max shadow-md group-hover:bg-[#FFD600] transition-colors duration-300'>
          Играть • {lottery.ticketPrice} СОМ
        </button>
      </div>
    </Link>
  );
}

// 🔥 Нативный Скелетон
function LotteryCardSkeleton() {
  return (
    <div className='relative w-full aspect-[16/9] sm:aspect-[4/2.5] rounded-[24px] overflow-hidden bg-gray-200 animate-pulse'>
      <div className='absolute top-4 left-4 bg-gray-300 rounded-full w-32 h-8' />
      <div className='absolute bottom-5 left-5 md:bottom-6 md:left-6 flex flex-col gap-3 z-10 w-full'>
        <div className='bg-gray-300 rounded-md w-3/4 h-5 md:h-6' />
        <div className='bg-gray-300 rounded-md w-1/2 h-8 md:h-10' />
        <div className='bg-gray-300 rounded-full w-40 h-9 md:h-10 mt-1' />
      </div>
    </div>
  );
}
