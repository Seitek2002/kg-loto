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

        <CheckLottery />

        <Suspense fallback={<BlockSkeleton />}>
          <WinnersHistory />
        </Suspense>

        <Suspense fallback={<BlockSkeleton />}>
          <BestMaterials />
        </Suspense>

        <Suspense fallback={<BlockSkeleton />}>
          <WhereToBuy />
        </Suspense>

        <Suspense fallback={<BlockSkeleton />}>
          <FAQ />
        </Suspense>

        <OurApp />
      </div>

      <div className='h-8' />
    </>
  );
}
