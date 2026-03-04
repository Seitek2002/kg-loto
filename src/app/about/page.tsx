import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { LotteriesSlider } from '@/components/features/lottery/LotteriesSlider';
import { api } from '@/lib/api';
import {
  ApiResponse,
  LotteryItem,
  NewsItem,
  PaginatedResult,
} from '@/types/api';
import { getLocaleHeader } from '@/lib/locale';
import { PageHeader } from '@/components/ui/PageHeader';

// 🔥 Импортируем серверную функцию переводов
import { getTranslations } from 'next-intl/server';

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
    const { data } =
      await api.get<ApiResponse<PaginatedResult<NewsItem>>>('/news/', {
        headers: await getLocaleHeader(),
      });
    return data.data.results || [];
  } catch (error) {
    console.error('News Error:', error);
    return [];
  }
}

export default async function AboutPage() {
  const [lotteries, news] = await Promise.all([
    getLotteriesData(),
    getNewsData(),
  ]);

  // 🔥 Загружаем переводы для страницы
  const t = await getTranslations('about');

  return (
    <div className='min-h-screen bg-[#F9F9F9] font-rubik'>
      <div className='px-4'>
        {/* 🔥 Передаем переведенный заголовок */}
        <PageHeader title={t('breadcrumb_about')} />
      </div>

      <main className='max-w-[1200px] mx-auto px-4 lg:px-8 pt-8 lg:pt-32 pb-20 overflow-hidden'>
        {/* ХЛЕБНЫЕ КРОШКИ */}
        <nav className='hidden lg:flex items-center gap-2 text-[10px] sm:text-xs font-bold text-gray-400 mb-6 uppercase overflow-x-auto whitespace-nowrap'>
          <Link href='/' className='hover:text-[#2D2D2D] transition-colors'>
            {t('breadcrumb_home')}
          </Link>
          <ChevronRight size={14} className='shrink-0' />
          <span className='text-[#2D2D2D]'>{t('breadcrumb_about')}</span>
        </nav>

        {/* ГЛАВНОЕ ФОТО (Баннер) */}
        <div className='w-full aspect-[21/9] min-h-[200px] relative rounded-[32px] overflow-hidden mb-12 bg-blue-100'>
          <Image
            src='/banners/1.jpg'
            alt={t('breadcrumb_about')}
            fill
            className='object-cover'
            priority
          />
        </div>

        {/* ОСНОВНОЙ КОНТЕНТ (2 КОЛОНКИ) */}
        <div className='flex flex-col lg:flex-row gap-12 items-start'>
          {/* ЛЕВАЯ КОЛОНКА: СТАТИЧНЫЙ ТЕКСТ (65%) */}
          <div className='w-full lg:w-[65%] flex flex-col gap-10 text-sm sm:text-base text-[#4B4B4B] leading-relaxed'>
            <section>
              <h2 className='text-2xl font-black font-benzin uppercase text-[#2D2D2D] mb-4'>
                {t('company_title')}
              </h2>
              <p className='mb-4'>{t('company_p1')}</p>
              <p className='mb-4'>{t('company_p2')}</p>
              <p>{t('company_p3')}</p>
            </section>

            <section>
              <h2 className='text-2xl font-black font-benzin uppercase text-[#2D2D2D] mb-4'>
                {t('mission_title')}
              </h2>
              <p className='mb-4'>{t('mission_p1')}</p>
              <p>{t('mission_p2')}</p>
            </section>

            <section>
              <h2 className='text-2xl font-black font-benzin uppercase text-[#2D2D2D] mb-4'>
                {t('values_title')}
              </h2>
              <p className='mb-4'>{t('values_p1')}</p>
              <p>{t('values_p2')}</p>
            </section>
          </div>

          {/* ПРАВАЯ КОЛОНКА: НОВОСТИ (Сайдбар 35%) */}
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
                    buttonText={t('read_more')} // 🔥 Передаем переведенный текст кнопки
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
