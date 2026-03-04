import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronRight, ImageIcon } from 'lucide-react';

import { api } from '@/lib/api';
import { getLocaleHeader } from '@/lib/locale';
import { ApiResponse, NewsItem, PaginatedResult } from '@/types/api';
import { Header } from '@/components/ui/Header';
import { OtherMaterialsSlider } from '@/components/features/news/OtherMaterialsSlider';
import { PageHeader } from '@/components/ui/PageHeader';

interface NewsDetailsPageProps {
  params: Promise<{ id: string }>;
}

async function getNewsDetail(id: string): Promise<NewsItem | null> {
  try {
    const { data } = await api.get<ApiResponse<NewsItem>>(`/news/${id}/`, {
      headers: await getLocaleHeader(),
    });
    return data.data;
  } catch (error) {
    console.error(`Error fetching news ${id}:`, error);
    return null;
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

export default async function NewsDetailsPage({
  params,
}: NewsDetailsPageProps) {
  const { id } = await params;

  const [article, allNews] = await Promise.all([
    getNewsDetail(id),
    getNewsData(),
  ]);

  if (!article) {
    return notFound();
  }

  // Фильтруем текущую новость, чтобы не показывать ее в "Других материалах"
  const otherArticles = allNews.filter(
    (item) => String(item.id) !== String(id),
  );

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  const htmlContent = article.content || article.shortText || '';

  return (
    <div className='min-h-screen bg-[#F5F5F5] font-rubik'>
      <div className='px-4 pt-4'>
        <PageHeader title='' />
      </div>

      {/* overflow-hidden предотвращает появление горизонтального скролла от слайдера */}
      <main className='max-w-[1200px] mx-auto px-4 lg:px-8 pt-10 lg:pt-56 pb-20 overflow-hidden'>
        {/* ХЛЕБНЫЕ КРОШКИ */}
        <nav className='hidden lg:flex items-center gap-2 text-[10px] sm:text-xs font-bold text-gray-400 mb-6 uppercase overflow-x-auto whitespace-nowrap'>
          <Link href='/' className='hover:text-[#2D2D2D] transition-colors'>
            Главная
          </Link>
          <ChevronRight size={14} className='shrink-0' />
          <Link href='/news' className='hover:text-[#2D2D2D] transition-colors'>
            Новости
          </Link>
          <ChevronRight size={14} className='shrink-0' />
          <span className='text-[#2D2D2D] truncate max-w-50 sm:max-w-none'>
            {article.title}
          </span>
        </nav>

        {/* ЗАГОЛОВОК И ДАТА */}
        <h1 className='text-2xl sm:text-3xl lg:text-[40px] font-black font-benzin text-[#2D2D2D] uppercase leading-tight mb-4 max-w-4xl'>
          {article.title}
        </h1>
        <div className='text-xs font-bold font-rubik text-gray-500 uppercase mb-8 lg:mb-12'>
          {formattedDate}
        </div>

        {/* ГЛАВНОЕ ФОТО */}
        <div className='w-full aspect-video relative rounded-3xl overflow-hidden mb-8 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 border border-gray-100'>
          {article.image ? (
            <Image
              src={article.image}
              alt={article.title}
              fill
              className='object-cover'
              priority
            />
          ) : (
            <div className='flex flex-col items-center justify-center text-gray-300'>
              <ImageIcon size={80} strokeWidth={1} />
              <span className='mt-4 font-benzin font-black text-2xl tracking-widest opacity-40 uppercase'>
                Kgloto
              </span>
            </div>
          )}
        </div>

        {/* 🔥 КОНТЕНТ НОВОСТИ (ограничили ширину для читабельности) */}
        <div className='w-full max-w-4xl'>
          <div
            className='html-content text-sm sm:text-base text-[#4B4B4B] leading-relaxed'
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>

        {/* 🔥 2. НАШ НОВЫЙ БЛОК СО СЛАЙДЕРОМ */}
        <OtherMaterialsSlider articles={otherArticles} />
      </main>

      {/* СТИЛИ ДЛЯ ВЛОЖЕННОГО HTML */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .html-content p { margin-bottom: 24px; }
        .html-content strong, .html-content b { color: #2D2D2D; font-weight: 700; }
        .html-content ul { margin-bottom: 24px; padding-left: 20px; }
        .html-content li { margin-bottom: 12px; position: relative; }
        .html-content li::before {
          content: '•'; color: #FFD600; font-weight: bold;
          display: inline-block; width: 1em; margin-left: -1em;
        }
        .html-content a { color: #FFD600; text-decoration: underline; }
      `,
        }}
      />
    </div>
  );
}
