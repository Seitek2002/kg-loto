import { useQuery } from '@tanstack/react-query';
import api from '@/services/api/apiClient';

// --- ТИПЫ ---

// 1. Тип для Витрины (Главная страница)
export interface CatalogLottery {
  id: number;
  title: string;
  subtitle: string;
  lotteryType: 'instant' | 'draw';
  imageLive: string;
  backgroundImage: string;
  buttonPrice: number | null;
  // ... другие поля витрины
}

// 2. Тип для Биллинга (Страница тиражных лотерей и покупки)
export interface CurrentLottery {
  lotteryId: string; // Заметь, тут UUID (строка)
  code: string;
  name: string;
  description: string;
  currency: string;
  ticketPrice: number;
  minNumbers: number;
  maxNumbers: number;
  fieldSize: number;
  saleStatus: string;
  saleStartAt: string;
  saleEndAt: string;
}

// 3. 🔥 Тип для Тиражей (Активные и архивные)
export interface CurrentDraw {
  drawId: string;
  lotteryId: string;
  drawNumber: number;
  drawDate: string;
  drawTime: string;
  salesStartAt: string;
  salesEndAt: string;
  status: 'open' | 'closed' | 'completed' | 'cancelled';
  winningCombination: number[] | null;
  jackpotAmount: number;
  currency: string;
}

// --- ФЕТЧЕРЫ ---

const fetchCatalogLotteries = async (): Promise<CatalogLottery[]> => {
  // apiClient сам конвертирует snake_case ответа в camelCase
  const { data } = await api.get('/lotteries/');
  return data.data;
};

const fetchCurrentLotteries = async (): Promise<CurrentLottery[]> => {
  const { data } = await api.get('/lotteries/current');
  return data.data;
};

// 🔥 Фетчер для тиражей
const fetchCurrentDraws = async (lotteryId: string): Promise<CurrentDraw[]> => {
  const { data } = await api.get('/draws/current', {
    // Передаем lotteryId в параметрах. apiClient позаботится о конвертации
    params: { lotteryId },
  });
  return data.data;
};

// --- ХУКИ ---

/**
 * Хук для Главной страницы (Витрина всех лотерей)
 */
export const useLotteries = () => {
  return useQuery({
    queryKey: ['lotteries-catalog'],
    queryFn: fetchCatalogLotteries,
    staleTime: 5 * 60 * 1000, // Данные свежие 5 минут
    gcTime: 30 * 60 * 1000, // Кэш хранится 30 минут (для плавных переходов)
  });
};

/**
 * Хук для страницы Тиражных билетов (Биллинг и таймеры)
 */
export const useCurrentLotteries = () => {
  return useQuery({
    queryKey: ['lotteries-current'],
    queryFn: fetchCurrentLotteries,
    staleTime: 1 * 60 * 1000, // Здесь время свежести меньше (1 мин), так как важно следить за saleEndAt
    gcTime: 15 * 60 * 1000,
  });
};

/**
 * 🔥 Хук для Тиражей (Используем на странице конкретной лотереи)
 */
export const useCurrentDraws = (lotteryId?: string) => {
  return useQuery({
    // Добавляем lotteryId в ключ, чтобы кэш был уникальным для каждой лотереи
    queryKey: ['draws', lotteryId],
    // Если lotteryId нет, функция не вызовется из-за enabled, но TS требует страховку
    queryFn: () => fetchCurrentDraws(lotteryId as string),
    enabled: !!lotteryId, // Запрос пойдет только если мы передали ID
    staleTime: 1 * 60 * 1000, // Кэшируем на 1 минуту
    gcTime: 15 * 60 * 1000,
  });
};
