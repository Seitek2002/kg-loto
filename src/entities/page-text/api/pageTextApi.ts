import { useQuery } from "@tanstack/react-query";

import api from "@/shared/api/apiClient";

export interface PageTextItem {
  key: string;
  text: string;
  file: string | null;
}

interface PageTextsResponse {
  data: { results: PageTextItem[] };
}

// Тот же эндпоинт, что использует SSR-бутстрап next-intl (src/i18n/request.ts),
// но берём его напрямую в обход ICU-парсера — некоторые записи (временные
// костыли под тиражные лотереи) хранят сырой JS-объект в тексте, и фигурные
// скобки в нём ломают ICU message-формат next-intl.
export const usePageTexts = () =>
  useQuery({
    queryKey: ["page-texts"],
    queryFn: async () => {
      const { data } = await api.get<PageTextsResponse>("/page-texts/", {
        params: { page_size: 100 },
      });
      return data.data.results;
    },
    staleTime: 5 * 60 * 1000,
  });
