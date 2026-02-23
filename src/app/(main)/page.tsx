import { Suspense } from 'react';
import { BestMaterials } from './sections/BestMaterials';
import { CheckLottery } from './sections/CheckLottery';
import { FAQ } from './sections/FAQ';
import { OurApp } from './sections/OurApp';
import { PopularTickets } from './sections/PopularTickets';
import { WinnersHistory } from './sections/WinnersHistory';
import { WhereToBuy } from './sections/WhereToBuy';
import NewHero from './sections/NewHero';
import UnderHero from './sections/UnderHero';
import { Preloader } from '@/components/ui/Preloader';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const revalidate = 600;

const BlockSkeleton = () => (
  <div className='w-full h-64 bg-gray-200 rounded-4xl animate-pulse my-8' />
);

export default function Home() {
  return (
    <>
      <Preloader />

      <NewHero />
      <UnderHero />

      <div className='mt-10 max-w-300 mx-auto px-4'>
        {/* Оборачиваем каждый блок, которому нужны данные, в Suspense */}
        <Suspense fallback={<BlockSkeleton />}>
          <PopularTickets />
        </Suspense>

        <ScrollReveal direction='up'>
          <CheckLottery />
        </ScrollReveal>

        <Suspense fallback={<BlockSkeleton />}>
          <ScrollReveal direction="left">
            <WinnersHistory />
          </ScrollReveal>
        </Suspense>

        <Suspense fallback={<BlockSkeleton />}>
          <ScrollReveal direction="right">
            <BestMaterials />
          </ScrollReveal>
        </Suspense>

        <Suspense fallback={<BlockSkeleton />}>
          <ScrollReveal direction="up">
            <WhereToBuy />
          </ScrollReveal>
        </Suspense>

        <Suspense fallback={<BlockSkeleton />}>
          <ScrollReveal direction="up">
            <FAQ />
          </ScrollReveal>
        </Suspense>

        <ScrollReveal direction="up">
          <OurApp />
        </ScrollReveal>
      </div>

      <div className='h-8' />
    </>
  );
}
