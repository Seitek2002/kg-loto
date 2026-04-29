import { cookies } from "next/headers";

import { Branch, BranchResponseItem } from "../model/types";

interface BranchesResponse {
  data: BranchResponseItem[];
}

export const getBranchesData = async (): Promise<Branch[]> => {
  try {
    const cookieStore = await cookies();
    const locale = cookieStore.get("NEXT_LOCALE")?.value || "ru";
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://kgloto.com/api/v1";

    const res = await fetch(`${baseUrl}/branches/`, {
      headers: { "Accept-Language": locale },
      next: { revalidate: 3600 }, // Кешируем на 1 час
    });

    if (!res.ok) return [];

    const json: BranchesResponse = await res.json();
    const rawBranches = json.data || [];

    // 🔥 Сразу конвертируем данные под нужды фронтенда
    return rawBranches.map((branch) => ({
      id: String(branch.id), // Карта ждет строку
      name: branch.name,
      address: branch.address,
      lat: Number(branch.lat), // Карта ждет число
      lng: Number(branch.lng), // Карта ждет число
    }));
  } catch (error) {
    console.error("Branches Fetch Error:", error);
    return [];
  }
};
