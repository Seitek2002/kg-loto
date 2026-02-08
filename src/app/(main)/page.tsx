import { api } from '@/lib/api';
import {
  SliderItem,
  ApiResponse,
  NewsItem,
  QAItem,
  LotteryItem,
} from '@/types/api';
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

// 1. Slider
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

// 2. News
async function getNewsData(): Promise<NewsItem[]> {
  try {
    const { data } = await api.get<ApiResponse<NewsItem[]>>('/news/');
    return data.data || [];
  } catch (error) {
    console.error('News Error:', error);
    return [];
  }
}

// 3. FAQ 🔥
async function getFAQData(): Promise<QAItem[]> {
  try {
    const { data } = await api.get<ApiResponse<QAItem[]>>('/qa/');
    return data.data || [];
  } catch (error) {
    console.error('FAQ Error:', error);
    return [];
  }
}

// 4. Lotteries 🔥
async function getLotteriesData(): Promise<LotteryItem[]> {
  try {
    const { data } = await api.get<ApiResponse<LotteryItem[]>>('/lotteries/');
    return data.data || [];
  } catch (error) {
    console.error('Lotteries Error:', error);
    return [];
  }
}

export default async function Home() {
  const [slides, news, faq, lotteries] = await Promise.all([
    getSliderData(),
    getNewsData(),
    getFAQData(),
    getLotteriesData(),
  ]);

  return (
    <div>
      <Hero slides={slides} />

      <div className='px-4 mt-10 xl:max-w-[80%] mx-auto'>
        <PopularTickets lotteries={lotteries} />
        <CheckLottery />
        <WinnersHistory />

        <BestMaterials articles={news} />

        <FAQ questions={faq} />

        <OurApp />
      </div>

      <div className='h-8' />
    </div>
  );
}
