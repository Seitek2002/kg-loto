import { useMutation, useQuery } from "@tanstack/react-query";

import api from "@/shared/api/apiClient";

import { DrawDto, LotteryRuleDto, RawDrawDto } from "../api";

// Импортируем типы из соседнего файла

interface CheckTicketResponse {
  isWinning: boolean;
  combinationId: number;
  message: string;
  prizeType: string;
  prizeAmount?: string;
  prizeProduct?: string;
}

export const useCheckTicket = () => {
  return useMutation({
    mutationFn: async (code: string) => {
      const { data } = await api.post("/me/combination/check/", { code });
      return data.data as CheckTicketResponse;
    },
  });
};

// 🔥 ИСПРАВЛЕННЫЙ ХУК
export const useCurrentDraw = (lotteryId: string) => {
  return useQuery({
    queryKey: ["current-draw", lotteryId],
    queryFn: async () => {
      const response = await api.get<{
        success: boolean;
        data: RawDrawDto[];
        meta: {
          draw_cards?: DrawDto[]; // Для подстраховки (snake_case)
          drawCards?: DrawDto[]; // Для подстраховки (camelCase)
          rules?: LotteryRuleDto[];
        };
      }>("/draws/current", {
        params: { lotteryId },
      });

      // 1. Ищем инфо о тираже в meta.draw_cards (там есть поле title)
      const drawCards =
        response.data?.meta?.drawCards || response.data?.meta?.draw_cards || [];
      const openDraw = drawCards.find((draw) => draw.status === "open") || null;

      // 2. Достаем правила
      const rules = response.data?.meta?.rules || [];

      return {
        draw: openDraw,
        rules: rules,
      };
    },
    enabled: !!lotteryId,
  });
};

export const useTickets = (params: {
  lotteryId: string;
  drawId: string;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["tickets", params.lotteryId, params.drawId],
    queryFn: async () => {
      const { data } = await api.get("/tickets", { params });
      return data.data;
    },
    enabled: !!params.lotteryId && !!params.drawId,
  });
};

export const useCurrentDraws = (lotteryId: string) => {
  return useQuery({
    queryKey: ["currentDraws", lotteryId],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: RawDrawDto[] }>(
        "/draws/current",
        { params: { lotteryId } },
      );
      return response.data.data || [];
    },
    enabled: !!lotteryId,
  });
};
