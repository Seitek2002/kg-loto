import { useQuery } from "@tanstack/react-query";

import api from "@/shared/api/apiClient";

import { PaginatedWinnerList } from "../model/types";

// Максимум страниц, которые пройдём вслед за курсором next — просто защита
// от зацикливания при некорректном ответе бэка, реальных данных сильно меньше
const MAX_PAGES = 50;

export const useWinners = () => {
  return useQuery({
    queryKey: ["winners-all"],
    queryFn: async () => {
      // 🔥 /winners/ отдаёт результаты постранично (по 10 на страницу).
      // Фильтры "Значок лотереи" строятся из ВСЕХ победителей, поэтому нужно
      // пройти по всем страницам через `next`, а не брать только первую —
      // иначе бейджи, которые появляются только на поздних страницах
      // (например "Забери миллион!", "Уйго белек"), никогда не попадут в список.
      const results: PaginatedWinnerList["results"] = [];
      let nextUrl: string | null = "/winners/";

      for (let page = 0; page < MAX_PAGES; page++) {
        if (!nextUrl) break;
        const response: { data: PaginatedWinnerList } = (
          await api.get<{ data: PaginatedWinnerList }>(nextUrl)
        ).data;
        results.push(...response.data.results);
        nextUrl = response.data.next;
      }

      return results;
    },
  });
};
