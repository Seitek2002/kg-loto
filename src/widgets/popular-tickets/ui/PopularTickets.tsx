import { getLotteriesData } from "@/entities/lottery/api/lotteryServerApi";
import { LotteryItem } from "@/entities/lottery/model/types";

import { PopularTicketsClient } from "./PopularTicketsClient";

interface PopularTicketsProps {
  title?: string;
  description?: string;
  initialLotteries?: LotteryItem[];
  currentLotteryId?: string;
}

export const PopularTickets = async ({
  title,
  description,
  initialLotteries,
  currentLotteryId,
}: PopularTicketsProps) => {
  let lotteries = initialLotteries?.length
    ? initialLotteries
    : await getLotteriesData();

  if (currentLotteryId) {
    lotteries = lotteries.filter(
      (loto) => String(loto.id) !== currentLotteryId,
    );
  }

  if (!lotteries || lotteries.length === 0) return null;

  return (
    <PopularTicketsClient
      lotteries={lotteries}
      title={title}
      description={description}
    />
  );
};
