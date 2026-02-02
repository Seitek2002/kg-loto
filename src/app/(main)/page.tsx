import { Hero } from './sections/Hero';
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

export default function Home() {
  return (
    <div>
      <Hero />

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
