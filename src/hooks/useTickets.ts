import { useMutation, useQuery } from '@tanstack/react-query';
import { ticketsApi } from '@/services/api/tickets';
import { TicketService } from '@/services/ticket';
import api from '@/services/api/apiClient';

export interface BillingTicket {
  ticketId: string;
  ticketNumber: string;
  combination: number[];
  price: number;
  currency: string;
  status: string;
}

export interface BillingTicketsList {
  lotteryId: string;
  drawId: string;
  page: number;
  limit: number;
  total: number;
  tickets: BillingTicket[];
}

export const useDrawTickets = (lotteryId?: string, drawId?: string) => {
  return useQuery({
    queryKey: ['tickets', lotteryId, drawId],
    queryFn: async (): Promise<BillingTicketsList> => {
      const { data } = await api.get('/tickets', {
        // Запрашиваем 50 доступных билетов
        params: { lotteryId, drawId, limit: 50, status: 'available' },
      });
      return data.data;
    },
    enabled: !!lotteryId && !!drawId, // Запрос не пойдет, пока мы не узнаем drawId
    staleTime: 1000 * 30, // 30 секунд кэша, чтобы билеты не протухали слишком быстро, но оставались актуальными
  });
};

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
