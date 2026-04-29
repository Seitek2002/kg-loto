"use client";

import { useCurrentLotteries } from "@/entities/lottery/api/lotteryClientApi";

import { Skeleton } from "@/shared/ui/Skeleton";

import { PopularTicketsClient } from "./PopularTicketsClient";

interface PopularTicketsWidgetProps {
  title?: string;
  description?: string;
  currentLotteryId?: string;
}

export const PopularTicketsWidget = ({
  title,
  description,
  currentLotteryId,
}: PopularTicketsWidgetProps) => {
  // Загружаем данные на клиенте
  const { data: lotteries, isLoading } = useCurrentLotteries();

  if (isLoading) {
    return (
      <div className="my-12">
        <Skeleton className="w-1/2 h-8 mb-4" />
        <Skeleton className="w-3/4 h-6 mb-6" />
        <div className="flex flex-wrap gap-4 mt-6">
          <Skeleton className="w-full md:w-[48%] h-62.5 rounded-3xl" />
          <Skeleton className="w-full md:w-[48%] h-62.5 rounded-3xl" />
        </div>
      </div>
    );
  }

  // Фильтруем лотерею, на странице которой мы сейчас находимся
  const filteredLotteries =
    currentLotteryId && lotteries
      ? lotteries.filter((loto: any) => String(loto.id) !== currentLotteryId)
      : lotteries;

  if (!filteredLotteries || filteredLotteries.length === 0) return null;

  // Передаем готовые данные в твой красивый клиентский компонент
  return (
    <PopularTicketsClient
      lotteries={filteredLotteries}
      title={title}
      description={description}
    />
  );
};
