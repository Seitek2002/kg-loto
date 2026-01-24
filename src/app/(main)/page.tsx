import { CheckLottery } from './sections/CheckLottery';
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
      </div>

      <div className='h-8' />
    </div>
  );
}
