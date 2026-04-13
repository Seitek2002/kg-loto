import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supportApi } from '@/services/api/support';

export const useTickets = () => {
  return useQuery({
    queryKey: ['tickets'],
    queryFn: supportApi.getTickets,
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: supportApi.createTicket,
    onSuccess: () => {
      // Обновляем список тикетов после успешного создания
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};
