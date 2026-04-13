import { useMutation, useQuery } from '@tanstack/react-query';
import { ticketsApi } from '@/services/api/tickets';
import { TicketService } from '@/services/ticket';

// Хук для списка билетов
export const useMyTickets = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ['my-tickets', page, pageSize],
    queryFn: () => ticketsApi.getMyTickets(page, pageSize),
  });
};

// Хук для конкретного билета
export const useTicketDetails = (ticketId: string) => {
  return useQuery({
    queryKey: ['ticket-details', ticketId],
    queryFn: () => ticketsApi.getTicketById(ticketId),
    enabled: !!ticketId, // Запрос пойдет только если есть ticketId
  });
};

export const useCheckTicket = () => {
  return useMutation({
    mutationFn: (code: string) => TicketService.checkCombination(code),
  });
};
