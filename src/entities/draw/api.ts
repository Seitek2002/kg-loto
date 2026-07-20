// src/entities/draw/api.ts
import { useQuery } from "@tanstack/react-query";

import api from "@/shared/api/apiClient";

export interface CurrentDraw {
  // drawId — число (ltt_id). В доке бэка было предупреждение, что здесь UUID,
  // но на проде приходит целое число, как и раньше.
  drawId: number;
  // lotteryId — реальный код типа игры из LTT (game_type_code), строка
  lotteryId: string;
  drawNumber: number;
  drawDate: string;
  drawTime: string;
  salesStartAt: string;
  salesEndAt: string;
  // status — произвольная строка статуса из LTT ("finished", "printing", ...),
  // не фиксированный набор. Не делать строгий switch по значениям.
  // Бэк больше не переводит его в "completed" сам — это сырой статус LTT.
  status: string;
  lttStatus?: string;
  currency: string;
  lotteryLogo?: string | null;
  tvBroadcast?: string | null;
  onlineBroadcastUrl?: string | null;
  onlineBroadcastLabel?: string | null;
  drawNumberDisplay?: string;
  drawDateHuman?: string;
  drawDatetimeDisplay?: string;
}
// ⚠️ Результатов (winningCombination / jackpotAmount) в /draws/current/ больше
// нет — бэк всегда отдаёт по ним null/"". Результаты завершённых тиражей живут
// только в /draws/archive/ (см. ArchiveDraw ниже).

// Разбивка призов завершённого тиража по категориям
export interface DrawPrizeResult {
  categoryName: string;
  matchCount: number;
  isJackpot: boolean;
  // Может быть null: у категории не задан фикс. приз, либо у джекпот-категории
  // не заполнен джекпот тиража
  prizeAmount: string | null;
  winnersCount: number;
}

// Завершённый тираж из /draws/archive/ — в отличие от /draws/current/
// содержит результаты и разбивку призов
export interface ArchiveDraw {
  // ⚠️ id записи истории, это НЕ тот же идентификатор, что drawId в /draws/current/
  drawId: number;
  lotteryId: string;
  drawNumber: number;
  drawNumberDisplay?: string;
  drawDate: string;
  drawTime: string;
  drawDateHuman?: string;
  drawDatetimeDisplay?: string;
  status: string;
  winningCombination?: number[] | null;
  winningCombinationDisplay?: string;
  // В архиве джекпот приходит строкой ("1000000.00"), не числом
  jackpotAmount?: string | null;
  jackpotAmountDisplay?: string;
  currency: string;
  totalWinningTickets?: number;
  tvBroadcast?: string | null;
  onlineBroadcastUrl?: string | null;
  onlineBroadcastLabel?: string | null;
  lotteryLogo?: string | null;
  prizeResults?: DrawPrizeResult[];
}

// Джекпот в архиве приходит строкой ("1000000.00"), плюс бэк отдаёт готовое к
// показу jackpotAmountDisplay ("1 000 000 сом"). Возвращает полную подпись
// вместе с валютой либо "—", если результат ещё не внесён.
export const getDrawPrizeLabel = (
  draw: Pick<ArchiveDraw, "jackpotAmountDisplay" | "jackpotAmount">,
): string => {
  if (draw.jackpotAmountDisplay) return draw.jackpotAmountDisplay;
  if (!draw.jackpotAmount) return "—";
  const amount = Number(draw.jackpotAmount);
  return Number.isNaN(amount) ? "—" : `${amount.toLocaleString("ru-RU")} с`;
};

// prizeAmount категории — строка вида "5000.00", либо null (приз не задан)
export const formatPrizeAmount = (
  amount: string | null | undefined,
): string => {
  if (!amount) return "—";
  const value = Number(amount);
  return Number.isNaN(value) ? amount : `${value.toLocaleString("ru-RU")} с`;
};

export const useCurrentDraws = (lotteryId?: string) => {
  return useQuery({
    queryKey: ["draws", lotteryId],
    queryFn: async () => {
      const { data } = await api.get("/draws/current", {
        params: { lotteryId },
      });
      return data.data;
    },
    enabled: !!lotteryId,
    staleTime: 1 * 60 * 1000,
  });
};

// Архив завершённых тиражей. status по умолчанию на бэке = "completed",
// поэтому отдельно его не передаём.
// pageSize взят максимальный (100): текущий UI показывает архив аккордеоном по
// месяцам без пагинации. Если тиражей станет больше 100 — понадобится дозагрузка.
export const useDrawsArchive = (lotteryId?: string) => {
  return useQuery({
    queryKey: ["draws-archive", lotteryId],
    queryFn: async () => {
      const { data } = await api.get("/draws/archive/", {
        params: { lotteryId, pageSize: 100 },
      });
      return (data.data || []) as ArchiveDraw[];
    },
    enabled: !!lotteryId,
    staleTime: 1 * 60 * 1000,
  });
};
