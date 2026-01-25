import { BestMaterials } from './sections/BestMaterials';
import { CheckLottery } from './sections/CheckLottery';
import { FAQ } from './sections/FAQ';
import { Hero } from './sections/Hero';
import { PopularTickets } from './sections/PopularTickets';
import { WinnersHistory } from './sections/WinnersHistory';

export default function Home() {
  return (
    <div>
      <Hero />
      <div className='px-4 mt-10'>
        <PopularTickets />
        <CheckLottery />
        <WinnersHistory />
        <BestMaterials />
        <FAQ />
      </div>

      <div className='h-8' />
    </div>
  );
}
