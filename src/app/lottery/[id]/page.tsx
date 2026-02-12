import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { ApiResponse, LotteryDetail } from '@/types/api';
import { LotteryDetailContent } from './LotteryDetailContent';

// 🔥 ВАЖНО: В Next.js 15 params - это Promise
interface PageProps {
  params: Promise<{ id: string }>;
}

// Функция получения данных одной лотереи
async function getLotteryData(id: string): Promise<LotteryDetail | null> {
  try {
    const { data } = await api.get<ApiResponse<LotteryDetail>>(`/lotteries/${id}/`);
    return data.data;
  } catch (error) {
    console.error(`Error fetching lottery ${id}:`, error);
    return null;
  }
}

export default async function LotteryDetailPage({ params }: PageProps) {
  // 🔥 1. Сначала ждем разрешения промиса params
  const { id } = await params;

  // 2. Теперь id у нас есть ("1"), делаем запрос
  const lottery = await getLotteryData(id);
  console.log(lottery);

  // 3. Если лотерея не найдена или ошибка API — показываем 404
  if (!lottery) {
    return notFound();
  }

  // 4. Рендерим клиентский контент
  return <LotteryDetailContent lottery={lottery} />;
}