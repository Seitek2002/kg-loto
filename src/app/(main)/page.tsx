import { Hero } from './sections/Hero';
import { PopularTickets } from './sections/PopularTickets';

export default function Home() {
  return (
    <div>
      <Hero />
      <div className='px-4 mt-10'>
        <PopularTickets />
      </div>

      <div className='h-8' />
    </div>
  );
}
