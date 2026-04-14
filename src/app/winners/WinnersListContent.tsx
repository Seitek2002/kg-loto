'use client';

import { useState, useMemo } from 'react';
import { Title } from '@/components/ui/Title';
import { Description } from '@/components/ui/Description';
import { WinnerCard } from '@/components/ui/WinnerCard';
import { clsx } from 'clsx';
import { useWinners } from '@/hooks/useWinners';
import { PageHeader } from '@/components/ui/PageHeader';

const ITEMS_PER_PAGE = 12;

export const WinnersListContent = () => {
  const { data: allWinners, isLoading } = useWinners();

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // 🔥 ДИНАМИЧЕСКИЕ ФИЛЬТРЫ
  const dynamicFilters = useMemo(() => {
    if (!allWinners) return [];

    // Вытаскиваем все значения lotteryBadge
    const allBadges = allWinners.map((w) => w.lotteryBadge);

    // Используем Set, чтобы оставить только уникальные значения
    const uniqueBadges = Array.from(new Set(allBadges));

    // Формируем массив объектов для кнопок фильтра
    return uniqueBadges.map((badge) => ({
      label: badge, // Для отображения пользователю (с заглавной буквы)
      value: badge?.toLowerCase(), // Для внутренней логики фильтрации
    }));
  }, [allWinners]);

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
    <div className='min-h-screen bg-[#F9F9F9] pb-20'>
      <div className='px-4'>
        <PageHeader title='Победители' />
      </div>

      <div className='max-w-350 mx-auto pt-4 lg:pt-20 px-4 lg:mt-20'>
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
                  ? 'bg-[#4B4B4B] text-white border-[#4B4B4B]'
                  : 'bg-white text-[#4B4B4B] border-transparent shadow-sm hover:bg-gray-50',
              )}
            >
              Все
            </button>

            {/* 🔥 Используем наши динамические фильтры */}
            {dynamicFilters.map((option, i) => {
              const isActive = selectedFilters.includes(option.value);

              return (
                <button
                  key={i}
                  onClick={() => toggleFilter(option.value)}
                  className={clsx(
                    'px-5 py-2.5 rounded-full text-xs font-bold font-benzin uppercase transition-all active:scale-95 border',
                    isActive
                      ? 'bg-[#FFD600] text-[#4B4B4B] border-[#FFD600]'
                      : 'bg-white text-[#4B4B4B] border-transparent shadow-sm hover:bg-gray-50',
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

        {/* КНОПКА ЗАГРУЗИТЬ ЕЩЕ */}
        {hasMore && (
          <div className='mt-12 flex justify-center'>
            <button
              onClick={handleLoadMore}
              className='bg-white text-[#4B4B4B] font-bold font-benzin uppercase text-xs py-4 px-12 rounded-full shadow-md hover:bg-gray-50 active:scale-95 transition-all'
            >
              Загрузить еще
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
