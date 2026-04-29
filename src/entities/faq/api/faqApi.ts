import { cookies } from "next/headers";

import { FAQItemType } from "../model/types";

interface FAQResponse {
  data: FAQItemType[];
}

export const getFAQData = async (): Promise<FAQItemType[]> => {
  try {
    const cookieStore = await cookies();
    const locale = cookieStore.get("NEXT_LOCALE")?.value || "ru";
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://kgloto.com/api/v1";

    const res = await fetch(`${baseUrl}/qa/`, {
      headers: { "Accept-Language": locale },
      next: { revalidate: 3600 }, // Кешируем на час (вопросы меняются редко)
    });

    if (!res.ok) return [];

    const json: FAQResponse = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("FAQ Fetch Error:", error);
    return [];
  }
};
