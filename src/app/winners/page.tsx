'use client';

import { useState, useMemo } from 'react';
import { Title } from '@/components/ui/Title';
import { Description } from '@/components/ui/Description';
import { WinnerCard } from '@/components/ui/WinnerCard';
import { clsx } from 'clsx';
import { useWinners } from '@/hooks/useWinners';
import { Header } from '@/components/ui/Header';
import { PageHeader } from '@/components/ui/PageHeader';

const FILTER_OPTIONS = [
  { label: 'Оной', value: 'оной' },
  { label: 'Мен миллионер', value: 'мен миллионер' },
  { label: 'Уйго белек', value: 'уйго белек' },
];

const ITEMS_PER_PAGE = 12;

export default function WinnersPage() {
  const { data: allWinners, isLoading } = useWinners();

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const filteredWinners = useMemo(() => {
    if (!allWinners) return [];
    if (selectedFilters.length === 0) return allWinners;

    return allWinners.filter((w) =>
      selectedFilters.includes(w.lotteryBadge.toLowerCase()),
    );
  }, [selectedFilters, allWinners]);

  const visibleWinners = filteredWinners.slice(0, visibleCount);

  const hasMore = visibleCount < filteredWinners.length;

  const toggleFilter = (value: string) => {
    setSelectedFilters((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const clearFilters = () => {
    setSelectedFilters([]);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const isAllSelected = selectedFilters.length === 0;

  return (
    <div className='min-h-screen bg-[#F9F9F9] pt-6 pb-20'>
      <Header theme='dark' />
      <PageHeader title='' />
      <div className='max-w-[1400px] mx-auto px-4 lg:mt-20'>
        <div className='mb-6 max-w-3xl'>
          <Title>ИСТОРИЯ ПОБЕДИТЕЛЕЙ</Title>
          <Description>
            Популярные лотереи привлекают внимание благодаря крупным джекпотам,
            частым тиражам и удобным условиям участия.
          </Description>
        </div>

        {/* ФИЛЬТРЫ */}
        <div className='mb-8 overflow-x-auto scrollbar-hide'>
          <div className='flex items-center gap-2 min-w-max pb-2'>
            <button
              onClick={clearFilters}
              className={clsx(
                'px-5 py-2.5 rounded-full text-xs font-bold font-benzin uppercase transition-all active:scale-95 border',
                isAllSelected
                  ? 'bg-[#2D2D2D] text-white border-[#2D2D2D]'
                  : 'bg-white text-[#2D2D2D] border-transparent shadow-sm hover:bg-gray-50',
              )}
            >
              Все
            </button>

            {FILTER_OPTIONS.map((option) => {
              const isActive = selectedFilters.includes(option.value);
              return (
                <button
                  key={option.value}
                  onClick={() => toggleFilter(option.value)}
                  className={clsx(
                    'px-5 py-2.5 rounded-full text-xs font-bold font-benzin uppercase transition-all active:scale-95 border',
                    isActive
                      ? 'bg-[#FFD600] text-[#2D2D2D] border-[#FFD600]'
                      : 'bg-white text-[#2D2D2D] border-transparent shadow-sm hover:bg-gray-50',
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* СПИСОК (Отображаем только visibleWinners) */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500'>
          {isLoading ? (
            // Простой скелетон или текст загрузки
            <div className='col-span-full text-center py-20 text-gray-400'>
              Загрузка...
            </div>
          ) : visibleWinners.length > 0 ? (
            visibleWinners.map((winner) => (
              <WinnerCard key={winner.id} winner={winner} />
            ))
          ) : (
            <div className='col-span-full text-center py-20 text-gray-400 font-rubik'>
              Победителей в этой категории пока нет
            </div>
          )}
        </div>

        {/* КНОПКА ЗАГРУЗИТЬ ЕЩЕ (Показываем только если есть скрытые элементы) */}
        {hasMore && (
          <div className='mt-12 flex justify-center'>
            <button
              onClick={handleLoadMore}
              className='bg-white text-[#2D2D2D] font-bold font-benzin uppercase text-xs py-4 px-12 rounded-full shadow-md hover:bg-gray-50 active:scale-95 transition-all'
            >
              Загрузить еще
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
