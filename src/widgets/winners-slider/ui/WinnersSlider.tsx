"use client"; // Делаем его клиентским, так как слайдер без этого не заведется
import { useTranslations } from "next-intl";
import Link from "next/link";

import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

import { useWinners } from "@/entities/winner/api/winnerClientApi";
import { WinnerCard } from "@/entities/winner/ui/WinnerCard";

import { Description } from "@/shared/ui/Description";
import { Title } from "@/shared/ui/Title";

interface WinnersSliderProps {
  title?: string;
  description?: string;
  lotteryId?: string;
}

export const WinnersSlider = ({
  title,
  description,
  lotteryId,
}: WinnersSliderProps) => {
  const { data: winners, isLoading } = useWinners(); // Используем клиентский хук для простоты
  // const t = useTranslations('winners_history');

  const displayWinners = winners?.slice(0, 6) || [];

  if (isLoading)
    return <div className="h-64 animate-pulse bg-gray-100 rounded-[40px]" />;
  if (!displayWinners.length) return null;

  return (
    <section className="my-12 relative overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8">
        <div className="max-w-2xl">
          <Title>{title || "История победителей"}</Title>
          <Description>{description || "Наши счастливчики"}</Description>
        </div>

        <Link
          href="/winners"
          className="hidden lg:inline-flex items-center justify-center px-6 py-3 bg-white border border-gray-200 rounded-full text-xs font-bold font-benzin uppercase text-[#4B4B4B] hover:bg-gray-50 transition-colors shadow-sm"
        >
          Все победители
        </Link>
      </div>

      <Swiper
        spaceBetween={16}
        slidesPerView={1.1}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3.2 },
        }}
        className="overflow-visible!"
      >
        {displayWinners.map((winner) => (
          <SwiperSlide key={winner.id}>
            <WinnerCard winner={winner} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
