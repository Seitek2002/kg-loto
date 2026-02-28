// import { Preloader } from '@/components/ui/Preloader';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { BestMaterials } from '@/widgets/BestMaterials';
import { CheckLottery } from '@/widgets/CheckLottery';
import { FAQ } from '@/widgets/FAQ';
import NewHero from '@/widgets/NewHero';
import { OurApp } from '@/widgets/OurApp';
import { PopularTickets } from '@/widgets/PopularTickets';
import UnderHero from '@/widgets/UnderHero';
import { WhereToBuy } from '@/widgets/WhereToBuy';
import { WinnersHistory } from '@/widgets/WinnersHistory';
import { Suspense } from 'react';

export const revalidate = 600;

const BlockSkeleton = () => (
  <div className='w-full h-64 bg-gray-200 rounded-4xl animate-pulse my-8' />
);

export default function Home() {
  return (
    <>

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
          <ScrollReveal direction='left'>
            <WinnersHistory />
          </ScrollReveal>
        </Suspense>

        <Suspense fallback={<BlockSkeleton />}>
          <ScrollReveal direction='right'>
            <BestMaterials />
          </ScrollReveal>
        </Suspense>

        <Suspense fallback={<BlockSkeleton />}>
          <ScrollReveal direction='up'>
            <WhereToBuy />
          </ScrollReveal>
        </Suspense>

        <Suspense fallback={<BlockSkeleton />}>
          <ScrollReveal direction='up'>
            <FAQ />
          </ScrollReveal>
        </Suspense>

        <ScrollReveal direction='up'>
          <OurApp />
        </ScrollReveal>
      </div>

      <div className='h-8' />
    </>
  );
}
