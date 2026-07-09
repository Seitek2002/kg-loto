import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import api from "@/shared/api/apiClient";

import { PaginatedWinnerList, WinnerLotteryOption } from "../model/types";

// Бэк отдаёт /winners/ постранично, размер страницы задаётся camelCase
// параметром pageSize (подтверждено бек-разработчиком)
const PAGE_SIZE = 10;

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
  return useInfiniteQuery<PaginatedWinnerList>({
    queryKey: ["winners", lotteryIds],
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next ? allPages.length + 1 : undefined,
    queryFn: async ({ pageParam }) => {
      const params: Record<string, unknown> = {
        pageSize: PAGE_SIZE,
        page: pageParam,
      };
      if (lotteryIds.length === 1) params.lotteryId = lotteryIds[0];
      else if (lotteryIds.length > 1)
        params.lotteryIds = lotteryIds.join(",");

      const { data } = await api.get<{ data: PaginatedWinnerList }>(
        "/winners/",
        { params },
      );
      return data.data;
    },
  });
};
