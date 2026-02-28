import { LotteryHero } from '@/components/features/lottery-detail/LotteryHero';
import { LotteryPrizeFund } from '@/components/features/lottery-detail/LotteryPrizeFund';
import { LotteryHowToPlay } from '@/components/features/lottery-detail/LotteryHowToPlay'; // 🔥 НОВОЕ
import { LotteryConditions } from '@/components/features/lottery-detail/LotteryConditions'; // 🔥 НОВОЕ
import { PopularTickets } from '@/widgets/PopularTickets';
import { WinnersHistory } from '@/widgets/WinnersHistory';

export default function LotteryDetailPage() {
  return (
    <div className='min-h-screen bg-[#F9F9F9] pt-6 pb-20'>
      <div className='max-w-[1200px] mx-auto px-4 md:px-8'>
        <LotteryHero />
        <LotteryPrizeFund />
        <LotteryHowToPlay /> {/* 🔥 Вставили */}
        <LotteryConditions /> {/* 🔥 Вставили */}
        {/* --- История победителей --- */}
        {/* <div className='mb-12 md:mb-20 mt-20'>
          <h2 className='text-base md:text-xl font-black font-benzin uppercase text-[#2D2D2D] mb-8'>
            История победителей
          </h2>
          
        </div> */}
        <WinnersHistory />
        {/* --- Другие лотереи --- */}
        <div className='mb-12 md:mb-20'>
          <h2 className='text-base md:text-xl font-black font-benzin uppercase text-[#2D2D2D] mb-8'>
            Другие лотереи
          </h2>
          <PopularTickets />
        </div>
      </div>
    </div>
  );
}
