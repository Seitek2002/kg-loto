import { cookies } from "next/headers";

import { User } from "../model/types";

// Эта функция работает ТОЛЬКО в серверных компонентах
export async function getServerUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) return null;

  try {
    // 🔥 Ставим жесткий fallback на реальный API, если .env недоступен
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://kgloto.com/api/v1";

    const res = await fetch(`${baseUrl}/profile/me/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept-Language": cookieStore.get("NEXT_LOCALE")?.value || "ru",
      },
      // cache: 'no-store' // Раскомментируй, если данные меняются очень часто
      next: { revalidate: 60 }, // Или ревалидация раз в 60 сек (настроим под задачу)
    });

    if (!res.ok) return null;

    const data = await res.json();

    // Тут можно сделать конвертацию snake_case в camelCase, если fetch возвращает snake
    return data.data || data;
  } catch (error) {
    console.error("Ошибка при SSR загрузке профиля:", error);
    return null;
  }
}
