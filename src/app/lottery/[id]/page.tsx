import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { getLocaleHeader } from '@/lib/locale';
import { LotteryHero } from '@/components/features/lottery-detail/LotteryHero';
import { LotteryPrizeFund } from '@/components/features/lottery-detail/LotteryPrizeFund';
import { LotteryHowToPlay } from '@/components/features/lottery-detail/LotteryHowToPlay';
import { LotteryConditions } from '@/components/features/lottery-detail/LotteryConditions';
import { PopularTickets } from '@/widgets/PopularTickets';
import { WinnersHistory } from '@/widgets/WinnersHistory';
import { getTranslations } from 'next-intl/server';
// 🔥 Импортируем наш новый тип
import { LotteryDetail } from '@/types/api';

async function getLotteryDetail(id: string): Promise<LotteryDetail | null> {
  try {
    const { data } = await api.get(`/lotteries/${id}/`, {
      headers: await getLocaleHeader(),
    });
    return data.data;
  } catch (error) {
    console.error('Lottery Detail Error:', error);
    return null;
  }
}

export default async function LotteryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const lottery = await getLotteryDetail(resolvedParams.id);
  const t = await getTranslations('lottery');

  if (!lottery) return notFound();

  return (
    <div className='min-h-screen bg-[#F9F9F9] pt-6 pb-20'>
      <div className='max-w-[1520px] mx-auto px-4 md:px-8'>
        <LotteryHero data={lottery} />

        {/* Призовой фонд */}
        <LotteryPrizeFund prizeTiers={lottery.prizeTiers} />

        {/* 🔥 ВНИМАНИЕ: Сюда передаем rules, так как в них картинки! */}
        <LotteryHowToPlay rules={lottery.rules} />

        {/* 🔥 А сюда передаем terms, так как это просто текст */}
        <LotteryConditions terms={lottery.terms} />

        <WinnersHistory />

        <PopularTickets
          title={t('other_lotteries')}
          initialLotteries={lottery.otherLotteries}
        />
      </div>
    </div>
  );
}
