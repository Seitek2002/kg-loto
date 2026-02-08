'use client';

import { useState, useMemo } from 'react';
import { Title } from '@/components/ui/Title';
import { Description } from '@/components/ui/Description';
import { WinnerCard } from '@/components/ui/WinnerCard';
import { clsx } from 'clsx';
import { WINNERS_MOCK } from '@/data/mock-content';

// Опции для фильтра
const FILTER_OPTIONS = [
  { label: 'Оной', value: 'оной' },
  { label: 'Мен миллионер', value: 'мен миллионер' },
  { label: 'Уйго белек', value: 'уйго белек' },
];

export default function WinnersPage() {
  // Состояние фильтров (массив выбранных значений)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Логика фильтрации
  const filteredWinners = useMemo(() => {
    if (selectedFilters.length === 0) return WINNERS_MOCK;
    return WINNERS_MOCK.filter((w) => selectedFilters.includes(w.lotteryBadge));
  }, [selectedFilters]);

  // Обработчик клика по фильтру
  const toggleFilter = (value: string) => {
    setSelectedFilters((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value) // Убрать
        : [...prev, value] // Добавить
    );
  };

  // Сброс фильтров ("Все")
  const clearFilters = () => {
    setSelectedFilters([]);
  };

  const isAllSelected = selectedFilters.length === 0;

  return (
    <div className='min-h-screen bg-[#F9F9F9] pt-6 pb-20'>
      <div className='max-w-[1400px] mx-auto px-4'>
        {/* ЗАГОЛОВОК */}
        <div className='mb-6 max-w-3xl'>
          <Title>ИСТОРИЯ ПОБЕДИТЕЛЕЙ</Title>
          <Description>
            Популярные лотереи привлекают внимание благодаря крупным джекпотам,
            частым тиражам и удобным условиям участия.
          </Description>
        </div>

        {/* ГОРИЗОНТАЛЬНЫЙ ФИЛЬТР (как на странице Tickets) */}
        <div className='mb-8 overflow-x-auto scrollbar-hide'>
          <div className='flex items-center gap-2 min-w-max pb-2'>
            {/* Кнопка "Все" */}
            <button
              onClick={clearFilters}
              className={clsx(
                'px-5 py-2.5 rounded-full text-xs font-bold font-benzin uppercase transition-all active:scale-95 border',
                isAllSelected
                  ? 'bg-[#2D2D2D] text-white border-[#2D2D2D]' // Активный стиль
                  : 'bg-white text-[#2D2D2D] border-transparent shadow-sm hover:bg-gray-50' // Неактивный стиль
              )}
            >
              Все
            </button>

            {/* Остальные фильтры */}
            {FILTER_OPTIONS.map((option) => {
              const isActive = selectedFilters.includes(option.value);
              return (
                <button
                  key={option.value}
                  onClick={() => toggleFilter(option.value)}
                  className={clsx(
                    'px-5 py-2.5 rounded-full text-xs font-bold font-benzin uppercase transition-all active:scale-95 border',
                    isActive
                      ? 'bg-[#FFD600] text-[#2D2D2D] border-[#FFD600]' // Активный стиль (Желтый)
                      : 'bg-white text-[#2D2D2D] border-transparent shadow-sm hover:bg-gray-50' // Неактивный стиль
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* СЕТКА ПОБЕДИТЕЛЕЙ */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500'>
          {filteredWinners.length > 0 ? (
            filteredWinners.map((winner) => (
              <WinnerCard key={winner.id} winner={winner} />
            ))
          ) : (
            <div className='col-span-full text-center py-20 text-gray-400 font-rubik'>
              Победителей в этой категории пока нет
            </div>
          )}
        </div>

        {/* КНОПКА ЗАГРУЗИТЬ ЕЩЕ */}
        {filteredWinners.length > 0 && (
          <div className='mt-12 flex justify-center'>
            <button className='bg-white text-[#2D2D2D] font-bold font-benzin uppercase text-xs py-4 px-12 rounded-full shadow-md hover:bg-gray-50 active:scale-95 transition-all'>
              Загрузить еще
            </button>
          </div>
        )}
      </div>
    </div>
  );
}