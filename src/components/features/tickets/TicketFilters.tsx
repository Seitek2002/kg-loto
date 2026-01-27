'use client';

import { clsx } from 'clsx';
import { useTicketsStore, TicketStatus } from '@/store/tickets'; // Импорт стора

const filters = [
  { label: 'Все билеты', value: 'all' },
  { label: 'Выигрышные', value: 'winning' },
  { label: 'Проигрышные', value: 'losing' },
  { label: 'Не проверенные', value: 'pending' },
];

export const TicketFilters = () => {
  const { filter, setFilter } = useTicketsStore();

  return (
    <div className='flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide'>
      {filters.map((f) => {
        const isActive = filter === f.value;
        return (
          <button
            key={f.value}
            onClick={() => setFilter(f.value as TicketStatus | 'all')}
            className={clsx(
              'px-6 py-3 rounded-full font-bold text-xs font-benzin uppercase whitespace-nowrap transition-all',
              isActive
                ? 'bg-[#2D2D2D] text-white shadow-lg'
                : 'bg-white text-[#2D2D2D] border border-gray-100',
            )}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
};
