import { useQuery } from "@tanstack/react-query";

import api from "@/shared/api/apiClient";

import { PaginatedWinnerList } from "../model/types";

export const useWinners = () => {
  return useQuery({
    queryKey: ["winners-all"],
    queryFn: async () => {
      const { data } = await api.get<{ data: PaginatedWinnerList }>(
        "/winners/",
      );
      return data.data.results;
    },
  });
};
