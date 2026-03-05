import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const currentLocale = cookieStore.get('NEXT_LOCALE')?.value || 'ru';

  try {
    const res = await fetch('https://crm.kgloto.com/api/v1/page-texts/', {
      headers: {
        'Accept-Language': currentLocale,
      },
      next: { revalidate: 60 },
    });

    const json = await res.json();

    // 🔥 1. Броня для новых разделов: заранее объявляем их пустыми,
    // чтобы не было ошибки "Could not resolve namespace"
    const messages: Record<string, any> = {
      seo: {},
      footer: {},
    };

    if (json?.data?.results) {
      json.data.results.forEach((item: any) => {
        const keys = item.key.split('.');
        let current = messages;

        keys.forEach((k: string, i: number) => {
          if (i === keys.length - 1) {
            let text = item.text || '';
            text = text.replace(/<\/br>/gi, '');
            text = text.replace(/<br\s*\/?>/gi, '<br></br>');

            current[k] = text;
            current[`${k}_file`] = item.file || '#';
          } else {
            current[k.toLowerCase()] = current[k.toLowerCase()] || {};
            current = current[k.toLowerCase()];
          }
        });
      });
    }

    return {
      locale: currentLocale,
      messages,

      // 🔥 2. ГЛУШИТЕЛЬ ОШИБОК: Запрещаем библиотеке ругаться в консоль на недостающие ключи
      onError(error) {
        if (error.code === 'MISSING_MESSAGE') {
          return; // Просто игнорируем
        }
        console.error(error); // Остальные реальные ошибки оставляем
      },

      // 🔥 3. Говорим библиотеке: "Если не нашла перевод, просто верни название ключа"
      // Благодаря этому наши проверки t('phone_1') === 'phone_1' будут работать железобетонно
      getMessageFallback({ key }) {
        return key;
      },
    };
  } catch (error) {
    console.error('Ошибка при загрузке словаря в i18n.ts:', error);
    return {
      locale: currentLocale,
      messages: {},
    };
  }
});
