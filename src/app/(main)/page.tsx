import { api } from '@/lib/api';
import { SliderItem, ApiResponse, NewsItem } from '@/types/api';
import { Hero, HeroSlideData } from './sections/Hero';
import { BestMaterials } from './sections/BestMaterials';
import { CheckLottery } from './sections/CheckLottery';
import { FAQ } from './sections/FAQ';
import { OurApp } from './sections/OurApp';
import { PopularTickets } from './sections/PopularTickets';
import { WinnersHistory } from './sections/WinnersHistory';

export const revalidate = 600;

const FALLBACK_SLIDES: HeroSlideData[] = [
  {
    id: 'fallback-1',
    bg: '/banners/1.jpg',
    title1: 'СТАНЬ МИЛЛИОНЕРОМ',
    title2: 'Призовой фонд 10 000 000 сом',
    prize: '1 000 000 СОМ',
    price: '200 сом',
    buttonLabel: 'ИГРАТЬ • 200 СОМ',
  },
];

// 1. Функция получения Слайдера
async function getSliderData(): Promise<HeroSlideData[]> {
  try {
    const { data } = await api.get<ApiResponse<SliderItem[]>>('/slider/');
    if (!data.data || data.data.length === 0) return FALLBACK_SLIDES;

    return data.data.map((item) => ({
      id: item.id,
      bg: item.image,
      title1: item.title,
      title2: item.subtitle,
      prize: item.prizeText,
      price: item.buttonPrice,
      buttonLabel: item.buttonLabel,
    }));
  } catch (error) {
    console.error('Slider Error:', error);
    return FALLBACK_SLIDES;
  }
}

// 2. Функция получения Новостей
async function getNewsData(): Promise<NewsItem[]> {
  try {
    // В swagger нет параметров пагинации в get запросе, но обычно новости берут limit=5 или типа того.
    // Если API отдает все, то просто берем все.
    const { data } = await api.get<ApiResponse<NewsItem[]>>('/news/');
    return data.data || [];
  } catch (error) {
    console.error('News Error:', error);
    return []; // Возвращаем пустой массив при ошибке
  }
}

export default async function Home() {
  // 🔥 3. Параллельный запрос данных (Самый быстрый способ)
  // Мы запускаем оба запроса одновременно и ждем, пока выполнятся оба
  const [slides, news] = await Promise.all([getSliderData(), getNewsData()]);

  return (
    <div>
      <Hero slides={slides} />

      <div className='px-4 mt-10 xl:max-w-[80%] mx-auto'>
        <PopularTickets />
        <CheckLottery />
        <WinnersHistory />

        {/* 🔥 4. Передаем новости пропсом */}
        <BestMaterials articles={news} />

        <FAQ />
        <OurApp />
      </div>

      <div className='h-8' />
    </div>
  );
}
