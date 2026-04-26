import api from '@/services/api/apiClient';
import { useMutation, useQuery } from '@tanstack/react-query';

export interface CheckCombinationResponse {
  isWinning: boolean;
  combinationId: number;
  message: string;
  prizeType: string;
  prizeAmount: string | null;
  prizeProduct: string | null;
}

export interface MyTicketDto {
  ticketId: string;
  lotteryId: string;
  drawId: string;
  name: string | null;
  logo: string | null;
  purchaseDateDisplay: string;
  ticketNumber: string;
  combination: number[];
  price: string | number;
  currency: string;
  status: 'sold' | 'winning' | 'losing';
  purchaseDate: string;
  prizeAmount?: number | string;
  prizeProduct?: string | null;
}

export interface DrawDto {
  drawId: string;
  title: string;
  drawNumber: number;
  drawNumberDisplay: string;
  drawDate: string;
  drawDateHuman: string;
  drawTime: string;
  drawTimeDisplay: string;
  jackpotAmount: number;
  jackpotAmountDisplay: string;
  location: string;
  status: 'open' | 'closed' | 'completed';
  salesStartAt: string;
  salesStartAtDisplay: string;
  salesEndAt: string;
  salesEndAtDisplay: string;
}

// --- ИНТЕРФЕЙСЫ ДЛЯ ПОКУПКИ (POST) ---
export interface PurchaseItem {
  lotteryId: string;
  drawId: string;
  ticketId: string;
  price: string;
  currency: string;
}

export interface PurchasePayload {
  orderId: string;
  purchaseDatetime: string;
  items: PurchaseItem[];
}

// --- ИНТЕРФЕЙСЫ ДЛЯ ПОЛУЧЕНИЯ БИЛЕТОВ (GET) ---
export interface FetchTicketsParams {
  lotteryId: string;
  drawId: string;
  page?: number;
  limit?: number;
}

export interface TicketDto {
  ticketId: string;
  ticketNumber: string;
  combination: number[];
  price: number;
  currency: string;
  status: 'available' | 'sold' | 'reserved' | 'cancelled';
}

export interface TicketsResponseData {
  lottery_id: string;
  draw_id: string;
  page: number;
  limit: number;
  total: number;
  tickets: TicketDto[];
}

// --- API ОБЪЕКТ ---
export const ticketApi = {
  // Получение доступных билетов
  getTickets: async (params: FetchTicketsParams) => {
    const response = await api.get('/tickets', { params });
    return response.data.data;
  },

  // Покупка билетов с баланса
  purchaseTickets: async (payload: PurchasePayload) => {
    const { data } = await api.post('/me/balance/purchases/', payload);
    return data;
  },

  getCurrentDraw: async (lotteryId: string) => {
    const response = await api.get<{
      data: DrawDto[]; // 🔥 Теперь массив тиражей лежит прямо в data
      meta: any;
    }>('/draws/current', {
      params: { lotteryId },
    });

    // Берем массив тиражей из response.data.data
    const draws = response.data?.data || [];

    // Ищем открытый тираж
    const openDraw = draws.find((draw) => draw.status === 'open');

    return openDraw || null;
  },

  getMyTickets: async () => {
    const { data } = await api.get<{ data: MyTicketDto[] }>(
      '/me/balance/tickets/',
    );

    console.log(data);

    return data.data;
  },

  checkCombination: async (code: string) => {
    const { data } = await api.post<{ data: CheckCombinationResponse }>(
      '/me/combination/check/',
      { code },
    );
    return data.data;
  },
};

// --- ХУКИ ---
export const useTickets = (
  params: FetchTicketsParams,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ['tickets', params.lotteryId, params.drawId, params.page],
    queryFn: () => ticketApi.getTickets(params),
    enabled: enabled && !!params.lotteryId && !!params.drawId,
  });
};

export const usePurchaseTickets = () => {
  return useMutation({
    mutationFn: ticketApi.purchaseTickets,
  });
};

export const useCurrentDraw = (lotteryId: string) => {
  return useQuery({
    queryKey: ['currentDraw', lotteryId],
    queryFn: () => ticketApi.getCurrentDraw(lotteryId),
    enabled: !!lotteryId,
  });
};

export const useMyTickets = () => {
  return useQuery({
    queryKey: ['myTickets'],
    queryFn: ticketApi.getMyTickets,
  });
};

export const useCheckTicket = () => {
  return useMutation({
    mutationFn: ticketApi.checkCombination,
  });
};
