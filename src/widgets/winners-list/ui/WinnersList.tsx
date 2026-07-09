"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import { useMounted } from "@/hooks/useMounted";
import { ChevronLeft } from "lucide-react";

import {
  useWinnerLotteries,
  useWinners,
} from "@/entities/winner/api/winnerClientApi";
import { Winner } from "@/entities/winner/model/types";
import { WinnerCard } from "@/entities/winner/ui/WinnerCard";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/Button";
import { Description } from "@/shared/ui/Description";
import { Title } from "@/shared/ui/Title";

export const WinnersList = () => {
  const mounted = useMounted();

  const [selectedFilters, setSelectedFilters] = useState<number[]>([]);

  // Реальный список лотерей, по которым есть отмеченные победители —
  // источник фильтра, а не то, что случайно встретилось в данных победителей
  const { data: lotteryOptions } = useWinnerLotteries();
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useWinners(selectedFilters);

  // Победители грузятся с бэка постранично (по 10), здесь просто
  // разворачиваем уже загруженные страницы в плоский список
  const visibleWinners = useMemo<Winner[]>(
    () => data?.pages.flatMap((page) => page.results) || [],
    [data],
  );

  const dynamicFilters = useMemo(
    () =>
      (lotteryOptions || []).map((lottery) => ({
        label: lottery.title,
        value: lottery.id,
      })),
    [lotteryOptions],
  );

  const isAllSelected = selectedFilters.length === 0;

  const toggleFilter = (value: number) => {
    setSelectedFilters((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const clearFilters = () => {
    setSelectedFilters([]);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24">
      <div className="max-w-310 mx-auto pt-6 px-4 sm:px-6 lg:px-8">
        {/* НАВИГАЦИЯ */}
        <nav className="flex items-center mb-6 lg:mb-10">
          <Link
            href="/"
            className="flex items-center text-[#4B4B4B] hover:opacity-70 transition-opacity active:scale-95 cursor-pointer"
          >
            <ChevronLeft size={28} className="mr-1 -ml-2" />
            <span className="text-[20px] font-black uppercase font-benzin mt-1">
              Назад
            </span>
          </Link>
        </nav>

        <div className="mb-6 max-w-3xl">
          <Title>ИСТОРИЯ ПОБЕДИТЕЛЕЙ</Title>
          <Description>
            Популярные лотереи привлекают внимание благодаря крупным джекпотам,
            частым тиражам и удобным условиям участия.
          </Description>
        </div>

        {/* ФИЛЬТРЫ */}
        <div className="mb-8 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 min-w-max pb-2">
            <button
              onClick={clearFilters}
              className={cn(
                "px-5 py-2.5 rounded-full text-xs font-bold font-benzin uppercase transition-all active:scale-95 border cursor-pointer",
                isAllSelected
                  ? "bg-[#4B4B4B] text-white border-[#4B4B4B]"
                  : "bg-white text-[#4B4B4B] border-transparent shadow-sm hover:bg-gray-50",
              )}
            >
              Все
            </button>

            {dynamicFilters.map((option) => {
              const isActive = selectedFilters.includes(option.value);
              return (
                <button
                  key={option.value}
                  onClick={() => toggleFilter(option.value)}
                  className={cn(
                    "px-5 py-2.5 rounded-full text-xs font-bold font-benzin uppercase transition-all active:scale-95 border cursor-pointer",
                    isActive
                      ? "bg-[#FFD600] text-[#4B4B4B] border-[#FFD600]"
                      : "bg-white text-[#4B4B4B] border-transparent shadow-sm hover:bg-gray-50",
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* СПИСОК */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-in fade-in duration-500">
          {isLoading ? (
            <div className="col-span-full text-center py-20 text-gray-400 font-medium font-rubik">
              Загрузка победителей...
            </div>
          ) : visibleWinners.length > 0 ? (
            visibleWinners.map((winner) => (
              <WinnerCard key={winner.id} winner={winner} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-gray-400 font-medium font-rubik">
              Победителей в этой категории пока нет
            </div>
          )}
        </div>

        {/* КНОПКА ЗАГРУЗИТЬ ЕЩЕ */}
        {hasNextPage && (
          <div className="mt-12 flex justify-center">
            <Button
              variant="outline"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="bg-white text-[#4B4B4B] uppercase text-xs py-4 px-12 rounded-full border-transparent shadow-md disabled:opacity-60"
            >
              {isFetchingNextPage ? "Загрузка..." : "Загрузить еще"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
