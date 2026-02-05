'use client';

import { Title } from '@/components/ui/Title';
import { Description } from '@/components/ui/Description';
import { ArticleCard } from '@/components/ui/ArticleCard';
// import { MATERIALS_MOCK } from '@/data/mock-materials';
// import { PageHeader } from '@/components/ui/PageHeader';
import { MATERIALS_MOCK } from '@/data/mock-content';
import { Header } from '@/components/ui/Header';
import { PageHeader } from '@/components/ui/PageHeader';

export default function NewsPage() {
  return (
    <div className='min-h-screen bg-[#F9F9F9] pt-6 pb-20'>
      <Header theme='dark' />
      <PageHeader title='Новости' />
      <div className='max-w-350 mx-auto px-4 lg:mt-20'>
        {/* Хедер страницы */}
        <div className='mb-10 max-w-3xl'>
          {/* Если нужна стрелка назад, можно раскомментировать PageHeader */}
          {/* <div className="mb-6"><PageHeader title="" /></div> */}

          <Title>ВСЕ МАТЕРИАЛЫ</Title>
          <Description>
            Следите за последними событиями, улучшениями и нововведениями — мы
            регулярно рассказываем о том, что важно знать.
          </Description>
        </div>

        {/* СЕТКА КАРТОЧЕК */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr'>
          {MATERIALS_MOCK.map((article) => (
            <div key={article.id} className='h-full min-h-100'>
              {' '}
              {/* Фиксируем мин. высоту, чтобы было ровно */}
              <ArticleCard {...article} />
            </div>
          ))}
        </div>

        {/* КНОПКА ЗАГРУЗИТЬ ЕЩЕ */}
        <div className='mt-12 flex justify-center'>
          <button className='bg-white text-[#2D2D2D] font-bold font-benzin uppercase text-xs py-4 px-12 rounded-full shadow-md hover:bg-gray-50 active:scale-95 transition-all'>
            Загрузить еще
          </button>
        </div>
      </div>
    </div>
  );
}
