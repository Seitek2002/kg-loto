import { cookies } from "next/headers";

import { LotteryDetail, LotteryItem } from "../model/types";

export const getLotteriesData = async (): Promise<LotteryItem[]> => {
  try {
    const cookieStore = await cookies();
    const locale = cookieStore.get("NEXT_LOCALE")?.value || "ru";
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://kgloto.com/api/v1";

    const res = await fetch(`${baseUrl}/lotteries/`, {
      headers: { "Accept-Language": locale },
      next: { revalidate: 600 },
    });

    if (!res.ok) return [];
    const json = await res.json();
    const lotteries: LotteryItem[] = json.data || [];
    // /lotteries/ отдаёт и моментальные, и тиражные лотереи вперемешку —
    // этот список используется только для моментальных (главная, /lottery)
    return lotteries.filter((lottery) => lottery.lotteryType !== "draw");
  } catch (error) {
    console.error("Lotteries Error:", error);
    return [];
  }
};

export const getLotteryDetail = async (
  id: string,
): Promise<LotteryDetail | null> => {
  try {
    const cookieStore = await cookies();
    const locale = cookieStore.get("NEXT_LOCALE")?.value || "ru";
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://kgloto.com/api/v1";

    const res = await fetch(`${baseUrl}/lotteries/${id}/`, {
      headers: { "Accept-Language": locale },
      next: { revalidate: 600 },
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error(`Lottery Detail Error (ID: ${id}):`, error);
    return null;
  }
};
