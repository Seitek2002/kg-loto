import axios from 'axios';
import { useAuthStore } from '@/store/auth';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://kgloto.com',
});

// 1. ПЕРЕХВАТЧИК ЗАПРОСОВ (Добавляет токен к каждому запросу)
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 2. ПЕРЕХВАТЧИК ОТВЕТОВ (Ловит 401 ошибку и обновляет токен)
api.interceptors.response.use(
  (response) => response, // Если запрос успешен, просто возвращаем ответ
  async (error) => {
    const originalRequest = error.config;

    // Если ошибка 401 (Unauthorized) и мы еще не пробовали повторить этот запрос
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Ставим флаг, чтобы не уйти в бесконечный цикл

      try {
        const refreshToken = useAuthStore.getState().refreshToken;

        if (!refreshToken) {
          // Если рефреш-токена нет, просто разлогиниваем юзера
          useAuthStore.getState().logout();
          return Promise.reject(error);
        }

        // 🔥 ВНИМАНИЕ: Замени URL ниже на реальный эндпоинт твоего бэкенда для рефреша токена!
        // Обычно в Django это /api/v1/token/refresh/ или /api/v1/auth/refresh/
        const response = await axios.post(
          'https://kgloto.com/api/v1/token/refresh/',
          {
            refresh: refreshToken,
          },
        );

        // Получаем новый токен из ответа (проверь, как именно бэкенд его отдает, обычно это ключи access или accessToken)
        const newAccessToken = response.data.access;

        // 🔥 Обновляем токены в нашем Zustand сторе
        // Проверь, как называется функция обновления в useAuthStore (возможно у тебя updateTokens, setAuth и т.д.)
        // Если такой функции нет, её нужно добавить в store/auth.ts
        useAuthStore.setState({
          accessToken: newAccessToken,
          // Если сервер возвращает и новый рефреш токен, обновляем и его:
          ...(response.data.refresh && { refreshToken: response.data.refresh }),
        });

        // Меняем токен в заголовках оригинального (упавшего) запроса
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Повторяем оригинальный запрос с новым токеном
        return api(originalRequest);
      } catch (refreshError) {
        // Если даже рефреш-токен протух (например, юзер не заходил месяц), разлогиниваем его
        console.error('Refresh token is expired or invalid');
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// --- ДАЛЬШЕ ТВОЙ КОД БЕЗ ИЗМЕНЕНИЙ ---

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
  getTickets: async () => {
    const response = await api.get<TicketsResponse>(
      '/api/v1/me/report-tickets/',
    );
    return response.data.data;
  },

  createTicket: async (formData: FormData) => {
    const response = await api.post('/api/v1/me/report-tickets/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
