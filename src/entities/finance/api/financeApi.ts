import { useMutation, useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/entities/user/model/authStore";

import api from "@/shared/api/apiClient";

export interface PaymentMethodDto {
  id: string;
  name: string;
  logo: string | null; // 🔥 Может быть null
  minAmount: number | null;
  maxAmount: number | null;
}

interface BalanceResponse {
  data: { amount: string; currency: string };
}
// Ответ POST /balance/paylink/ приходит плоским объектом, без обёртки data
interface PaylinkResponse {
  paylinkUrl: string;
}
export interface TransactionDto {
  date: string;
  amount: string;
  currency: string;
  paymentMethod: string;
  paymentStatus: string;
}
export interface TransactionsResponse {
  data: { page: number; limit: number; total: number; items: TransactionDto[] };
}

export const financeApi = {
  getBalance: async () => {
    // Подтверждено бэком: актуальный (и единственный работающий) путь — /profile/balance/
    const { data } = await api.get<BalanceResponse>("/profile/balance/");
    return data.data;
  },

  createPaylink: async (amount: string) => {
    // 🔥 Формируем динамический URL для возврата пользователя обратно в кошелек
    const redirectUrl = `${window.location.origin}/wallet`;

    // Подтверждено бэком (июль 2026): эндпоинт снова включён на старом пути
    // POST /balance/paylink/ (не /me/balance/paylink/), ответ приходит плоским
    const { data } = await api.post<PaylinkResponse>("/balance/paylink/", {
      amount: amount,
      redirectUrl,
    });
    return data;
  },

  getTransactions: async () => {
    const { data } = await api.get<TransactionsResponse>(
      "/me/balance/transactions/",
    );
    return data.data.items;
  },

  getPaymentMethods: async () => {
    const { data } = await api.get<{ data: PaymentMethodDto[] }>(
      "/payment-methods/",
    );
    return data.data;
  },
};

export const useBalance = () => {
  // 🔥 Берем user вместо isAuth, так как user моментально достается из localStorage
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  return useQuery({
    queryKey: ["balance"],
    queryFn: async () => {
      const data = await financeApi.getBalance();
      updateUser({ balance: Number(data.amount) });
      return data;
    },
    enabled: !!user, // 🔥 Теперь запрос 100% улетит, как только Zustand восстановит юзера!
    refetchInterval: 30000,
  });
};

export const useTopUp = () =>
  useMutation({ mutationFn: financeApi.createPaylink });

export const useTransactions = () =>
  useQuery({ queryKey: ["transactions"], queryFn: financeApi.getTransactions });

export const usePaymentMethods = () => {
  return useQuery({
    queryKey: ["payment-methods"],
    queryFn: financeApi.getPaymentMethods,
    staleTime: 5 * 60 * 1000,
  });
};
