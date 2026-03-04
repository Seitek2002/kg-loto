import { api } from '@/lib/api';
import { getLocaleHeader } from '@/lib/locale';
import { ApiResponse, BranchItem } from '@/types/api';
import { WhereToBuyClient } from './client'; // 🔥 Импортируем наш клиентский UI

async function getBranchesData(): Promise<BranchItem[]> {
  try {
    const { data } = await api.get<ApiResponse<BranchItem[]>>('/branches/', {
      headers: await getLocaleHeader(),
    });
    return data.data || [];
  } catch (error) {
    console.error('Branches Error:', error);
    return [];
  }
}

// Это Серверный Компонент, он МОЖЕТ быть async
export const WhereToBuy = async () => {
  // 1. Ждем данные на сервере
  const branches = await getBranchesData();

  // 2. Передаем их в клиентский компонент для отрисовки карты
  return <WhereToBuyClient branches={branches} />;
};
