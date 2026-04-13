import api from './api/apiClient';

export interface CheckTicketResponse {
  isWinning: boolean;
  combinationId: number;
  message: string;
  prizeType: string;
  prizeAmount: string | null;
  prizeProduct: string | null;
}

export const TicketService = {
  // Функция проверки билета
  checkCombination: async (code: string): Promise<CheckTicketResponse> => {
    // 🔥 ИСПРАВЛЕНИЕ 2: Просто передаем объект { code } и полный URL.
    // Наш apiClient сам поставит заголовки, токен и нужный формат.
    const { data } = await api.post('/me/combination/check/', { code });

    return data.data;
  },
};
