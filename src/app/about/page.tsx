import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { LotteriesSlider } from '@/components/features/lottery/LotteriesSlider';
import api from '@/services/api/apiClient';
import {
  ApiResponse,
  LotteryItem,
  NewsItem,
  PaginatedResult,
} from '@/types/api';
import { getLocaleHeader } from '@/lib/locale';
import { PageHeader } from '@/components/ui/PageHeader';

import { getTranslations } from 'next-intl/server';

import './style.css';

// 🔥 1. ДОБАВЛЯЕМ ТИП ДЛЯ НОВЫХ ДАННЫХ
export interface AboutCompanyData {
  id: number;
  title: string;
  shortText: string;
  content: string;
  image: string | null;
  createdAt: string;
}

// 🔥 2. ДОБАВЛЯЕМ ФУНКЦИЮ ЗАПРОСА
async function getAboutCompanyData(): Promise<AboutCompanyData | null> {
  try {
    const { data } = await api.get<ApiResponse<AboutCompanyData>>(
      '/about-company/',
      {
        headers: await getLocaleHeader(),
      },
    );
    return data.data;
  } catch (error) {
    console.error('About Company Error:', error);
    return null;
  }
}

// 🔥 3. ОБНОВЛЯЕМ SEO (title и shortText)
export async function generateMetadata() {
  const tSeo = await getTranslations('seo');
  const siteName =
    tSeo('site_name') === 'site_name' ? 'KGLOTO' : tSeo('site_name');

  const aboutData = await getAboutCompanyData();

  // Если с бэка пришел title, используем его. Иначе дефолтный.
  const pageTitle = aboutData?.title || 'О компании';

  return {
    title: `${pageTitle} | ${siteName}`,
    description:
      aboutData?.shortText || 'Первый маркетплейс лотерейных билетов',
  };
}

async function getLotteriesData(): Promise<LotteryItem[]> {
  try {
    const { data } = await api.get<ApiResponse<LotteryItem[]>>('/lotteries/', {
      headers: await getLocaleHeader(),
    });
    return data.data || [];
  } catch (error) {
    console.error('Lotteries Error:', error);
    return [];
  }
}

async function getNewsData(): Promise<NewsItem[]> {
  try {
    const { data } = await api.get<ApiResponse<PaginatedResult<NewsItem>>>(
      '/news/',
      {
        headers: await getLocaleHeader(),
      },
    );
    return data.data.results || [];
  } catch (error) {
    console.error('News Error:', error);
    return [];
  }
}

export default async function AboutPage() {
  // 🔥 4. ЗАПРАШИВАЕМ ДАННЫЕ О КОМПАНИИ ВМЕСТЕ С ОСТАЛЬНЫМИ
  const [lotteries, news, aboutData] = await Promise.all([
    getLotteriesData(),
    getNewsData(),
    getAboutCompanyData(),
  ]);

  const t = await getTranslations('about');

  // Если картинки с бэка нет, оставляем фоллбэк
  const bannerImage = aboutData?.image || '/banners/1.jpg';
  // Если title с бэка нет, берем из словаря
  const displayTitle = aboutData?.title || t('breadcrumb_about');
  const htmlContent = aboutData?.content || '';

  return (
    <div className='min-h-screen bg-[#F9F9F9] font-rubik'>
      <div className='px-4'>
        <PageHeader title={displayTitle} />
      </div>

      <main className='max-w-[1200px] mx-auto px-4 lg:px-8 pt-8 lg:pt-32 pb-20 overflow-hidden'>
        {/* ХЛЕБНЫЕ КРОШКИ */}
        <nav className='hidden lg:flex items-center gap-2 text-[10px] sm:text-xs font-bold text-gray-400 mb-6 uppercase overflow-x-auto whitespace-nowrap'>
          <Link href='/' className='hover:text-[#2D2D2D] transition-colors'>
            {t('breadcrumb_home')}
          </Link>
          <ChevronRight size={14} className='shrink-0' />
          <span className='text-[#2D2D2D]'>{displayTitle}</span>
        </nav>

        {/* ГЛАВНОЕ ФОТО (Баннер) */}
        <div className='w-full aspect-[21/9] min-h-[200px] relative rounded-[32px] overflow-hidden mb-12 bg-blue-100'>
          <Image
            src={bannerImage}
            alt={displayTitle}
            fill
            className='object-cover'
            priority
          />
        </div>

        {/* ОСНОВНОЙ КОНТЕНТ (2 КОЛОНКИ) */}
        <div className='flex flex-col lg:flex-row gap-12 items-start'>
          {/* 🔥 5. ЛЕВАЯ КОЛОНКА: ДИНАМИЧЕСКИЙ HTML */}
          <div className='w-full lg:w-[65%] flex flex-col gap-10 text-sm sm:text-base text-[#4B4B4B] leading-relaxed'>
            <div
              className='html-content'
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>

          {/* ПРАВАЯ КОЛОНКА: НОВОСТИ (Сайдбар 35%) - НЕ ТРОГАЕМ */}
          <div className='w-full lg:w-[35%] flex flex-col sticky top-28'>
            <h2 className='text-2xl font-black font-benzin uppercase text-[#2D2D2D] mb-6'>
              {t('news_title')}
            </h2>

            <div className='flex flex-col gap-4'>
              {news.map((item) => (
                <div key={item.id}>
                  <ArticleCard
                    id={item.id}
                    title={item.title}
                    description={item.content}
                    imageSrc={item.image}
                    buttonText={t('read_more')}
                    theme={item.theme}
                    href={`/news/${item.slug}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* НИЖНИЙ БЛОК: СЛАЙДЕР ЛОТЕРЕЙ */}
        <LotteriesSlider lotteries={lotteries} />
      </main>
    </div>
  );
}
