'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import { DrawDetailsModal } from './DrawDetailsModal';
import { NumberedBall } from '@/components/ui/NumberedBall'; // 🔥 Импортируем компонент

// Моковые данные для архива
const MOCK_ARCHIVE_DATA = [
  {
    month: 'Апрель 2026',
    items: [
      {
        id: 1,
        draw: '№005034',
        date: '2 апр. 2026. 16:00',
        prize: '6 000 000 c',
        combinations: [1, 20, 32, 16, 8],
      },
      {
        id: 2,
        draw: '№005034',
        date: '2 апр. 2026. 16:00',
        prize: '6 000 000 c',
        combinations: [1, 20, 32, 16, 8],
      },
      {
        id: 3,
        draw: '№005034',
        date: '2 апр. 2026. 16:00',
        prize: '6 000 000 c',
        combinations: [1, 20, 32, 16, 8],
      },
      {
        id: 4,
        draw: '№005034',
        date: '2 апр. 2026. 16:00',
        prize: '6 000 000 c',
        combinations: [20, 32, 16, 8],
      }, // Для примера разное количество
      {
        id: 5,
        draw: '№005034',
        date: '2 апр. 2026. 16:00',
        prize: '6 000 000 c',
        combinations: [16, 8],
      },
      {
        id: 6,
        draw: '№005034',
        date: '2 апр. 2026. 16:00',
        prize: '6 000 000 c',
        combinations: [1, 20, 32, 16, 8],
      },
    ],
  },
  {
    month: 'Март 2026',
    items: [
      {
        id: 7,
        draw: '№005034',
        date: '2 мар. 2026. 16:00',
        prize: '6 000 000 c',
        combinations: [1, 20, 32, 16, 8],
      },
      {
        id: 8,
        draw: '№005034',
        date: '2 мар. 2026. 16:00',
        prize: '6 000 000 c',
        combinations: [1, 20, 32, 16, 8],
      },
    ],
  },
  { month: 'Февраль 2026', items: [] },
  { month: 'Январь 2026', items: [] },
];

export const DrawArchiveBlock = () => {
  // Состояние для открытых месяцев (по умолчанию открыт первый - Апрель)
  const [openMonths, setOpenMonths] = useState<string[]>([
    MOCK_ARCHIVE_DATA[0].month,
  ]);
  // НОВЫЙ СТЕЙТ
  const [selectedDrawId, setSelectedDrawId] = useState<number | null>(null);

  const toggleMonth = (month: string) => {
    setOpenMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month],
    );
  };

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
        {MOCK_ARCHIVE_DATA.map((group) => {
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
                  {group.items.map((item, index) => (
                    <div key={item.id} className='contents'>
                      {/* --- ДЕСКТОПНАЯ СТРОКА --- */}
                      <div className='hidden lg:grid grid-cols-5 gap-4 items-center px-8 py-5 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors rounded-2xl'>
                        <div className='text-[#4B4B4B] text-[15px]'>
                          {item.draw}
                        </div>
                        <div className='text-[#4B4B4B] text-[15px]'>
                          {item.date}
                        </div>
                        <div className='text-[#4B4B4B] text-[15px]'>
                          {item.prize}
                        </div>
                        <div className='flex gap-1.5 flex-wrap'>
                          {item.combinations.map((num, i) => (
                            // 🔥 Заменили на NumberedBall, выставили размер 32px (w-8 h-8)
                            <NumberedBall key={i} number={num} size={32} />
                          ))}
                        </div>
                        <div
                          className='text-right text-[#4B4B4B] text-[14px] underline cursor-pointer hover:text-[#4B4B4B]'
                          onClick={() => setSelectedDrawId(item.id)}
                        >
                          Подробнее
                        </div>
                      </div>

                      {/* --- МОБИЛЬНАЯ КАРТОЧКА --- */}
                      <div
                        onClick={() => setSelectedDrawId(item.id)}
                        className='flex lg:hidden flex-col gap-3 bg-white p-5 rounded-[20px] shadow-sm border border-gray-100'
                      >
                        <div className='flex justify-between items-center'>
                          <span className='text-[#737373] text-[14px] font-medium'>
                            Тираж
                          </span>
                          <span className='text-[#4B4B4B] text-[14px] font-bold'>
                            {item.draw}
                          </span>
                        </div>
                        <div className='flex justify-between items-center'>
                          <span className='text-[#737373] text-[14px] font-medium'>
                            Приз
                          </span>
                          <span className='text-[#4B4B4B] text-[14px] font-bold'>
                            {item.prize}
                          </span>
                        </div>
                        <div className='flex justify-between items-center'>
                          <span className='text-[#737373] text-[14px] font-medium'>
                            Дата
                          </span>
                          <span className='text-[#4B4B4B] text-[14px] font-bold'>
                            {item.date}
                          </span>
                        </div>
                        <div className='flex justify-between items-center pt-1'>
                          <span className='text-[#737373] text-[14px] font-medium'>
                            Комбинации
                          </span>
                          <div className='flex gap-1 flex-wrap justify-end'>
                            {item.combinations.map((num, i) => (
                              // 🔥 Заменили на NumberedBall, выставили размер 28px
                              <NumberedBall key={i} number={num} size={28} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Если нет тиражей в месяце */}
              {isOpen && group.items.length === 0 && (
                <div className='text-gray-400 py-4 text-center lg:text-left lg:px-8'>
                  Нет данных за этот период
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
