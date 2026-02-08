import { BestMaterials } from './sections/BestMaterials';
import { CheckLottery } from './sections/CheckLottery';
import { FAQ } from './sections/FAQ';
import { Hero, HeroSlideData } from './sections/Hero';
import { OurApp } from './sections/OurApp';
import { PopularTickets } from './sections/PopularTickets';
import { WinnersHistory } from './sections/WinnersHistory';

import { api } from '@/lib/api';
import { SliderItem, ApiResponse } from '@/types/api';

// 🔥 Настройка кэширования (ISR)
// Страница будет пересобираться раз в 10 минут (600 сек).
// Это замена staleTime из React Query.
export const revalidate = 600;

// Запасные слайды
const FALLBACK_SLIDES: HeroSlideData[] = [
  {
    id: 'fallback-1',
    bg: '/banners/1.jpg',
    title1: 'СТАНЬ МИЛЛИОНЕРОМ',
    title2: 'Призовой фонд 10 000 000 сом',
    prize: '1 000 000 СОМ',
    price: '200 сом',
    buttonLabel: 'ИГРАТЬ • 200 СОМ',
  },
];

// Функция получения данных (выполняется на сервере)
async function getSliderData(): Promise<HeroSlideData[]> {
  try {
    // Делаем запрос
    const { data } = await api.get<ApiResponse<SliderItem[]>>('/slider/');

    // Если данных нет или массив пустой - возвращаем fallback
    if (!data.data || data.data.length === 0) {
      return FALLBACK_SLIDES;
    }

    // Маппим данные сервера в формат Hero
    return data.data.map((item) => ({
      id: item.id,
      bg: item.image,
      title1: item.title,
      title2: item.subtitle,
      prize: item.prizeText,
      price: item.buttonPrice,
      buttonLabel: item.buttonLabel, // Используем готовый лейбл
    }));
  } catch (error) {
    console.error('Ошибка загрузки слайдера:', error);
    return FALLBACK_SLIDES; // При ошибке показываем заглушку
  }
}

// 🔥 Компонент теперь async
export default async function Home() {
  // Ждем данные прямо тут (на сервере)
  const slides = await getSliderData();

  return (
    <div>
      {/* Hero - это клиентский компонент ('use client'), 
         но мы передаем ему данные, полученные на сервере.
         onButtonClick убрали, так как роутер на сервере не работает.
         Логику клика лучше перенести внутрь Hero или передать ID строкой.
      */}
      <Hero
        slides={slides}
        // buttonText не нужен, так как есть buttonLabel
      />

      <div className='px-4 mt-10 xl:max-w-[80%] mx-auto'>
        <PopularTickets />
        <CheckLottery />
        <WinnersHistory />
        <BestMaterials />
        <FAQ />
        <OurApp />
      </div>

      <div className='h-8' />
    </div>
  );
}
