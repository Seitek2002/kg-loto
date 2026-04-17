import { ApiResponse, LotteryItem } from '@/types/api';
import api from '@/services/api/apiClient';
import { getLocaleHeader } from '@/lib/locale';
import { PopularTicketsClient } from './client'; // Твой UI с Framer Motion

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
  currentLotteryId, // 🔥 Добавили пропс для фильтрации
}: {
  title?: string;
  description?: string;
  initialLotteries?: LotteryItem[];
  currentLotteryId?: string; // ID лотереи, на странице которой мы сейчас находимся
}) => {
  // Получаем данные с сервера
  let lotteries = initialLotteries?.length
    ? initialLotteries
    : await getLotteriesData();

  // 🔥 Фильтруем текущую лотерею прямо на сервере перед отдачей клиенту
  if (currentLotteryId) {
    lotteries = lotteries.filter(
      (loto) => String(loto.id) !== currentLotteryId,
    );
  }

  // Если после фильтрации лотерей не осталось, вообще не рендерим блок
  if (!lotteries || lotteries.length === 0) return null;

  return (
    <PopularTicketsClient
      lotteries={lotteries}
      title={title}
      description={description}
    />
  );
};
