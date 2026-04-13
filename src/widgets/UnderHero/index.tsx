import { getTranslations } from 'next-intl/server';
import { WinnersMarquee, WinnerType } from './WinnersMarquee';
import { Title } from '@/components/ui/Title';
import api from '@/services/api/apiClient';
import { getLocaleHeader } from '@/lib/locale';

interface RecentWinnerApi {
  id: number;
  name: string;
  prize: string;
  lotteryLogo: string;
  date: string;
}

interface RecentWinnersResponse {
  data: {
    results: RecentWinnerApi[];
  };
}

// Запрос на сервер
async function getRecentWinners(): Promise<WinnerType[]> {
  try {
    const { data } = await api.get<RecentWinnersResponse>(
      '/lottery/recent-winners/',
      {
        headers: await getLocaleHeader(),
      },
    );

    const results = data.data.results || [];

    return results.map((item, index) => {
      // 🔥 Проверяем, является ли приз числом
      const numericPrize = Number(item.prize);
      const isNumber = !isNaN(numericPrize) && item.prize.trim() !== '';

      return {
        id: item.id,
        name: item.name,
        date: item.date,
        // Если число - форматируем, если текст - отдаем как есть
        amount: isNumber
          ? new Intl.NumberFormat('ru-RU').format(numericPrize)
          : item.prize,
        // Если это не число (т.е. вещь вроде машины), убираем знак валюты
        currency: isNumber ? 'С' : '',
        logo: item.lotteryLogo,
        isYellow: index % 2 === 0,
        // Сохраняем информацию о том, число это или текст, чтобы правильно стилизовать размер шрифта
        isTextPrize: !isNumber,
      };
    });
  } catch (error) {
    console.error('Error fetching recent winners:', error);
    return [];
  }
}

const UnderHero = async () => {
  const t = await getTranslations('home');
  const winners = await getRecentWinners();

  if (!winners || winners.length === 0) {
    return null;
  }

  let paddedWinners = [...winners];
  while (paddedWinners.length < 8) {
    paddedWinners = [...paddedWinners, ...winners];
  }

  return (
    <section className='mx-auto relative py-12 overflow-hidden'>
      <div className='pl-4 uppercase mb-8 max-w-300 mx-auto'>
        <Title>{t('recent_winners_title')}</Title>
      </div>

      <WinnersMarquee winners={paddedWinners} />
    </section>
  );
};

export default UnderHero;
