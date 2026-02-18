import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { Header } from '@/components/ui/Header';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { LotteriesSlider } from '@/components/features/lottery/LotteriesSlider';
import { api } from '@/lib/api';
import {
  ApiResponse,
  LotteryItem,
  NewsItem,
  PaginatedResult,
} from '@/types/api';

// Запрос за лотереями (по твоей функции)
async function getLotteriesData(): Promise<LotteryItem[]> {
  try {
    const { data } = await api.get<ApiResponse<LotteryItem[]>>('/lotteries/');
    return data.data || [];
  } catch (error) {
    console.error('Lotteries Error:', error);
    return [];
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

export default async function AboutPage() {
  //   const lotteries = await getLotteriesData();
  const [lotteries, news] = await Promise.all([
    getLotteriesData(),
    getNewsData(),
  ]);

  return (
    <div className='min-h-screen bg-[#F9F9F9] font-rubik'>
      <Header theme='dark' />

      <main className='max-w-[1200px] mx-auto px-4 lg:px-8 pt-32 pb-20 overflow-hidden'>
        {/* ХЛЕБНЫЕ КРОШКИ */}
        <nav className='flex items-center gap-2 text-[10px] sm:text-xs font-bold text-gray-400 mb-6 uppercase overflow-x-auto whitespace-nowrap'>
          <Link href='/' className='hover:text-[#2D2D2D] transition-colors'>
            Главная
          </Link>
          <ChevronRight size={14} className='shrink-0' />
          <span className='text-[#2D2D2D]'>О компании</span>
        </nav>

        {/* ГЛАВНОЕ ФОТО (Баннер) */}
        <div className='w-full aspect-[21/9] min-h-[200px] relative rounded-[32px] overflow-hidden mb-12 bg-blue-100'>
          {/* Замени 'about-banner.jpg' на реальную картинку из макета, когда она у тебя появится */}
          <Image
            src='/banners/1.jpg'
            alt='О компании'
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
                О КОМПАНИИ
              </h2>
              <p className='mb-4'>
                Россиянин выиграл 5 миллионов рублей в лотерее «Второе Шанс:
                Рождество» с одной из «Национальной Лотереи». Обладатель
                главного приза, купивший билет «Миллионер», счастливчиком не
                обзавелся миллионами.
              </p>
              <p className='mb-4'>
                Помимо главного денежного приза, в розыгрыше были разыграны 100
                призов по 50 тысяч рублей, а также главным подписчиком 40
                ближайших тиражей лотереи «Миллионер».
              </p>
              <p>
                Итоги акции были подведены в прямом эфире 9 января на
                официальном сайте «Национальной Лотереи» и в ее сообществе в
                социальной сети ВКонтакте. Акция приняла всероссийский масштаб:
                для всего-то и обошла зарегистрировал совпадения 2 хит лотереи
                «Мечталлион», дополнительный шанс на удачу.
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-black font-benzin uppercase text-[#2D2D2D] mb-4'>
                НАША МИССИЯ
              </h2>
              <p className='mb-4'>
                Россиянин стал обладателем суперприза лотереи «Мечталлион».
                Лотерейный билет за 100 «Национальной Лотереи». Обладатель
                главного приза, купивший билет «Миллионер», счастливчиком не
                обзавелся миллионами.
              </p>
              <p>
                Помимо главного денежного приза, в розыгрыше были разыграны 100
                призов по 50 тысяч рублей, а также главным подписчиком 40
                ближайших тиражей лотереи «Миллионер».
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-black font-benzin uppercase text-[#2D2D2D] mb-4'>
                НАШИ ЦЕННОСТИ
              </h2>
              <p className='mb-4'>
                Россиянин выиграл 5 миллионов рублей в лотерее «Второе Шанс:
                Рождество» с одной из «Национальной Лотереи». Обладатель
                главного приза, купивший билет «Миллионер», счастливчиком не
                обзавелся миллионами.
              </p>
              <p>
                Помимо главного денежного приза, в розыгрыше были разыграны 100
                призов по 50 тысяч рублей, а также главным подписчиком 40
                ближайших тиражей лотереи «Миллионер».
              </p>
            </section>
          </div>

          {/* ПРАВАЯ КОЛОНКА: НОВОСТИ (Сайдбар 35%) */}
          <div className='w-full lg:w-[35%] flex flex-col sticky top-28'>
            <h2 className='text-2xl font-black font-benzin uppercase text-[#2D2D2D] mb-6'>
              НОВОСТИ
            </h2>

            <div className='flex flex-col gap-4'>
              {news.map((item) => (
                <div key={item.id}>
                  <ArticleCard
                    id={item.id}
                    title={item.title}
                    description={item.content}
                    imageSrc={item.image}
                    buttonText='ПОДРОБНЕЕ'
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
