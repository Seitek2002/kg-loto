import { useMutation, useQuery } from "@tanstack/react-query";

import api from "@/shared/api/apiClient";

import { DrawDto, LotteryRuleDto, RawDrawDto } from "../api";

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

export const useCurrentDraw = (lotteryId: string) => {
  return useQuery({
    queryKey: ["current-draw", lotteryId],
    queryFn: async () => {
      const response = await api.get<{
        success: boolean;
        data: RawDrawDto[];
        meta: {
          draw_cards?: DrawDto[];
          drawCards?: DrawDto[];
          rules?: LotteryRuleDto[];
          // 🔥 ДОБАВЛЯЕМ НОВЫЕ ПОЛЯ ИЗ ТЗ
          backgroundImage?: string | null;
          timerBackgroundImage?: string | null;
          logo?: string | null;
          lotteryLogo?: string | null;
        };
      }>("/draws/current/", { params: { lotteryId } });

      const drawCards =
        response.data?.meta?.drawCards || response.data?.meta?.draw_cards || [];
      // status у LTT-тиражей — произвольная строка (активный тираж на проде имеет
      // статус "printing"), поэтому не полагаемся строго на "open": берём открытый
      // по статусу, иначе тираж с ещё не завершёнными продажами, иначе первый.
      const openDraw =
        drawCards.find((draw) => draw.status === "open") ||
        drawCards.find(
          (draw) =>
            !!draw.salesEndAt &&
            new Date(draw.salesEndAt).getTime() > Date.now(),
        ) ||
        drawCards[0] ||
        null;
      const rules = response.data?.meta?.rules || [];

      return {
        draw: openDraw,
        rules: rules,
        // 🔥 ВОЗВРАЩАЕМ ИХ ИЗ ХУКА
        metaAssets: {
          backgroundImage: response.data?.meta?.backgroundImage || null,
          timerBackgroundImage:
            response.data?.meta?.timerBackgroundImage || null,
          logo: response.data?.meta?.logo || null,
          lotteryLogo: response.data?.meta?.lotteryLogo || null,
        },
      };
    },
    enabled: !!lotteryId,
  });
};

export const useTickets = (params: {
  lotteryId: string;
  drawId: number | string;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["tickets", params.lotteryId, params.drawId],
    queryFn: async () => {
      const { data } = await api.get("/tickets/", { params });
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
        "/draws/current/",
        { params: { lotteryId } },
      );
      return response.data.data || [];
    },
    enabled: !!lotteryId,
  });
};
