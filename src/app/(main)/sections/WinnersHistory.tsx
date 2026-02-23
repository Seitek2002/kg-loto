import { ApiResponse, PaginatedResult, Winner } from '@/types/api';
import { api } from '@/lib/api';
import { WinnersHistoryClient } from './WinnersHistoryClient';

// Запрос остается здесь (на сервере)
async function getWinnersData(): Promise<Winner[]> {
  try {
    const { data } =
      await api.get<ApiResponse<PaginatedResult<Winner>>>('/winners/');
    return data.data.results || [];
  } catch (error) {
    console.error('Winners Error:', error);
    return [];
  }
}

// Серверный компонент (может быть async)
export const WinnersHistory = async () => {
  const winners = await getWinnersData();

  // Передаем данные в клиентскую часть
  return <WinnersHistoryClient winners={winners} />;
};
