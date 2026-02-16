import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronRight, ImageIcon } from 'lucide-react';

import { ArticleCard } from '@/components/ui/ArticleCard';
import { api } from '@/lib/api';
import { ApiResponse, NewsItem, PaginatedResult } from '@/types/api';
import { Header } from '@/components/ui/Header';

interface NewsDetailsPageProps {
  params: Promise<{ id: string }>;
}

async function getNewsDetail(id: string): Promise<NewsItem | null> {
  try {
    const { data } = await api.get<ApiResponse<NewsItem>>(`/news/${id}/`);
    return data.data;
  } catch (error) {
    console.error(`Error fetching news ${id}:`, error);
    return null;
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

  const otherArticles = allNews
    .filter((item) => String(item.id) !== String(id))
    .slice(0, 2);

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
      <Header theme='dark' />

      <main className='max-w-300 mx-auto px-4 lg:px-8 pt-56 pb-20'>
        {/* 1. ХЛЕБНЫЕ КРОШКИ */}
        <nav className='flex items-center gap-2 text-[10px] sm:text-xs font-bold text-gray-400 mb-6 uppercase overflow-x-auto whitespace-nowrap'>
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

        {/* 2. ЗАГОЛОВОК И ДАТА */}
        <h1 className='text-2xl sm:text-3xl lg:text-[40px] font-black font-benzin text-[#2D2D2D] uppercase leading-tight mb-4 max-w-4xl'>
          {article.title}
        </h1>
        <div className='text-xs font-bold font-rubik text-gray-500 uppercase mb-8 lg:mb-12'>
          {formattedDate}
        </div>

        <div className='w-full aspect-video relative rounded-3xl overflow-hidden mb-8 flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-200 border border-gray-100'>
          {article.image ? (
            <Image
              src={article.image}
              alt={article.title}
              fill
              className='object-cover'
              priority
            />
          ) : (
            /* 🔥 СТИЛЬНАЯ ЗАГЛУШКА (Если картинки нет) */
            <div className='flex flex-col items-center justify-center text-gray-300'>
              <ImageIcon size={80} strokeWidth={1} />
              <span className='mt-4 font-benzin font-black text-2xl tracking-widest opacity-40 uppercase'>
                Kgloto
              </span>
            </div>
          )}
        </div>

        {/* 3. ОСНОВНАЯ СЕТКА (ЛЕВАЯ ЧАСТЬ - КОНТЕНТ, ПРАВАЯ - САЙДБАР) */}
        <div className='flex flex-col lg:flex-row gap-8 lg:gap-12 items-start'>
          {/* --- ЛЕВАЯ КОЛОНКА (65%) --- */}
          <div className='w-full lg:w-[65%] flex flex-col shrink-0'>
            {/* 🔥 HTML КОНТЕНТ */}
            <div
              className='html-content text-sm sm:text-base text-[#4B4B4B] leading-relaxed'
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>

          {/* --- ПРАВАЯ КОЛОНКА / САЙДБАР (35%) --- */}
          <div className='w-full lg:w-[35%] flex flex-col sticky top-28'>
            <h3 className='text-xl font-black font-benzin uppercase text-[#2D2D2D] mb-2'>
              Другие материалы
            </h3>
            <p className='text-xs font-medium font-rubik text-gray-500 mb-6'>
              Следите за последними событиями, улучшениями и нововведениями — мы
              регулярно рассказываем о том, что важно знать.
            </p>

            {/* Карточки других новостей из API */}
            <div className='flex flex-col gap-4'>
              {otherArticles.length > 0 ? (
                otherArticles.map((item) => (
                  <div key={item.id} className='h-75'>
                    <ArticleCard
                      id={item.id}
                      title={item.title}
                      imageSrc={item.image}
                      buttonText='ПОДРОБНЕЕ'
                      theme={
                        item.theme === 'dark' || item.theme === 'light'
                          ? item.theme
                          : 'dark'
                      }
                      href={`/news/${item.slug || item.id}`} // Используем slug для ссылки, если он есть
                    />
                  </div>
                ))
              ) : (
                <span className='text-xs text-gray-400'>
                  Нет других материалов
                </span>
              )}
            </div>

            <Link
              href='/news'
              className='mt-6 w-full py-4 bg-white border border-gray-200 rounded-full text-xs font-bold font-benzin uppercase text-[#2D2D2D] hover:bg-gray-50 transition-colors text-center'
            >
              Все материалы
            </Link>
          </div>
        </div>
      </main>

      {/* СТИЛИ ДЛЯ ВЛОЖЕННОГО HTML */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .html-content p {
          margin-bottom: 24px;
        }
        .html-content strong, .html-content b {
          color: #2D2D2D;
          font-weight: 700;
        }
        .html-content ul {
          margin-bottom: 24px;
          padding-left: 20px;
        }
        .html-content li {
          margin-bottom: 12px;
          position: relative;
        }
        .html-content li::before {
          content: '•';
          color: #FFD600;
          font-weight: bold;
          display: inline-block;
          width: 1em;
          margin-left: -1em;
        }
        .html-content a {
          color: #FFD600;
          text-decoration: underline;
        }
      `,
        }}
      />
    </div>
  );
}
