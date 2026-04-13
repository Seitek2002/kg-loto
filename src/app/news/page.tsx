import api from '@/services/api/apiClient';
import { getLocaleHeader } from '@/lib/locale';
import { ApiResponse, NewsItem, PaginatedResult } from '@/types/api';
import { NewsListContent } from './NewsListContent';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const tSeo = await getTranslations('seo');
  const siteName =
    tSeo('site_name') === 'site_name' ? 'KGLOTO' : tSeo('site_name');

  return {
    // Если у тебя есть переводы для новостей, поменяй 'Новости' на t('title')
    title: `Новости | ${siteName}`,
  };
}

async function getAllNews(): Promise<NewsItem[]> {
  try {
    const { data } = await api.get<ApiResponse<PaginatedResult<NewsItem>>>(
      '/news/',
      {
        headers: await getLocaleHeader(),
      },
    );

    return data.data.results || [];
  } catch (error) {
    console.error('Error fetching news page:', error);
    return [];
  }
}

export default async function NewsPage() {
  const news = await getAllNews();

  return <NewsListContent initialNews={news} />;
}
