'use client';

import { useRouter } from 'next/navigation';
import { Hero, HeroSlideData } from './sections/Hero';
import dynamic from 'next/dynamic';

const PopularTickets = dynamic(() =>
  import('./sections/PopularTickets').then((mod) => mod.PopularTickets),
);
const CheckLottery = dynamic(() =>
  import('./sections/CheckLottery').then((mod) => mod.CheckLottery),
);
const WinnersHistory = dynamic(() =>
  import('./sections/WinnersHistory').then((mod) => mod.WinnersHistory),
);
const BestMaterials = dynamic(() =>
  import('./sections/BestMaterials').then((mod) => mod.BestMaterials),
);
const FAQ = dynamic(() => import('./sections/FAQ').then((mod) => mod.FAQ));
const OurApp = dynamic(() =>
  import('./sections/OurApp').then((mod) => mod.OurApp),
);

const MAIN_SLIDES: HeroSlideData[] = [
  {
    id: 1, // ID лотереи
    bg: '/banners/1.jpg',
    title1: 'СТАНЬ МИЛЛИОНЕРОМ',
    title2: 'Призовой фонд 10 000 000 сом',
    prize: '1 000 000 COM',
    price: '200 сом',
  },
  {
    id: 2,
    bg: '/banners/2.png',
    title1: 'ЛЕГКАЯ УДАЧА',
    title2: 'Призовой фонд 10 000 000 сом',
    prize: '500 000 СОМ',
    price: '50 сом',
  },
  // ...
];

export default function Home() {
  const router = useRouter();

  const handleHeroClick = (id: number | string) => {
    router.push(`/lottery/${id}`);
  };

  return (
    <div>
      <Hero
        slides={MAIN_SLIDES}
        onButtonClick={handleHeroClick}
        buttonText='Играть'
      />

      <div className='px-4 mt-10 xl:max-w-[80%] mx-auto'>
        <PopularTickets />
        <CheckLottery />
        <WinnersHistory />
        <BestMaterials />
        <FAQ />
        <OurApp />
      </div>

      <div className='h-8' />
    </div>
  );
}
