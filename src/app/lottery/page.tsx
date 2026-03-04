import { api } from '@/lib/api';
import { getLocaleHeader } from '@/lib/locale';
import { ApiResponse, LotteryItem } from '@/types/api';
import { getTranslations } from 'next-intl/server';
import { LotteryListContent } from './LotteryListContent';

async function getAllLotteries(): Promise<LotteryItem[]> {
  try {
    const { data } = await api.get<ApiResponse<LotteryItem[]>>('/lotteries/', {
      headers: await getLocaleHeader(),
      // Если у вас есть пагинация лотерей, бэкенд может отдавать PaginatedResult,
      // но в PopularTickets мы получали просто массив data.data.
      // Оставляю как было в PopularTickets!
    });
    return data.data || [];
  } catch (error) {
    console.error('Error fetching lotteries page:', error);
    return [];
  }
}

export default async function LotteriesPage() {
  const lotteries = await getAllLotteries();

  // 🔥 Берем переводы, которые ты уже добавлял для главной страницы и хедера
  const t = await getTranslations('populartickets');
  const tHeader = await getTranslations('header');

  return (
    <LotteryListContent
      initialLotteries={lotteries}
      pageTitle={tHeader('instant')} // "Моментальные"
      title={t('title')} // "Популярные лотереи"
      description={t('desc')} // Описание
    />
  );
}
