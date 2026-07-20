"use client";

import Link from "next/link";

import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { MediaField, SliderItem } from "@/entities/slider/model/types";

interface HeroSliderClientProps {
  slides?: SliderItem[];
}

// Текст, лого и прочее оформление теперь запечены прямо в картинку баннера
// (решает контент-команда в БД, а не фронт) — с фронта нужны только сама
// картинка под пк/мобилку и ссылка перехода
const getMediaUrl = (field: MediaField | string | null | undefined) => {
  if (!field) return null;
  return typeof field === "string" ? field : field.url;
};

// Ссылки на наш домен превращаем в относительные для next/link
const getCleanHref = (url: string) => {
  if (!url) return "#";
  return url.replace("https://kgloto.com", "");
};

export const HeroSliderClient = ({ slides }: HeroSliderClientProps) => {
  const activeSlides = (slides ?? []).filter((slide) =>
    Boolean(getMediaUrl(slide.image)),
  );

  if (activeSlides.length === 0) return null;

  return (
    <div className="relative w-full">
      <Swiper
        modules={[Navigation]}
        slidesPerView={1}
        loop={activeSlides.length > 1}
        navigation={{ prevEl: ".hero-prev", nextEl: ".hero-next" }}
      >
        {activeSlides.map((slide, index) => {
          const desktopUrl = getMediaUrl(slide.image)!;
          const mobileUrl = getMediaUrl(slide.imageMobile) || desktopUrl;

          return (
            <SwiperSlide key={slide.id}>
              <Link
                href={getCleanHref(slide.buttonUrl)}
                prefetch={false}
                className="relative block w-full h-55 md:h-120 overflow-hidden"
              >
                {/* <picture> сам выбирает нужный source по media-query — грузится
                    только одна картинка, а не обе сразу */}
                <picture>
                  <source media="(min-width: 768px)" srcSet={desktopUrl} />
                  <img
                    src={mobileUrl}
                    alt={slide.title || "Баннер"}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </picture>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {activeSlides.length > 1 && (
        <>
          <button
            aria-label="Предыдущий баннер"
            className="hero-prev flex items-center justify-center absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 text-white/80 hover:text-white hover:scale-110 transition-all cursor-pointer bg-black/20 p-2 md:p-3 rounded-full backdrop-blur-md"
          >
            <ChevronLeft size={28} strokeWidth={2} />
          </button>
          <button
            aria-label="Следующий баннер"
            className="hero-next flex items-center justify-center absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 text-white/80 hover:text-white hover:scale-110 transition-all cursor-pointer bg-black/20 p-2 md:p-3 rounded-full backdrop-blur-md"
          >
            <ChevronRight size={28} strokeWidth={2} />
          </button>
        </>
      )}
    </div>
  );
};
