import api from './apiClient';
import { Withdrawal, WithdrawalCreateRequest } from '@/types/api';

export const financeApi = {
  // Получить баланс
  getBalance: async () => {
    const { data } = await api.get('/profile/balance'); // /api/v1 уже в apiClient
    return data.data;
  },

  // Создать ссылку на оплату (пополнение)
  createPaylink: async (amount: string) => {
    const { data } = await api.post('/balance/paylink', { amount });
    return data.data;
  },

  // 🔥 НОВОЕ: Получить историю выводов средств
  getWithdrawals: async (): Promise<Withdrawal[]> => {
    const { data } = await api.get('/me/withdrawals/');
    return data.data; // Возвращаем массив транзакций
  },

  // 🔥 НОВОЕ: Создать заявку на вывод (пригодится для модалки вывода)
  createWithdrawal: async (payload: WithdrawalCreateRequest) => {
    const { data } = await api.post('/me/withdrawals/', payload);
    return data.data;
  },
};
