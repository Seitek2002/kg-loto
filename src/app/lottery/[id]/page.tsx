import { LotteryHero } from '@/components/features/lottery-detail/LotteryHero';
import { LotteryPrizeFund } from '@/components/features/lottery-detail/LotteryPrizeFund';
import { LotteryHowToPlay } from '@/components/features/lottery-detail/LotteryHowToPlay'; // 🔥 НОВОЕ
import { LotteryConditions } from '@/components/features/lottery-detail/LotteryConditions'; // 🔥 НОВОЕ
import { PopularTickets } from '@/widgets/PopularTickets';
import { WinnersHistory } from '@/widgets/WinnersHistory';

export default function LotteryDetailPage() {
  return (
    <div className='min-h-screen bg-[#F9F9F9] pt-6 pb-20'>
      <div className='max-w-[1520px] mx-auto px-4 md:px-8'>
        <LotteryHero />
        <LotteryPrizeFund />
        <LotteryHowToPlay />
        <LotteryConditions />
        <WinnersHistory />
        <PopularTickets title='Другие лотереи' />
      </div>
    </div>
  );
}
