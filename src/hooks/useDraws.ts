import { useQuery } from '@tanstack/react-query';
import api from '@/services/api/apiClient';

export interface CurrentDraw {
  drawId: string;
  lotteryId: string;
  drawNumber: number;
  drawDate: string;
  drawTime: string;
  salesStartAt: string;
  salesEndAt: string;
  status: 'open' | 'closed' | 'completed' | 'cancelled';
  winningCombination: number[] | null;
  jackpotAmount: number;
  currency: string;
}

const fetchCurrentDraws = async (lotteryId: string): Promise<CurrentDraw[]> => {
  const { data } = await api.get('/draws/current', {
    params: { lotteryId }, // Наш apiClient сам переведет в lottery_id, если нужно
  });
  return data.data;
};

export const useCurrentDraws = (lotteryId: string) => {
  return useQuery({
    queryKey: ['draws', lotteryId],
    queryFn: () => fetchCurrentDraws(lotteryId),
    enabled: !!lotteryId, // Запрос пойдет только если есть ID лотереи
    staleTime: 1 * 60 * 1000, // Кэшируем на 1 минуту
    gcTime: 15 * 60 * 1000,
  });
};
