"use client";

import { useState } from "react";

import { PopularTicketsClient } from "@/widgets/popular-tickets/ui/PopularTicketsClient";

import { LotteryItem } from "@/entities/lottery/model/types";

import { PageHeader } from "@/shared/ui/PageHeader";

interface LotteryListProps {
  initialLotteries: LotteryItem[];
  pageTitle: string;
  title: string;
  description: string;
}

const ITEMS_PER_PAGE = 8;

export const LotteryList = ({
  initialLotteries,
  pageTitle,
  title,
  description,
}: LotteryListProps) => {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const visibleLotteries = initialLotteries?.slice(0, visibleCount) || [];
  const hasMore = initialLotteries && visibleCount < initialLotteries.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  if (!initialLotteries) return null;

  return (
    <div className="min-h-screen bg-[#F9F9F9] pt-0 pb-20">
      <div className="px-4">
        <PageHeader title={pageTitle} />
      </div>

      <div className="max-w-350 mx-auto pt-4 lg:pt-10 px-4">
        <PopularTicketsClient
          lotteries={visibleLotteries}
          title={title}
          description={description}
        />

        {/* КНОПКА ЗАГРУЗИТЬ ЕЩЕ */}
        {hasMore && (
          <div className="mt-2 flex justify-center">
            <button
              onClick={handleLoadMore}
              className="bg-white text-[#4B4B4B] font-bold font-benzin uppercase text-xs py-4 px-12 rounded-full shadow-md hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
            >
              Загрузить еще
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
