import { useQuery, useMutation } from '@tanstack/react-query';
import { financeApi } from '@/services/api/finance';
import { useAuthStore } from '@/store/auth';

export const useBalance = () => {
  const token = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ['balance'],
    queryFn: async () => {
      const data = await financeApi.getBalance();

      // 🔥 Магия синхронизации: как только получаем новый баланс с сервера,
      // сразу обновляем его в нашем Zustand сторе. Так он обновится ВЕЗДЕ.
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        useAuthStore.setState({
          user: { ...currentUser, balance: data.amount },
        });
      }
      return data;
    },
    // Делаем запрос только если юзер авторизован
    enabled: !!token,
    // Можно включить автообновление баланса каждые 30 секунд
    refetchInterval: 30000,
  });
};

export const useTopUp = () => {
  return useMutation({
    mutationFn: financeApi.createPaylink,
  });
};

export const useWithdrawals = () => {
  return useQuery({
    queryKey: ['withdrawals'],
    queryFn: financeApi.getWithdrawals,
  });
};
