'use client';

import { useState, useMemo } from 'react';
import { Title } from '@/components/ui/Title';
import { Description } from '@/components/ui/Description';
import { WinnerCard } from '@/components/ui/WinnerCard';
import { ChevronDown, Check } from 'lucide-react';
import { clsx } from 'clsx';
// import { useClickOutside } from '@/hooks/useClickOutside';
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Логика фильтрации
  const filteredWinners = useMemo(() => {
    if (selectedFilters.length === 0) return WINNERS_MOCK;
    return WINNERS_MOCK.filter((w) => selectedFilters.includes(w.lotteryBadge));
  }, [selectedFilters]);

  // Обработчик клика по чекбоксу
  const toggleFilter = (value: string) => {
    setSelectedFilters(
      (prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value) // Убрать если есть
          : [...prev, value], // Добавить если нет
    );
  };

  // Обработчик "Все"
  const toggleAll = () => {
    if (selectedFilters.length === 0) {
      // Если ничего не выбрано -> выбрать всё?
      // Обычно "Все" значит "Очистить фильтры", чтобы показать всё.
      // Но на дизайне галочки. Сделаем так: "Все" - это очистка массива.
    } else {
      setSelectedFilters([]);
    }
  };

  const isAllSelected = selectedFilters.length === 0;

  return (
    <div className='min-h-screen bg-[#F9F9F9] pt-6 pb-20'>
      <div className='max-w-350 mx-auto px-4'>
        {/* ХЕДЕР + ФИЛЬТР */}
        <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between mb-10 gap-6 relative'>
          <div className='max-w-3xl mb-4'>
            <Title>ИСТОРИЯ ПОБЕДИТЕЛЕЙ</Title>
            <Description>
              Популярные лотереи привлекают внимание благодаря крупным
              джекпотам, частым тиражам и удобным условиям участия.
            </Description>
          </div>

          {/* КНОПКА ФИЛЬТРАЦИИ */}
          <div className='relative z-20 self-start lg:self-auto'>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className='flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-sm border border-gray-100 active:scale-95 transition-transform'
            >
              <div className='flex flex-col items-start'>
                <span className='text-xs font-black font-benzin uppercase text-[#2D2D2D]'>
                  Фильтрация
                </span>
              </div>
              <ChevronDown
                size={16}
                className={clsx(
                  'transition-transform',
                  isFilterOpen && 'rotate-180',
                )}
              />
            </button>

            {/* ВЫПАДАЮЩИЙ СПИСОК (DROPDOWN) */}
            {isFilterOpen && (
              <div className='absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right'>
                {/* Пункт "Все" */}
                <div
                  onClick={toggleAll}
                  className='flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors'
                >
                  <div
                    className={clsx(
                      'w-5 h-5 rounded-md border flex items-center justify-center transition-colors',
                      isAllSelected
                        ? 'bg-[#2D2D2D] border-[#2D2D2D]'
                        : 'border-gray-300',
                    )}
                  >
                    {isAllSelected && (
                      <Check size={12} className='text-white' />
                    )}
                  </div>
                  <span className='text-xs font-bold font-benzin uppercase text-[#2D2D2D]'>
                    Все
                  </span>
                </div>

                <div className='h-px bg-gray-100 my-1 mx-2' />

                {/* Опции лотерей */}
                {FILTER_OPTIONS.map((option) => {
                  const isSelected = selectedFilters.includes(option.value);
                  return (
                    <div
                      key={option.value}
                      onClick={() => toggleFilter(option.value)}
                      className='flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors'
                    >
                      <div
                        className={clsx(
                          'w-5 h-5 rounded-md border flex items-center justify-center transition-colors',
                          isSelected
                            ? 'bg-[#FFD600] border-[#FFD600]'
                            : 'border-gray-300',
                        )}
                      >
                        {isSelected && (
                          <Check size={12} className='text-[#2D2D2D]' />
                        )}
                      </div>
                      <span className='text-xs font-bold font-benzin uppercase text-[#2D2D2D]'>
                        {option.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* СЕТКА (GRID) */}
        {/* Mobile: 2 col, Desktop: 4 col */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6'>
          {filteredWinners.map((winner) => (
            <WinnerCard key={winner.id} winner={winner} />
          ))}
        </div>

        {/* КНОПКА ЗАГРУЗИТЬ ЕЩЕ */}
        <div className='mt-12 flex justify-center'>
          <button className='bg-white text-[#2D2D2D] font-bold font-benzin uppercase text-xs py-4 px-12 rounded-full shadow-md hover:bg-gray-50 active:scale-95 transition-all'>
            Загрузить еще
          </button>
        </div>
      </div>
    </div>
  );
}
