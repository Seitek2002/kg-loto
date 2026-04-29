import { cookies } from "next/headers";

import { RecentWinnerApi, Winner, WinnerType } from "../model/types";

interface RecentWinnersResponse {
  data: {
    results: RecentWinnerApi[];
  };
}

interface WinnersResponse {
  data: {
    results: Winner[];
  };
}

export const getRecentWinners = async (): Promise<WinnerType[]> => {
  try {
    const cookieStore = await cookies();
    const locale = cookieStore.get("NEXT_LOCALE")?.value || "ru";
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://kgloto.com/api/v1";

    const res = await fetch(`${baseUrl}/lottery/recent-winners/`, {
      headers: { "Accept-Language": locale },
      next: { revalidate: 300 },
    });

    if (!res.ok) return [];

    const json: RecentWinnersResponse = await res.json();
    const results = json.data?.results || [];

    return results.map((item, index) => {
      const numericPrize = Number(item.prize);
      const isNumber = !isNaN(numericPrize) && item.prize.trim() !== "";

      return {
        id: item.id,
        name: item.name,
        date: item.date,
        amount: isNumber
          ? new Intl.NumberFormat("ru-RU").format(numericPrize)
          : item.prize,
        currency: isNumber ? "С" : "",
        logo: item.lotteryLogo,
        isYellow: index % 2 === 0,
        isTextPrize: !isNumber,
      };
    });
  } catch (error) {
    console.error("Error fetching recent winners:", error);
    return [];
  }
};

export const getWinnersData = async (params?: {
  lotteryId?: string;
}): Promise<Winner[]> => {
  try {
    const cookieStore = await cookies();
    const locale = cookieStore.get("NEXT_LOCALE")?.value || "ru";
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://kgloto.com/api/v1";

    const url = new URL(`${baseUrl}/winners/`);
    if (params?.lotteryId) {
      url.searchParams.append("lotteryId", params.lotteryId);
    }

    const res = await fetch(url.toString(), {
      headers: { "Accept-Language": locale },
      next: { revalidate: 600 },
    });

    if (!res.ok) return [];
    const json: WinnersResponse = await res.json();
    return json.data?.results || [];
  } catch (error) {
    console.error("Winners Fetch Error:", error);
    return [];
  }
};
