import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // 🔥 Задаем значение по умолчанию, чтобы TS точно знал, что это строка
  const currentLocale = locale || 'ru';

  // 1. Делаем запрос к твоему API (добавь кэширование по необходимости)
  const res = await fetch('https://crm.kgloto.com/api/v1/page-texts/', {
    next: { revalidate: 60 }, // Кэшируем на 60 секунд, чтобы не спамить бэкенд
  });
  const json = await res.json();

  // 2. Превращаем массив от бэкенда во вложенный объект
  const messages: Record<string, any> = {};

  if (json?.data?.results) {
    json.data.results.forEach((item: any) => {
      const keys = item.key.split('.');
      let current = messages;

      // Строим вложенность
      keys.forEach((k: string, i: number) => {
        if (i === keys.length - 1) {
          // 🔥 Используем currentLocale для проверки
          current[k] = currentLocale === 'ky' ? item.textKy : item.textRu;
        } else {
          current[k] = current[k] || {};
          current = current[k];
        }
      });
    });
  }

  // 3. Отдаем готовый словарь библиотеке
  return {
    locale: currentLocale, // 🔥 Теперь TS спокоен (это 100% строка)
    messages,
  };
});
