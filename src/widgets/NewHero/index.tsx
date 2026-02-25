import { api } from '@/lib/api';
import { ApiResponse } from '@/types/api';
import { NewHeroClient, SliderItem } from './client';

// Функция для получения данных слайдера
async function getHeroSlides(): Promise<SliderItem[]> {
  try {
    const { data } = await api.get<ApiResponse<SliderItem[]>>('/slider/');
    return data.data || [];
  } catch (error) {
    console.error('Slider Fetch Error:', error);
    return [];
  }
}

// 🔥 Серверный компонент (может быть async)
const NewHero = async () => {
  // Запрашиваем данные на сервере
  const slides = await getHeroSlides();

  // Если вдруг данных нет, можно вернуть fallback или null
  if (!slides || slides.length === 0) {
    return null; 
  }

  // Передаем готовые данные в клиентский UI
  return <NewHeroClient slides={slides} />;
};

export default NewHero;