import { api } from '@/lib/api';

export interface CheckTicketResponse {
  is_winning: boolean;
  combination_id: number;
  message: string;
  prize_type: string;
  prize_amount: string | null;
  prize_product: string | null;
}

export const TicketService = {
  // Функция проверки билета
  checkCombination: async (code: string): Promise<CheckTicketResponse> => {
    // Форматируем данные как x-www-form-urlencoded (согласно твоему Swagger)
    const formData = new URLSearchParams();
    formData.append('code', code);

    const { data } = await api.post('/v1/me/combination/check/', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    return data.data; // Возвращаем именно объект data из ответа
  },
};