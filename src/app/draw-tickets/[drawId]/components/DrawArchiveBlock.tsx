'use client';

import { useState, useMemo, useEffect } from 'react';
import { clsx } from 'clsx';
import { DrawDetailsModal } from './DrawDetailsModal';
import { NumberedBall } from '@/components/ui/NumberedBall';
import { useCurrentDraws } from '@/hooks/useLotteries'; // 🔥 Подключаем наш хук
import { Loader2 } from 'lucide-react';

interface DrawArchiveBlockProps {
  lotteryId: string;
}

export const DrawArchiveBlock = ({ lotteryId }: DrawArchiveBlockProps) => {
  const [openMonths, setOpenMonths] = useState<string[]>([]);
  // ID тиража с бэкенда приходит строкой, поэтому string | null
  const [selectedDrawId, setSelectedDrawId] = useState<string | null>(null);

  // 1. Загружаем данные с бэкенда
  const { data: draws, isLoading, isError } = useCurrentDraws(lotteryId);

  // 2. Умная группировка по месяцам
  const archiveData = useMemo(() => {
    if (!draws) return [];

    // Оставляем только завершенные тиражи
    const completed = draws.filter(
      (d) => d.status === 'completed' || d.status === 'closed',
    );

    // Сортируем от новых к старым
    completed.sort(
      (a, b) => new Date(b.drawDate).getTime() - new Date(a.drawDate).getTime(),
    );

    const groups: Record<string, typeof completed> = {};

    completed.forEach((draw) => {
      const dateObj = new Date(draw.drawDate);
      // Превращаем '2026-04-10' в 'Апрель 2026'
      const monthStr = dateObj.toLocaleString('ru-RU', {
        month: 'long',
        year: 'numeric',
      });
      // Делаем первую букву заглавной
      const formattedMonth =
        monthStr.charAt(0).toUpperCase() + monthStr.slice(1);

      if (!groups[formattedMonth]) {
        groups[formattedMonth] = [];
      }
      groups[formattedMonth].push(draw);
    });

    // Преобразуем объект в массив для удобного рендера
    return Object.entries(groups).map(([month, items]) => ({
      month,
      items,
    }));
  }, [draws]);

  // Открываем первый месяц автоматически, когда данные загрузились
  useEffect(() => {
    if (archiveData.length > 0 && openMonths.length === 0) {
      setOpenMonths([archiveData[0].month]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archiveData]);

  const toggleMonth = (month: string) => {
    setOpenMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month],
    );
  };

  if (isLoading) {
    return (
      <div className='flex justify-center p-10 mt-8 lg:mt-12 bg-transparent lg:bg-white lg:rounded-4xl lg:shadow-sm lg:border lg:border-gray-100'>
        <Loader2 className='animate-spin text-[#FF7600] w-10 h-10' />
      </div>
    );
  }

  if (isError || archiveData.length === 0) {
    return (
      <div className='mt-8 lg:mt-12 bg-transparent lg:bg-white lg:rounded-4xl lg:p-10 lg:shadow-sm lg:border lg:border-gray-100 text-center font-medium text-gray-500'>
        Архив тиражей пока пуст.
      </div>
    );
  }

  return (
    <div className='mt-8 lg:mt-12 bg-transparent lg:bg-white lg:rounded-4xl lg:p-10 lg:shadow-sm lg:border lg:border-gray-100'>
      {/* ШАПКА ТАБЛИЦЫ (Только ПК) */}
      <div className='hidden lg:grid grid-cols-5 gap-4 items-center bg-[#F58220] rounded-full px-8 py-4 mb-6'>
        <div className='text-white font-bold text-[15px]'>Тираж</div>
        <div className='text-white font-bold text-[15px]'>Дата и время</div>
        <div className='text-white font-bold text-[15px]'>Приз</div>
        <div className='text-white font-bold text-[15px]'>
          Выигрышные комбинации
        </div>
        <div className='text-white font-bold text-[15px] text-right'>
          Дополнительно
        </div>
      </div>

      {/* СПИСОК МЕСЯЦЕВ (Аккордеон) */}
      <div className='flex flex-col gap-2 lg:gap-4'>
        {archiveData.map((group) => {
          const isOpen = openMonths.includes(group.month);

          return (
            <div key={group.month} className='flex flex-col'>
              {/* Заголовок аккордеона */}
              <button
                onClick={() => toggleMonth(group.month)}
                className='flex items-center gap-2 py-4 text-left w-full focus:outline-none'
              >
                <span className='text-[#4B4B4B] text-[18px] lg:text-[20px] font-bold'>
                  {group.month}
                </span>
                <svg
                  className={clsx(
                    'w-5 h-5 text-[#737373] transition-transform duration-300',
                    isOpen && 'rotate-180',
                  )}
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 9l-7 7-7-7'
                  />
                </svg>
              </button>

              {/* Тело аккордеона */}
              {isOpen && group.items.length > 0 && (
                <div className='flex flex-col lg:gap-0 gap-4 mb-4'>
                  {group.items.map((item) => {
                    // Форматируем дату (например: "10 апр. 2026. 20:00")
                    const dateObj = new Date(item.drawDate);
                    const formattedDate = `${dateObj.toLocaleString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }).replace(' г.', '')}. ${item.drawTime.slice(0, 5)}`;

                    return (
                      <div key={item.drawId} className='contents'>
                        {/* --- ДЕСКТОПНАЯ СТРОКА --- */}
                        <div className='hidden lg:grid grid-cols-5 gap-4 items-center px-8 py-5 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors rounded-2xl'>
                          <div className='text-[#4B4B4B] text-[15px]'>
                            №{item.drawNumber}
                          </div>
                          <div className='text-[#4B4B4B] text-[15px]'>
                            {formattedDate}
                          </div>
                          <div className='text-[#4B4B4B] text-[15px]'>
                            {item.jackpotAmount.toLocaleString('ru-RU')} с
                          </div>
                          <div className='flex gap-1.5 flex-wrap'>
                            {item.winningCombination ? (
                              item.winningCombination.map((num, i) => (
                                <NumberedBall key={i} number={num} size={32} />
                              ))
                            ) : (
                              <span className='text-gray-400 text-[14px]'>
                                Ожидается...
                              </span>
                            )}
                          </div>
                          <div
                            className='text-right text-[#4B4B4B] text-[14px] underline cursor-pointer hover:text-[#4B4B4B]'
                            onClick={() => setSelectedDrawId(item.drawId)}
                          >
                            Подробнее
                          </div>
                        </div>

                        {/* --- МОБИЛЬНАЯ КАРТОЧКА --- */}
                        <div
                          onClick={() => setSelectedDrawId(item.drawId)}
                          className='flex lg:hidden flex-col gap-3 bg-white p-5 rounded-[20px] shadow-sm border border-gray-100 active:scale-[0.98] transition-transform'
                        >
                          <div className='flex justify-between items-center'>
                            <span className='text-[#737373] text-[14px] font-medium'>
                              Тираж
                            </span>
                            <span className='text-[#4B4B4B] text-[14px] font-bold'>
                              №{item.drawNumber}
                            </span>
                          </div>
                          <div className='flex justify-between items-center'>
                            <span className='text-[#737373] text-[14px] font-medium'>
                              Приз
                            </span>
                            <span className='text-[#4B4B4B] text-[14px] font-bold'>
                              {item.jackpotAmount.toLocaleString('ru-RU')} с
                            </span>
                          </div>
                          <div className='flex justify-between items-center'>
                            <span className='text-[#737373] text-[14px] font-medium'>
                              Дата
                            </span>
                            <span className='text-[#4B4B4B] text-[14px] font-bold'>
                              {formattedDate}
                            </span>
                          </div>
                          <div className='flex justify-between items-center pt-1'>
                            <span className='text-[#737373] text-[14px] font-medium'>
                              Комбинации
                            </span>
                            <div className='flex gap-1 flex-wrap justify-end'>
                              {item.winningCombination ? (
                                item.winningCombination.map((num, i) => (
                                  <NumberedBall
                                    key={i}
                                    number={num}
                                    size={28}
                                  />
                                ))
                              ) : (
                                <span className='text-gray-400 text-[14px]'>
                                  ...
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <DrawDetailsModal
        isOpen={selectedDrawId !== null}
        onClose={() => setSelectedDrawId(null)}
        drawId={selectedDrawId}
      />
    </div>
  );
};
