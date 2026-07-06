import { Suspense } from "react";

import { CheckLottery } from "@/widgets/check-lottery";
import { DrawLotteryList } from "@/widgets/draw-lottery-list/ui/DrawLotteryList";
import { FAQ } from "@/widgets/faq";
import { HeroSlider } from "@/widgets/hero-slider";
import { Kindness } from "@/widgets/kindness";
import { OurApp } from "@/widgets/our-app";
import { PopularTickets } from "@/widgets/popular-tickets";
import { WhereToBuy } from "@/widgets/where-to-buy";
import { RecentWinnersHistory } from "@/widgets/winners-history";
import { WinnersSlider } from "@/widgets/winners-slider";

import { Description } from "@/shared/ui/Description";
import { ScrollReveal } from "@/shared/ui/ScrollReveal";
import { Title } from "@/shared/ui/Title";

export const revalidate = 600;

const BlockSkeleton = () => (
  <div className="w-full h-64 bg-gray-200 rounded-[40px] animate-pulse my-8" />
);

export default function HomePage() {
  return (
    <>
      {/* Hero идет без Suspense, так как это LCP (первый экран), он должен быть в SSR */}
      <HeroSlider />
      <div className="max-w-380 mx-auto px-4 py-4">
        <Title>тиражные лотереи</Title>
        <Description>
          Популярные лотереи привлекают внимание благодаря крупным джекпотам,
          частым тиражам и удобным условиям участия. Тысячи игроков ежедневно
          выбирают именно эти розыгрыши, чтобы испытать удачу и побороться за
          выигрыш.
        </Description>
        <DrawLotteryList />
      </div>
      <RecentWinnersHistory />

      {/* Спейсер под Hero (вместо UnderHero, если там был просто отступ) */}
      <div className="h-10" />

      <div className="max-w-380 mx-auto px-4">
        {/* <ScrollReveal direction="up"> */}
        {/* </ScrollReveal> */}

        <Suspense fallback={<BlockSkeleton />}>
          {/* <ScrollReveal direction="up"> */}
          <div className="w-full bg-[#f9f9f9]">
            <PopularTickets />
          </div>
          {/* </ScrollReveal> */}
        </Suspense>

        {/* <ScrollReveal direction="up" className="flex lg:items-center"> */}
        <Kindness />
        {/* </ScrollReveal> */}

        {/* <ScrollReveal direction="up"> */}
        <CheckLottery />
        {/* </ScrollReveal> */}

        <Suspense fallback={<BlockSkeleton />}>
          {/* <ScrollReveal direction="left"> */}
          <WinnersSlider />
          {/* </ScrollReveal> */}
        </Suspense>

        <Suspense fallback={<BlockSkeleton />}>
          {/* <ScrollReveal direction="up"> */}
          <WhereToBuy />
          {/* </ScrollReveal> */}
        </Suspense>

        {/* <ScrollReveal direction="up" className="hidden lg:block"> */}
        <OurApp />
        {/* </ScrollReveal> */}

        <Suspense fallback={<BlockSkeleton />}>
          {/* <ScrollReveal direction="up"> */}
          <FAQ />
          {/* </ScrollReveal> */}
        </Suspense>
      </div>

      <div className="h-8" />
    </>
  );
}
