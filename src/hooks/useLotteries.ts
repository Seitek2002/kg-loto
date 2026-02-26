import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { LotteryData } from '@/data/mock-lotteries';
import { ApiResponse } from '@/types/api';

const fetchLotteries = async (): Promise<LotteryData[]> => {
  const { data } = await api.get<ApiResponse<LotteryData[]>>('/lotteries/');
  return data.data;
};

export const useLotteries = () => {
  return useQuery({
    queryKey: ['lotteries'],
    queryFn: fetchLotteries,
    // Можно добавить staleTime, чтобы кэшировать данные на 5 минут
    staleTime: 5 * 60 * 1000,
  });
};
