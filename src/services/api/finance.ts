import axios from 'axios';
import { useAuthStore } from '@/store/auth';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://kgloto.com',
});

// Перехватчик для токена (такой же, как мы делали для supportApi)
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const financeApi = {
  // Получить баланс
  getBalance: async () => {
    const response = await api.get('/api/v1/profile/balance');
    return response.data.data; // Возвращает { amount: "150.00", currency: "KGS" }
  },

  // Создать ссылку на оплату
  createPaylink: async (amount: string) => {
    const response = await api.post('/api/v1/balance/paylink', { amount });
    return response.data.data; // Возвращает { paylinkUrl: "https://..." }
  },
};
