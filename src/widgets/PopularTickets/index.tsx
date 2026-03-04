import { ApiResponse, LotteryItem } from '@/types/api';
import { api } from '@/lib/api';
import { getLocaleHeader } from '@/lib/locale';
import { PopularTicketsClient } from './client'; // Импортируем UI

async function getLotteriesData(): Promise<LotteryItem[]> {
  try {
    const { data } = await api.get<ApiResponse<LotteryItem[]>>('/lotteries/', {
      headers: await getLocaleHeader(),
    });
    return data.data || [];
  } catch (error) {
    console.error('Lotteries Error:', error);
    return [];
  }
}

export const PopularTickets = async ({
  title,
  description,
  initialLotteries,
}: {
  title?: string;
  description?: string;
  initialLotteries?: LotteryItem[];
}) => {
  const lotteries = initialLotteries?.length
    ? initialLotteries
    : await getLotteriesData();

  if (!lotteries || lotteries.length === 0) return null;

  return (
    <PopularTicketsClient
      lotteries={lotteries}
      title={title}
      description={description}
    />
  );
};
