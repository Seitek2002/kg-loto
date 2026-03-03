import { api } from '@/lib/api';
import { ApiResponse, SliderItem } from '@/types/api';
import { NewestHeroClient } from './NewestHeroClient';

async function getHeroSlides(): Promise<SliderItem[]> {
  try {
    const { data } = await api.get<ApiResponse<SliderItem[]>>('/slider/');
    return data.data || [];
  } catch (error) {
    console.error('Slider Fetch Error:', error);
    return [];
  }
}

const NewHero = async () => {
  const slides = await getHeroSlides();

  if (!slides || slides.length === 0) {
    return null; 
  }

  return <NewestHeroClient slides={slides} />;
};

export default NewHero;