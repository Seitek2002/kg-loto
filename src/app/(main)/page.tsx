import { api } from '@/lib/api';
import {
  ApiResponse,
  NewsItem,
  QAItem,
  LotteryItem,
  BranchItem,
  PaginatedResult,
} from '@/types/api';
import { BestMaterials } from './sections/BestMaterials';
import { CheckLottery } from './sections/CheckLottery';
import { FAQ } from './sections/FAQ';
import { OurApp } from './sections/OurApp';
import { PopularTickets } from './sections/PopularTickets';
import { WinnersHistory } from './sections/WinnersHistory';
import { WhereToBuy } from './sections/WhereToBuy';
import { Winner } from '@/data/mock-content';
import NewHero from './sections/NewHero';
import UnderHero from './sections/UnderHero';
import { Preloader } from '@/components/ui/Preloader';

export const revalidate = 600;

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
    const { data } =
      await api.get<ApiResponse<PaginatedResult<Winner>>>('/winners/');
    return data.data.results || [];
  } catch (error) {
    console.error('Winners Error:', error);
    return [];
  }
}

export default async function Home() {
  const [news, faq, lotteries, branches, winners] = await Promise.all([
    getNewsData(),
    getFAQData(),
    getLotteriesData(),
    getBranchesData(),
    getWinnersData(),
  ]);

  return (
    <>
      <Preloader />

      {/* <Hero slides={slides} /> */}
      <NewHero />
      <UnderHero />

      <div className='mt-10 max-w-300 mx-auto px-4'>
        <PopularTickets lotteries={lotteries} />
        <CheckLottery />
        <WinnersHistory winners={winners} />

        <BestMaterials articles={news} />
        <WhereToBuy branches={branches} />

        <FAQ questions={faq} />

        <OurApp />
      </div>

      <div className='h-8' />
    </>
  );
}
