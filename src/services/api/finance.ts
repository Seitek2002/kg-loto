import api from './apiClient'; // Импортируем наш настроенный клиент

export const financeApi = {
  // Получить баланс
  getBalance: async () => {
    const response = await api.get('/api/v1/profile/balance');
    return response.data.data; // { amount: "150.00", currency: "KGS" }
  },

  // Создать ссылку на оплату
  createPaylink: async (amount: string) => {
    const response = await api.post('/api/v1/balance/paylink', { amount });
    return response.data.data; // { paylinkUrl: "https://..." }
  },
};
