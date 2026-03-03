import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { LotteryHero } from '@/components/features/lottery-detail/LotteryHero';
import { LotteryPrizeFund } from '@/components/features/lottery-detail/LotteryPrizeFund';
import { LotteryHowToPlay } from '@/components/features/lottery-detail/LotteryHowToPlay';
import { LotteryConditions } from '@/components/features/lottery-detail/LotteryConditions';
import { PopularTickets } from '@/widgets/PopularTickets';
import { WinnersHistory } from '@/widgets/WinnersHistory';
import { getTranslations } from 'next-intl/server';

async function getLotteryDetail(id: string) {
  try {
    const { data } = await api.get(`/lotteries/${id}/`);
    return data.data;
  } catch (error) {
    console.error('Lottery Detail Error:', error);
    return null;
  }
}

export default async function LotteryDetailPage({
  params,
}: {
  // 🔥 1. Указываем TypeScript, что params — это Promise
  params: Promise<{ id: string }>;
}) {
  // 🔥 2. Распаковываем промис через await
  const resolvedParams = await params;

  // 🔥 3. Передаем уже распакованный ID
  const lottery = await getLotteryDetail(resolvedParams.id);
  const t = await getTranslations('lottery');

  if (!lottery) return notFound();

  return (
    <div className='min-h-screen bg-[#F9F9F9] pt-6 pb-20'>
      <div className='max-w-[1520px] mx-auto px-4 md:px-8'>
        <LotteryHero data={lottery} />
        <LotteryPrizeFund prizeTiers={lottery.prizeTiers} />
        <LotteryHowToPlay terms={lottery.terms} />
        <LotteryConditions rules={lottery.rules} />

        <WinnersHistory />

        <PopularTickets
          title={t('other_lotteries')}
          initialLotteries={lottery.otherLotteries}
        />
      </div>
    </div>
  );
}
