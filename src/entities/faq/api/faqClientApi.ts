import { useQuery } from "@tanstack/react-query";

import api from "@/shared/api/apiClient";

import { FAQItemType } from "../model/types";

// Клиентский аналог getFAQData: тот же /qa/, но для клиентских компонентов
// (серверная версия использует cookies() и в них недоступна).
export const useFAQ = () => {
  return useQuery({
    queryKey: ["faq"],
    queryFn: async (): Promise<FAQItemType[]> => {
      const { data } = await api.get<{ data: FAQItemType[] }>("/qa/");
      return data.data || [];
    },
    staleTime: 60 * 60 * 1000, // вопросы меняются редко
  });
};
