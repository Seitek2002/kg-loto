import { useQuery } from "@tanstack/react-query";

import api from "@/shared/api/apiClient";

import { PaginatedWinnerList, WinnerLotteryOption } from "../model/types";

// Максимум страниц, которые пройдём вслед за курсором next — просто защита
// от зацикливания при некорректном ответе бэка, реальных данных сильно меньше
const MAX_PAGES = 50;

// Лотереи, по которым есть отмеченные победители — источник фильтра на
// экране /winners. Не пагинируется, авторизация не нужна.
export const useWinnerLotteries = () => {
  return useQuery({
    queryKey: ["winners-lotteries"],
    queryFn: async () => {
      const { data } = await api.get<
        WinnerLotteryOption[] | { data: WinnerLotteryOption[] }
      >("/winners/lotteries/");
      // На всякий случай поддерживаем и голый массив, и обёртку { data }
      return Array.isArray(data) ? data : data.data;
    },
  });
};

export const useWinners = (lotteryIds: (number | string)[] = []) => {
  return useQuery({
    queryKey: ["winners-all", lotteryIds],
    queryFn: async () => {
      // 🔥 /winners/ отдаёт результаты постранично (по 10 на страницу),
      // поэтому проходим по всем страницам через `next`. Фильтр по лотерее
      // передаём только в первом запросе — `next` уже несёт его в query-строке.
      const results: PaginatedWinnerList["results"] = [];
      let nextUrl: string | null = "/winners/";
      let isFirstRequest = true;

      for (let page = 0; page < MAX_PAGES; page++) {
        if (!nextUrl) break;

        const params =
          isFirstRequest && lotteryIds.length > 0
            ? lotteryIds.length === 1
              ? { lotteryId: lotteryIds[0] }
              : { lotteryIds: lotteryIds.join(",") }
            : undefined;
        isFirstRequest = false;

        const response: { data: PaginatedWinnerList } = (
          await api.get<{ data: PaginatedWinnerList }>(nextUrl, { params })
        ).data;
        results.push(...response.data.results);
        nextUrl = response.data.next;
      }

      return results;
    },
  });
};
