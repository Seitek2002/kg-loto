'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Title } from '@/components/ui/Title';
import { Description } from '@/components/ui/Description';
import { PageHeader } from '@/components/ui/PageHeader';
import { LotteryCard } from '@/components/features/lottery/LotteryCard';
import { LotteryItem } from '@/types/api';
import { clsx } from 'clsx';

interface LotteryListContentProps {
  initialLotteries: LotteryItem[];
  pageTitle: string;
  title: string;
  description: string;
}

const ITEMS_PER_PAGE = 8;

const formatTime = (time: string) => {
  if (!time) return '00:00';
  return time.split(':').slice(0, 2).join(':');
};

export const LotteryListContent = ({
  initialLotteries,
  pageTitle,
  title,
  description,
}: LotteryListContentProps) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // 🔥 1. Динамически собираем уникальные названия для фильтров
  const filterOptions = useMemo(() => {
    if (!initialLotteries) return [];

    // Вытаскиваем все title, убираем пустые и оставляем только уникальные
    const uniqueTitles = Array.from(
      new Set(initialLotteries.map((loto) => loto.title).filter(Boolean)),
    );

    // Превращаем массив строк в массив объектов { label, value }
    return uniqueTitles.map((t) => ({
      label: t,
      value: t.toLowerCase(),
    }));
  }, [initialLotteries]);

  // 🔥 2. Логика фильтрации (теперь ищем точное совпадение)
  const filteredLotteries = useMemo(() => {
    if (!initialLotteries) return [];
    if (selectedFilters.length === 0) return initialLotteries;

    return initialLotteries.filter((loto) => {
      const targetField = (loto.title || '').toLowerCase();
      return selectedFilters.includes(targetField);
    });
  }, [selectedFilters, initialLotteries]);

  const visibleLotteries = filteredLotteries.slice(0, visibleCount);
  const hasMore = visibleCount < filteredLotteries.length;
  const isAllSelected = selectedFilters.length === 0;

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

  if (!initialLotteries) return null;

  return (
    <div className='min-h-screen bg-[#F9F9F9] pt-0 pb-20'>
      <div className='px-4'>
        <PageHeader title={pageTitle} />
      </div>

      <div className='max-w-350 mx-auto pt-4 lg:pt-20 px-4 lg:mt-20'>
        <div className='mb-10 max-w-3xl'>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </div>

        {/* ПАНЕЛЬ ФИЛЬТРОВ */}
        {filterOptions.length > 0 && (
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

              {/* 🔥 Рендерим динамические кнопки */}
              {filterOptions.map((option) => {
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
        )}

        {/* СЕТКА КАРТОЧЕК ЛОТЕРЕЙ */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr'>
          {visibleLotteries.length > 0 ? (
            visibleLotteries.map((loto) => {
              const bgUrl = loto.backgroundImage || '';
              const isAnimation = bgUrl.toLowerCase().endsWith('.json');

              return (
                <div key={loto.id} className='h-full min-h-75'>
                  <Link
                    href={`/lottery/${loto.id}`}
                    className='block w-full h-full transition-transform active:scale-[0.98]'
                  >
                    <LotteryCard
                      title={loto.title}
                      description={loto.subtitle || ''}
                      prize={loto.prizeText}
                      price={loto.buttonPrice ?? 0}
                      time={formatTime(loto.drawTime)}
                      theme={loto.theme as 'dark' | 'white'}
                      lottieSrc={isAnimation ? bgUrl : undefined}
                      backgroundImage={!isAnimation ? bgUrl : undefined}
                    />
                  </Link>
                </div>
              );
            })
          ) : (
            <div className='col-span-full text-center py-20 text-gray-400 font-rubik'>
              По вашему запросу лотерей не найдено
            </div>
          )}
        </div>

        {/* КНОПКА ЗАГРУЗИТЬ ЕЩЕ */}
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
};
