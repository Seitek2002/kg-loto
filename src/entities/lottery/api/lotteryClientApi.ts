import { useQuery } from "@tanstack/react-query";

import api from "@/shared/api/apiClient";

// Блок только для отображения (из CMS/админки). Может быть null, если для
// lotteryId ещё не создана/не привязана запись Lottery в админке.
export interface LotteryInfo {
  title: string;
  titleText: string;
  subtitle: string;
  theme: "white" | "dark";
  prizeText: string;
  mainPrizes: string[];
  logo: string | null;
  drawLogo: string | null;
  prizeTiers: { amount: string; winners: number }[];
}

export interface CurrentLotteryDto {
  lotteryId: string;
  code: string;
  name: string;
  currency: string;
  ticketPrice: number;
  saleStatus: string;
  saleStartAt: string;
  saleEndAt: string;
  imageUrl: string;
  saleStartAtDisplay?: string;
  saleEndAtDisplay?: string;
  lotteryInfo: LotteryInfo | null;
}

export const useCurrentLotteries = () => {
  return useQuery({
    queryKey: ["current-lotteries"],
    queryFn: async () => {
      // Эндпоинт из Swagger: /api/v1/lotteries/current
      const { data } = await api.get<{ data: CurrentLotteryDto[] }>(
        "/lotteries/current/",
      );
      return data.data;
    },
  });
};
