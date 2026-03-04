import { getRequestConfig } from 'next-intl/server';
// 🔥 1. Обязательно импортируем cookies
import { cookies } from 'next/headers';

// Убираем аргумент { locale }, он нам больше не нужен, берем всё из кук
export default getRequestConfig(async () => {
  // 🔥 2. Читаем куку, которую сохранил наш LanguageSwitcher
  const cookieStore = await cookies();
  const currentLocale = cookieStore.get('NEXT_LOCALE')?.value || 'ru';

  // 3. Делаем запрос к твоему API
  const res = await fetch('https://crm.kgloto.com/api/v1/page-texts/', {
    next: { revalidate: 60 },
  });
  const json = await res.json();

  // 4. Превращаем массив от бэкенда во вложенный объект
  const messages: Record<string, any> = {};

  if (json?.data?.results) {
    json.data.results.forEach((item: any) => {
      const keys = item.key.split('.');
      let current = messages;

      // Строим вложенность
      keys.forEach((k: string, i: number) => {
        if (i === keys.length - 1) {
          current[k] = currentLocale === 'ky' ? item.textKy : item.textRu;

          current[`${k}_file`] = item.file || '#';
        } else {
          current[k] = current[k] || {};
          current = current[k];
        }
      });
    });
  }

  // 5. Отдаем готовый словарь библиотеке
  return {
    locale: currentLocale,
    messages, // Передаем тот самый объект messages, который мы только что собрали
  };
});
