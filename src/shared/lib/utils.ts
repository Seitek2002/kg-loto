import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SITE_HOSTNAME = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_API_URL || "https://kgloto.com/api/v1")
      .hostname;
  } catch {
    return "kgloto.com";
  }
})();

export const getRelativeUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    // CMS иногда отдаёт внутренние ссылки абсолютным URL — превращаем их в
    // относительный путь, чтобы next/link навигировал по SPA, а не грузил
    // страницу заново. Внешние ссылки (Telegram, Instagram и т.п.) оставляем
    // абсолютными как есть — иначе они вели бы на несуществующий внутренний
    // путь вместо реального внешнего сайта.
    return parsed.hostname === SITE_HOSTNAME ? parsed.pathname : url;
  } catch {
    return url.startsWith("/") ? url : `/${url}`;
  }
};
