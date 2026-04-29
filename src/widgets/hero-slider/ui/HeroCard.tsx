"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

import { clsx } from "clsx";

import { SliderItem } from "@/entities/slider/model/types";

import { AnimatedPrizeText } from "@/shared/ui/AnimatedPrizeText";
import { Button } from "@/shared/ui/Button";

const LottiePlayer = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false },
);

interface HeroCardProps {
  slide: SliderItem;
  isActive: boolean;
  fallbackGradient: string;
}

export const HeroCard = ({
  slide,
  isActive,
  fallbackGradient,
}: HeroCardProps) => {
  // Функция для обработки URL: превращаем абсолютные ссылки нашего домена в относительные
  const getCleanHref = (url: string) => {
    if (!url) return "#";
    // Если ссылка ведет на наш основной сайт, обрезаем домен для Link
    return url.replace("https://kgloto.com", "");
  };

  const renderCardBackground = () => {
    if (!slide.image) {
      return (
        <div
          className="absolute inset-0 w-full h-full z-0"
          style={{ background: fallbackGradient }}
        />
      );
    }

    if (typeof slide.image === "string") {
      return (
        <Image
          src={slide.image}
          alt={`Фон ${slide.id}`}
          fill
          sizes="(max-width: 768px) 85vw, 60vw"
          className="object-cover z-0"
          priority={isActive}
        />
      );
    }

    if (slide.image.type === "lottie") {
      return (
        <div className="absolute bottom-0 w-full z-0 scale-105">
          <LottiePlayer
            autoplay
            loop
            src={slide.image.url}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      );
    }

    if (slide.image.type === "image") {
      return (
        <Image
          src={slide.image.url}
          alt={`Фон ${slide.id}`}
          fill
          sizes="(max-width: 768px) 85vw, 60vw"
          className="object-cover z-0"
          priority={isActive}
        />
      );
    }

    return (
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{ background: fallbackGradient }}
      />
    );
  };

  return (
    <div
      className={clsx(
        "relative w-full rounded-3xl md:rounded-[40px] overflow-hidden shadow-[0px_0px_20px_rgba(0,0,0,0.5)] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col items-center justify-center text-center text-white",
        isActive
          ? "scale-100 opacity-100 z-20"
          : "scale-[0.9] md:scale-[0.85] opacity-60 blur-[2px] z-10",
      )}
    >
      {renderCardBackground()}

      <div className="relative z-10 flex flex-col items-center p-6 w-full rounded-3xl">
        <span className="text-[9px] md:text-sm font-medium uppercase font-benzin tracking-widest mb-1.5 md:mb-4 drop-shadow-[0px_0px_10px_rgba(0,0,0,0.5)]">
          Главный приз
        </span>

        <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black leading-none mb-3 md:mb-6 uppercase tabular-nums drop-shadow-[0px_0px_10px_rgba(0,0,0,0.5)]">
          <AnimatedPrizeText text={slide.prizeText} isActive={isActive} />
        </h2>

        {slide.subtitle && (
          <div className="flex flex-col mb-5 md:mb-8">
            <span className="text-xs md:text-lg font-bold tracking-wide uppercase drop-shadow-[0px_0px_10px_rgba(0,0,0,0.5)]">
              {slide.subtitle}
            </span>
          </div>
        )}

        {slide.buttonLabel && (
          // 🔥 Оборачиваем в Link для навигации
          <Link href={getCleanHref(slide.buttonUrl)} prefetch={false}>
            {/* 🔥 Используем ваш UI-компонент Button */}
            <Button className="bg-[#FFD600] text-[#4B4B4B] border-none hover:bg-[#FFC000] hover:scale-105 active:scale-95 px-8 py-4 md:px-10 md:py-6 h-auto font-black text-xs md:text-base uppercase shadow-xl">
              {slide.buttonLabel}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
