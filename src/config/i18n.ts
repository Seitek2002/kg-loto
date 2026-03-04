import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const currentLocale = cookieStore.get('NEXT_LOCALE')?.value || 'ru';

  try {
    // Делаем запрос к API, обязательно передавая заголовок языка
    const res = await fetch('https://crm.kgloto.com/api/v1/page-texts/', {
      headers: {
        'Accept-Language': currentLocale,
      },
      next: { revalidate: 60 },
    });

    const json = await res.json();
    const messages: Record<string, any> = {};

    if (json?.data?.results) {
      json.data.results.forEach((item: any) => {
        const keys = item.key.split('.');
        let current = messages;

        // Строим вложенность
        keys.forEach((k: string, i: number) => {
          if (i === keys.length - 1) {
            // 🔥 БЕРЕМ ПРОСТО item.text (бэкенд уже перевел его для нас)
            current[k] = item.text || '';

            // Файлы для футера оставляем как есть
            current[`${k}_file`] = item.file || '#';
          } else {
            current[k] = current[k] || {};
            current = current[k];
          }
        });
      });
    }

    // Отдаем готовый словарь библиотеке
    return {
      locale: currentLocale,
      messages,
    };
  } catch (error) {
    console.error('Ошибка при загрузке словаря в i18n.ts:', error);
    return {
      locale: currentLocale,
      messages: {},
    };
  }
});
