import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Winner, ApiResponse } from '@/types/api';

const fetchWinners = async (): Promise<Winner[]> => {
  const { data } = await api.get<ApiResponse<Winner[]>>('/winners/');
  return data.data;
};

export const useWinners = () => {
  return useQuery({
    queryKey: ['winners'],
    queryFn: fetchWinners,
    staleTime: 5 * 60 * 1000,
  });
};
