import { useQuery } from "@tanstack/react-query";

import api from "@/shared/api/apiClient";

export const useCurrentLotteries = () => {
  return useQuery({
    queryKey: ["current-lotteries"],
    queryFn: async () => {
      // Эндпоинт из Swagger: /api/v1/lotteries/current
      const { data } = await api.get("/lotteries/current/");
      console.log('data', data);
      return data.data; // Возвращает массив BillingLottery
    },
  });
};
