import { api } from '@/lib/api';
import { ApiResponse, LotteryItem } from '@/types/api';
import { TicketDetailContent } from './TicketDetailContent';

async function getLotteriesData(): Promise<LotteryItem[]> {
  try {
    const { data } = await api.get<ApiResponse<LotteryItem[]>>('/lotteries/');
    return data.data || [];
  } catch (error) {
    console.error('Error fetching lotteries:', error);
    return [];
  }
}

interface PageProps {
  params: { id: string };
}

export default async function TicketDetailPage({ params }: PageProps) {
  // 1. Получаем ID из параметров (на сервере это просто пропсы)
  const { id } = params;

  // 2. Загружаем популярные лотереи
  const popularLotteries = await getLotteriesData();

  // 3. Рендерим клиентский компонент с данными
  return <TicketDetailContent id={id} popularLotteries={popularLotteries} />;
}
