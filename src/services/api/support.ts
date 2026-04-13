import api from './apiClient'; // Импортируем наш настроенный клиент

export interface TicketData {
  id: number;
  ticketNumber: string;
  subject: string;
  description: string;
  status:
    | 'new'
    | 'in_progress'
    | 'waiting_client'
    | 'escalated'
    | 'resolved'
    | 'closed';
  statusDisplay: string;
  createdAt: string;
  createdAtDisplay: string;
  answer: string | null;
}

interface TicketsResponse {
  data: TicketData[];
  meta: any;
}

export const supportApi = {
  // Получить список тикетов
  getTickets: async () => {
    const response = await api.get<TicketsResponse>(
      '/me/report-tickets/',
    );
    return response.data.data;
  },

  // Создать новый тикет
  createTicket: async (formData: FormData) => {
    const response = await api.post('/me/report-tickets/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Для файлов
      },
    });
    return response.data;
  },
};
