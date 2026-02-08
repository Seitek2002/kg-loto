import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Lottery, ApiResponse } from '@/types/api';

const fetchLotteries = async (): Promise<Lottery[]> => {
  const { data } = await api.get<ApiResponse<Lottery[]>>('/lotteries/');
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
