import api from './apiClient';

export interface MyTicket {
  id: string | number;
  ticketNumber?: string;
  [key: string]: any;
}

export const ticketsApi = {
  // Получить список билетов
  getMyTickets: async (page = 1, pageSize = 10) => {
    const response = await api.get('/me/tickets/', {
      params: { page, pageSize },
    });
    return response.data;
  },

  // Получить детали одного билета
  getTicketById: async (ticketId: string) => {
    const response = await api.get(`/me/tickets/${ticketId}/`);
    return response.data.data;
  },
};
