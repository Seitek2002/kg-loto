import { getHeroSlides } from "@/entities/slider/api/sliderApi";

import { HeroSliderClient } from "./HeroSliderClient";

export const HeroSlider = async () => {
  const slides = await getHeroSlides();
  if (!slides || slides.length === 0) return null;

  console.log(slides);

  return <HeroSliderClient slides={slides} />;
};
