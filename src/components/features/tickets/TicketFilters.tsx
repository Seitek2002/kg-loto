'use client';

import { useState } from 'react';
import { clsx } from 'clsx';

const filters = [
  'Выигрышные',
  'Проигрышные',
  'Не проверенные',
  'Архив',
  'Избранное', // Добавил для теста скролла
];

export const TicketFilters = () => {
  const [activeFilter, setActiveFilter] = useState('Выигрышные');

  return (
    // overflow-x-auto позволяет скроллить по горизонтали
    // no-scrollbar скрывает полосу прокрутки (надо добавить в globals.css или использовать плагин, но пока так)
    <div className='flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide'>
      {filters.map((filter) => {
        const isActive = activeFilter === filter;
        return (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={clsx(
              'px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all border border-transparent',
              isActive
                ? 'bg-[#2D2D2D] text-white shadow-lg' // Активный: темный
                : 'bg-white text-[#2D2D2D] border border-gray-100', // Неактивный: белый
            )}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
};
