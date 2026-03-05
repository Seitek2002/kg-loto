import { ApiResponse, NewsItem, PaginatedResult } from '@/types/api';
import { api } from '@/lib/api';
import { getLocaleHeader } from '@/lib/locale';
import { BestMaterialsClient } from './client';

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

export const BestMaterials = async () => {
  const articles = await getNewsData();

  console.log(articles);

  return (
    <BestMaterialsClient articles={articles} />
  );
};
