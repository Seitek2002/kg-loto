import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ApiResponse, Winner, PaginatedResult } from '@/types/api';

export const useWinners = () => {
  return useQuery({
    queryKey: ['winners'],
    queryFn: async () => {
      const { data } =
        await api.get<ApiResponse<PaginatedResult<Winner>>>('/winners/');

      return data.data.results || [];
    },
  });
};
