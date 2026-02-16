import { api } from '@/lib/api';
import { ApiResponse, NewsItem, PaginatedResult } from '@/types/api';
import { NewsListContent } from './NewsListContent';

async function getAllNews(): Promise<NewsItem[]> {
  try {
    const { data } =
      await api.get<ApiResponse<PaginatedResult<NewsItem>>>('/news/');

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
