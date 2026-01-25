'use client';

import { clsx } from 'clsx';

interface PrizeTabsProps {
  activeTab: 'received' | 'waiting';
  onChange: (tab: 'received' | 'waiting') => void;
}

export const PrizeTabs = ({ activeTab, onChange }: PrizeTabsProps) => {
  return (
    <div className='bg-[#EBEBEB] p-1 rounded-full flex relative h-12 shadow-inner'>
      {/* Кнопка "Получены" */}
      <button
        onClick={() => onChange('received')}
        className={clsx(
          'flex-1 rounded-full text-[10px] font-bold font-benzin uppercase transition-colors duration-200 relative z-10',
          activeTab === 'received'
            ? 'text-[#2D2D2D]'
            : 'text-gray-400 hover:text-gray-600',
        )}
      >
        Получены
      </button>

      {/* Кнопка "Ожидают" */}
      <button
        onClick={() => onChange('waiting')}
        className={clsx(
          'flex-1 rounded-full text-[10px] font-bold font-benzin uppercase transition-colors duration-200 relative z-10',
          activeTab === 'waiting'
            ? 'text-[#2D2D2D]'
            : 'text-gray-400 hover:text-gray-600',
        )}
      >
        Ожидают
      </button>

      {/* Белая плашка (фон активной кнопки), которая ездит туда-сюда */}
      <div
        className={clsx(
          'absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-sm transition-all duration-300 ease-in-out',
          activeTab === 'received' ? 'left-1' : 'left-[calc(50%+2px)]',
        )}
      />
    </div>
  );
};
