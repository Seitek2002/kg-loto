"use client";

import { useState } from "react";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { SliderItem } from "@/entities/slider/model/types";

import { HeroBackground } from "./HeroBackground";
import { HeroCard } from "./HeroCard";
import { HeroOrbitItem } from "./HeroOrbitItem";

interface NewHeroClientProps {
  slides?: SliderItem[];
}

const ORBIT_STEP_DEG = 45;
const FALLBACK_GRADIENTS = [
  "linear-gradient(135deg, #4a3b2c, #8b6b4a)",
  "linear-gradient(135deg, #8b58d6, #bca6db)",
  "linear-gradient(135deg, #d68b58, #dba68c)",
];

export const HeroSliderClient = ({ slides }: NewHeroClientProps) => {
  // Раньше при пустом списке подставлялись MOCK_SLIDES с рыбным текстом
  // («НАДО», «Тут мог быть "Подтекст"»). На главной странице это выглядело бы
  // как настоящий баннер, поэтому лучше не показывать слайдер вовсе.
  const activeSlides = slides ?? [];
  const [activeIndex, setActiveIndex] = useState(0);

  if (activeSlides.length === 0) return null;

  return (
    <div className="relative w-full pt-28 md:pt-32 pb-20 md:pb-24 font-rubik overflow-hidden min-h-125 md:min-h-162.5 flex items-center bg-[#0a235c]">
      {/* 1. Глобальный фон с кроссфейдом */}
      <HeroBackground slides={activeSlides} activeIndex={activeIndex} />

      {/* 2. Орбита (строго без глобуса) */}
      <div className="absolute bottom-[5%] md:bottom-[-25%] left-1/2 -translate-x-1/2 w-[70%] h-[70%] md:w-full md:h-full mx-auto z-0 pointer-events-none">
        <motion.div
          animate={{ rotate: activeIndex * -ORBIT_STEP_DEG }}
          transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
          className="w-full h-full relative"
        >
          {activeSlides.map((slide, i) => (
            <div
              key={`orbit-${slide.id}`}
              className="absolute top-1/2 left-1/2 flex flex-col items-center justify-center origin-center"
              style={{
                transform: `translate(-50%, -50%) rotate(${i * ORBIT_STEP_DEG}deg)`,
              }}
            >
              <HeroOrbitItem slide={slide} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* 3. Карточки лотерей (Свайпер) */}
      <section className="w-full max-w-360 mx-auto z-10 mt-16 md:mt-24">
        <Swiper
          modules={[Navigation]}
          centeredSlides={true}
          slidesPerView={"auto"}
          initialSlide={0}
          spaceBetween={16}
          speed={800}
          navigation={{ prevEl: ".hero-prev", nextEl: ".hero-next" }}
          allowTouchMove={true}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className="overflow-visible! px-4"
          breakpoints={{ 768: { spaceBetween: 40 } }}
        >
          {activeSlides.map((slide, index) => (
            <SwiperSlide
              key={slide.id}
              className="w-[85%]! sm:w-[70%]! md:w-[60%]! lg:w-[55%]! mx-auto"
            >
              {({ isActive }) => (
                <HeroCard
                  slide={slide}
                  isActive={isActive}
                  fallbackGradient={
                    FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length]
                  }
                />
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Кнопки переключения (скрыты на мобилках) */}
        <button className="hero-prev hidden md:flex items-center justify-center absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 text-white/70 hover:text-white hover:scale-110 transition-all cursor-pointer bg-white/10 p-3 md:p-4 rounded-full backdrop-blur-md border border-white/20">
          <ChevronLeft size={36} strokeWidth={2} />
        </button>
        <button className="hero-next hidden md:flex items-center justify-center absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 text-white/70 hover:text-white hover:scale-110 transition-all cursor-pointer bg-white/10 p-3 md:p-4 rounded-full backdrop-blur-md border border-white/20">
          <ChevronRight size={36} strokeWidth={2} />
        </button>
      </section>
    </div>
  );
};
