import { useMutation, useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/entities/user/model/authStore";

import api from "@/shared/api/apiClient";

interface BalanceResponse {
  data: { amount: string; currency: string };
}
interface PaylinkResponse {
  data: { paylinkUrl: string };
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
    const { data } = await api.get<BalanceResponse>("/profile/balance");
    return data.data;
  },
  createPaylink: async (amount: string) => {
    const bodyString = `amount=${encodeURIComponent(amount)}`;
    const { data } = await api.post<PaylinkResponse>(
      "/balance/paylink",
      bodyString,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    );
    return data.data;
  },
  getTransactions: async () => {
    const { data } = await api.get<TransactionsResponse>(
      "/me/balance/transactions/",
    );
    return data.data.items;
  },
};

export const useBalance = () => {
  const isAuth = useAuthStore((state) => state.isAuth);
  const updateUser = useAuthStore((state) => state.updateUser);

  return useQuery({
    queryKey: ["balance"],
    queryFn: async () => {
      const data = await financeApi.getBalance();
      updateUser({ balance: Number(data.amount) });
      return data;
    },
    enabled: isAuth,
    refetchInterval: 30000,
  });
};

export const useTopUp = () =>
  useMutation({ mutationFn: financeApi.createPaylink });
export const useTransactions = () =>
  useQuery({ queryKey: ["transactions"], queryFn: financeApi.getTransactions });
