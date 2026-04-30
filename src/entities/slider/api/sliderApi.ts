import { cookies } from "next/headers";

import { SliderItem } from "../model/types";

export const getHeroSlides = async (): Promise<SliderItem[]> => {
  try {
    const cookieStore = await cookies();
    const locale = cookieStore.get("NEXT_LOCALE")?.value || "ru";

    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://kgloto.com/api/v1";

    const res = await fetch(`${baseUrl}/slider/?webview=false`, {
      headers: { "Accept-Language": locale },
      next: { revalidate: 600 }, // Кеш на 10 минут
    });

    if (!res.ok) {
      console.error(`Slider Fetch Error: HTTP ${res.status}`);
      return [];
    }

    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Slider Fetch Error:", error);
    return [];
  }
};
