import { useMutation, useQuery } from '@tanstack/react-query';

import api from '@/services/api/apiClient'; // Проверь, правильный ли путь у тебя в проекте
import { useAuthStore } from '@/store/auth'; // Проверь путь к стору

interface BalanceResponse {
  data: {
    amount: string;
    currency: string;
  };
}

interface PaylinkResponse {
  data: {
    paylinkUrl: string;
  };
}

// 🔥 Добавляем интерфейсы для транзакций из Swagger
export interface WalletTransaction {
  date: string;
  amount: string;
  currency: string;
  paymentMethod: string;
  paymentStatus: string;
}

interface TransactionsResponse {
  data: {
    page: number;
    limit: number;
    total: number;
    items: WalletTransaction[];
  };
}

// 🔥 Реальные запросы к API
export const financeApi = {
  // 1. Получение баланса
  getBalance: async () => {
    const { data } = await api.get<BalanceResponse>('/profile/balance');
    return data.data; // Возвращает { amount: "7", currency: "KGS" }
  },

  // 2. Создание ссылки на оплату
  createPaylink: async (amount: string) => {
    // 🔥 Явно формируем строку, чтобы избежать проблем с сериализацией в apiClient
    const bodyString = `amount=${encodeURIComponent(amount)}`;

    const { data } = await api.post<PaylinkResponse>(
      '/balance/paylink',
      bodyString,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return data.data; // Возвращает { paylinkUrl: "https://..." }
  },

  // 3. Общая история транзакций (пополнения, покупки, выводы, выигрыши)
  getTransactions: async (page = 1, limit = 20) => {
    const { data } = await api.get<TransactionsResponse>(
      '/me/balance/transactions/',
      {
        params: { page, limit },
      },
    );
    return data.data.items; // Сразу возвращаем массив транзакций
  },
};

// 🔥 Хук для баланса (Синхронизирует сервер с Zustand)
export const useBalance = () => {
  const token = useAuthStore((state) => state.accessToken);
  const updateUser = useAuthStore((state) => state.updateUser);

  return useQuery({
    queryKey: ['balance'],
    queryFn: async () => {
      const data = await financeApi.getBalance();

      // Синхронизируем баланс с Zustand, чтобы он обновился в шапке и кошельке.
      // Бэкенд отдает строку (например, "7"), мы можем хранить ее как есть.
      updateUser({ balance: data.amount });

      return data;
    },
    // Запрашиваем только если есть токен (юзер авторизован)
    enabled: !!token,
    // Обновляем раз в 30 секунд (полезно для WebView и веба)
    refetchInterval: 30000,
  });
};

// 🔥 Хук для пополнения
export const useTopUp = () => {
  return useMutation({
    mutationFn: financeApi.createPaylink,
  });
};

// 🔥 Хук для истории транзакций
export const useTransactions = (page = 1, limit = 20) => {
  const token = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ['transactions', page, limit],
    queryFn: () => financeApi.getTransactions(page, limit),
    enabled: !!token, // Запрашиваем только если авторизован
  });
};
