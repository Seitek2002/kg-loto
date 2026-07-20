import { useQuery } from "@tanstack/react-query";

import api from "@/shared/api/apiClient";

// Блок только для отображения (из CMS/админки). Может быть null, если для
// lotteryId ещё не создана/не привязана запись Lottery в админке.
// prizeTiers здесь НЕ приходят, хотя раньше были описаны в типе — они есть
// только в детальном /lotteries/{id}/ (см. useLotteryPrizeTiers ниже).
export interface LotteryInfo {
  id: number;
  billingLotteryId: string;
  title: string;
  titleText: string;
  subtitle: string;
  theme: "white" | "dark";
  prizeText: string;
  mainPrizes: string[];
  logo: string | null;
  drawLogo: string | null;
}

// Категория выигрыша. amount — свободный текст из админки, в котором и сумма,
// и число совпадений сразу: «Фиксировано — 20 000 сом (совпадение 4 из 5)».
// Формат отличается от лотереи к лотерее, поэтому показываем строку как есть.
export interface LotteryPrizeTier {
  id: number;
  amount: string;
  winners: number;
  order: number;
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

// Категории выигрышей лотереи.
// Два запроса, потому что prizeTiers лежат только в детальном /lotteries/{id}/,
// а он принимает числовой id — тогда как страница тиража знает лотерею по коду
// («T_5_36»). Бэку отправлена просьба принимать код напрямую; когда сделают,
// первый запрос уйдёт.
export const useLotteryPrizeTiers = (lotteryId?: string) => {
  return useQuery({
    queryKey: ["lottery-prize-tiers", lotteryId],
    queryFn: async (): Promise<LotteryPrizeTier[]> => {
      const { data: list } = await api.get<{
        data: { id: number; billingLotteryId: string }[];
      }>("/lotteries/");

      const match = list.data?.find((l) => l.billingLotteryId === lotteryId);
      if (!match) return [];

      const { data: detail } = await api.get<{
        data: { prizeTiers?: LotteryPrizeTier[] };
      }>(`/lotteries/${match.id}/`);

      return detail.data?.prizeTiers ?? [];
    },
    enabled: !!lotteryId,
    staleTime: 5 * 60 * 1000,
  });
};
