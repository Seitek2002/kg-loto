import { ApiResponse, LotteryItem } from '@/types/api';
import { api } from '@/lib/api';
import { PopularTicketsClient } from './client'; // Импортируем UI

async function getLotteriesData(): Promise<LotteryItem[]> {
  try {
    const { data } = await api.get<ApiResponse<LotteryItem[]>>('/lotteries/');
    return data.data || [];
  } catch (error) {
    console.error('Lotteries Error:', error);
    return [];
  }
}

export const PopularTickets = async () => {
  const lotteries = await getLotteriesData();

  if (!lotteries || lotteries.length === 0) return null;

  return <PopularTicketsClient lotteries={lotteries} />;
};
