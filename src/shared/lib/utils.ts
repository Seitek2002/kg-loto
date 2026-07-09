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

// Временный костыль: пока бэк не завёл отдельные поля под тиражные лотереи,
// контент (телетрансляция, дата и т.д.) кладут в PageText как JS-объект-литерал
// (незакавыченные ключи, одинарные кавычки, висячая запятая) — не строгий JSON.
// Приводим к JSON и парсим, без eval/Function.
export const parseLooseObject = (
  raw: string,
): Record<string, string> | null => {
  try {
    const json = raw
      .replace(/'/g, '"')
      .replace(/([{,]\s*)([A-Za-z0-9_]+)(\s*:)/g, '$1"$2"$3')
      .replace(/,(\s*[}\]])/g, "$1");
    const parsed = JSON.parse(json);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
};
