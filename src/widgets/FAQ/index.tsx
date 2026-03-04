import { Description } from '@/components/ui/Description';
import { FAQItem } from '@/components/ui/FAQItem';
import { Title } from '@/components/ui/Title';
import { api } from '@/lib/api';
import { getLocaleHeader } from '@/lib/locale';
import { ApiResponse, QAItem } from '@/types/api';
import { getTranslations } from 'next-intl/server';

async function getFAQData(): Promise<QAItem[]> {
  try {
    const { data } = await api.get<ApiResponse<QAItem[]>>('/qa/', {
      headers: await getLocaleHeader(),
    });
    return data.data || [];
  } catch (error) {
    console.error('FAQ Error:', error);
    return [];
  }
}

export const FAQ = async () => {
  const questions = await getFAQData();
  // 🔥 Подключаем словарь
  const t = await getTranslations('faq');

  if (!questions || questions.length === 0) return null;

  return (
    <section className='my-12' id='faq'>
      {/* Заголовки */}
      <div className='mb-8'>
        <Title>
          {/* 🔥 t.rich позволяет безопасно рендерить <br> из текста */}
          {t.rich('title', {
            br: () => <br />,
          })}
        </Title>
        <Description>{t('desc')}</Description>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 items-start'>
        {questions.map((item) => (
          <FAQItem
            key={item.id}
            question={item.question}
            answer={item.answer}
          />
        ))}
      </div>
    </section>
  );
};
