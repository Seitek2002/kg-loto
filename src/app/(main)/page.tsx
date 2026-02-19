import { api } from '@/lib/api';
import {
  SliderItem,
  ApiResponse,
  NewsItem,
  QAItem,
  LotteryItem,
  BranchItem,
  PaginatedResult,
} from '@/types/api';
import { Hero, HeroSlideData } from './sections/Hero';
import { BestMaterials } from './sections/BestMaterials';
import { CheckLottery } from './sections/CheckLottery';
import { FAQ } from './sections/FAQ';
import { OurApp } from './sections/OurApp';
import { PopularTickets } from './sections/PopularTickets';
import { WinnersHistory } from './sections/WinnersHistory';
import { WhereToBuy } from './sections/WhereToBuy';
import { Winner } from '@/data/mock-content';
import NewHero from './sections/NewHero';

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

async function getNewsData(): Promise<NewsItem[]> {
  try {
    const { data } =
      await api.get<ApiResponse<PaginatedResult<NewsItem>>>('/news/');
    return data.data.results || [];
  } catch (error) {
    console.error('News Error:', error);
    return [];
  }
}

async function getFAQData(): Promise<QAItem[]> {
  try {
    const { data } = await api.get<ApiResponse<QAItem[]>>('/qa/');
    return data.data || [];
  } catch (error) {
    console.error('FAQ Error:', error);
    return [];
  }
}

async function getLotteriesData(): Promise<LotteryItem[]> {
  try {
    const { data } = await api.get<ApiResponse<LotteryItem[]>>('/lotteries/');
    return data.data || [];
  } catch (error) {
    console.error('Lotteries Error:', error);
    return [];
  }
}

async function getBranchesData(): Promise<BranchItem[]> {
  try {
    const { data } = await api.get<ApiResponse<BranchItem[]>>('/branches/');
    return data.data || [];
  } catch (error) {
    console.error('Branches Error:', error);
    return [];
  }
}

async function getWinnersData(): Promise<Winner[]> {
  try {
    const { data } = await api.get<ApiResponse<PaginatedResult<Winner>>>('/winners/');
    return data.data.results || [];
  } catch (error) {
    console.error('Winners Error:', error);
    return [];
  }
}

export default async function Home() {
  const [slides, news, faq, lotteries, branches, winners] = await Promise.all([
    getSliderData(),
    getNewsData(),
    getFAQData(),
    getLotteriesData(),
    getBranchesData(),
    getWinnersData(),
  ]);

  return (
    <div>
      {/* <Hero slides={slides} /> */}
      <NewHero />

      <div className='px-4 mt-10 xl:max-w-[80%] mx-auto'>
        <PopularTickets lotteries={lotteries} />
        <CheckLottery />
        <WinnersHistory winners={winners} />

        <BestMaterials articles={news} />
        <WhereToBuy branches={branches} />

        <FAQ questions={faq} />

        <OurApp />
      </div>

      <div className='h-8' />
    </div>
  );
}
