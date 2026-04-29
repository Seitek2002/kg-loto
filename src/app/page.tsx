import { Suspense } from "react";

import { CheckLottery } from "@/widgets/check-lottery";
import { FAQ } from "@/widgets/faq";
import { HeroSlider } from "@/widgets/hero-slider";
import { OurApp } from "@/widgets/our-app";
import { PopularTickets } from "@/widgets/popular-tickets";
import { WhereToBuy } from "@/widgets/where-to-buy";
import { RecentWinnersHistory } from "@/widgets/winners-history";
import { WinnersSlider } from "@/widgets/winners-slider";

import { ScrollReveal } from "@/shared/ui/ScrollReveal";

export const revalidate = 600;

const BlockSkeleton = () => (
  <div className="w-full h-64 bg-gray-200 rounded-[40px] animate-pulse my-8" />
);

export default function HomePage() {
  return (
    <>
      {/* Hero идет без Suspense, так как это LCP (первый экран), он должен быть в SSR */}
      <HeroSlider />
      <RecentWinnersHistory />

      {/* Спейсер под Hero (вместо UnderHero, если там был просто отступ) */}
      <div className="h-10" />

      <div className="max-w-310 mx-auto px-4">
        <Suspense fallback={<BlockSkeleton />}>
          <PopularTickets />
        </Suspense>

        <ScrollReveal direction="up">
          <CheckLottery />
        </ScrollReveal>

        <Suspense fallback={<BlockSkeleton />}>
          <ScrollReveal direction="left">
            <WinnersSlider />
          </ScrollReveal>
        </Suspense>

        <Suspense fallback={<BlockSkeleton />}>
          <ScrollReveal direction="up">
            <WhereToBuy />
          </ScrollReveal>
        </Suspense>

        <ScrollReveal direction="up">
          <OurApp />
        </ScrollReveal>

        <Suspense fallback={<BlockSkeleton />}>
          <ScrollReveal direction="up">
            <FAQ />
          </ScrollReveal>
        </Suspense>
      </div>

      <div className="h-8" />
    </>
  );
}
