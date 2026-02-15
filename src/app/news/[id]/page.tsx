'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

import { ArticleCard } from '@/components/ui/ArticleCard'; // Карточка для сайдбара
import { Header } from '@/components/ui/Header';

const MOCK_NEWS = {
  title: '«НАЦИОНАЛЬНАЯ ЛОТЕРЕЯ» РАЗЫГРАЛА 5 МИЛЛИОНОВ РУБЛЕЙ',
  date: '13 ЯНВАРЯ, 2025 г.',
  image: '/banner-news.jpg', // Замени на свой плейсхолдер
  content: `
    <p>Россиянин выиграл 5 миллионов рублей в акции «Второй шанс. Рождественская сказка» от «Национальной Лотереи». Обладатель главного приза, купивший билет «Мечталлион» онлайн, пока не обратился за выигрышем.</p>
    <p>Помимо главного денежного приза, в рамках акции были разыграны 100 призов по 50 тысяч рублей, а также годовые подписки на 40 ближайших тиражей лотереи «Мечталлион».</p>
    <p>Итоги акции были подведены в прямом эфире 10 января на официальном сайте. Акция приняла всероссийский масштаб, дав всем, кто приобрёл и зарегистрировал новогодний билет, дополнительный шанс на удачу.</p>
    <p>«Акция "Второй шанс: Рождественская сказка" — это подарок для всех участников новогоднего тиража нашей флагманской лотереи...» — отметили в пресс-службе оператора лотерей.</p>
  `,
};

const MOCK_OTHER_ARTICLES = [
  {
    id: 1,
    title: '80+ человек с большим опытом в Foodtech и Horeca',
    theme: 'dark' as const,
  },
  {
    id: 2,
    title: 'Показываем где приобрести билет',
    theme: 'light' as const,
  },
];

export default function NewsDetailsPage() {
  return (
    <div className='min-h-screen bg-[#F5F5F5] font-rubik'>
      <Header theme='dark' />

      <main className='max-w-[1200px] mx-auto px-4 lg:px-8 pt-28 pb-20'>
        {/* 1. ХЛЕБНЫЕ КРОШКИ */}
        <nav className='flex items-center gap-2 text-[10px] sm:text-xs font-bold font-benzin text-gray-400 mb-6 uppercase overflow-x-auto whitespace-nowrap'>
          <Link href='/' className='hover:text-[#2D2D2D] transition-colors'>
            Главная
          </Link>
          <ChevronRight size={14} className='shrink-0' />
          <Link href='/news' className='hover:text-[#2D2D2D] transition-colors'>
            Новости
          </Link>
          <ChevronRight size={14} className='shrink-0' />
          <span className='text-[#2D2D2D] truncate max-w-[200px] sm:max-w-none'>
            Национальная лотерея...
          </span>
        </nav>

        {/* 2. ЗАГОЛОВОК И ДАТА */}
        <h1 className='text-2xl sm:text-3xl lg:text-[40px] font-black font-benzin text-[#2D2D2D] uppercase leading-tight mb-4 max-w-4xl'>
          {MOCK_NEWS.title}
        </h1>
        <div className='text-xs font-bold font-rubik text-gray-500 uppercase mb-8 lg:mb-12'>
          {MOCK_NEWS.date}
        </div>

        {/* 3. ОСНОВНАЯ СЕТКА (ЛЕВАЯ ЧАСТЬ - КОНТЕНТ, ПРАВАЯ - САЙДБАР) */}
        <div className='flex flex-col lg:flex-row gap-8 lg:gap-12 items-start'>
          {/* --- ЛЕВАЯ КОЛОНКА (70%) --- */}
          <div className='w-full lg:w-[65%] flex flex-col shrink-0'>
            {/* Главное изображение новости */}
            <div className='w-full aspect-video bg-gray-200 relative rounded-3xl overflow-hidden mb-8'>
              {/* Если картинки нет, будет просто серый квадрат. Замени src на реальный */}
              {MOCK_NEWS.image && (
                <Image
                  src={MOCK_NEWS.image}
                  alt='News Cover'
                  fill
                  className='object-cover'
                />
              )}
            </div>

            {/* 🔥 HTML КОНТЕНТ */}
            <div
              className='html-content text-sm sm:text-base text-[#4B4B4B] leading-relaxed'
              dangerouslySetInnerHTML={{ __html: MOCK_NEWS.content }}
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

            {/* Карточки других новостей */}
            <div className='flex flex-col gap-4'>
              {MOCK_OTHER_ARTICLES.map((article) => (
                <ArticleCard
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  buttonText='ПОДРОБНЕЕ'
                  theme={article.theme}
                  href={`/news/${article.id}`}
                />
              ))}
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
