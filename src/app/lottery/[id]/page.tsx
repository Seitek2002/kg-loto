import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { LotteryConditions } from "@/widgets/lottery-detail/LotteryConditions";
import { LotteryHero } from "@/widgets/lottery-detail/LotteryHero";
import { LotteryHowToPlay } from "@/widgets/lottery-detail/LotteryHowToPlay";
import { LotteryPrizeFund } from "@/widgets/lottery-detail/LotteryPrizeFund";
import { PopularTickets } from "@/widgets/popular-tickets";
import { WinnersSlider } from "@/widgets/winners-slider";

import { getLotteryDetail } from "@/entities/lottery/api/lotteryServerApi";

import { SITE_NAME, buildMetadata } from "@/shared/config/seo";

interface LotteryDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: LotteryDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const lottery = await getLotteryDetail(id);

  if (!lottery) {
    return { title: `Лотерея не найдена | ${SITE_NAME}` };
  }

  return buildMetadata({
    title: `${lottery.title} | ${SITE_NAME}`,
    description:
      lottery.subtitle ||
      `Участвуйте в лотерее ${lottery.title} и выигрывайте призы!`,
    path: `/lottery/${id}`,
    image:
      lottery.imageLive ||
      lottery.backgroundImage ||
      lottery.drawLogo ||
      lottery.logo,
  });
}

export default async function LotteryDetailPage({
  params,
}: LotteryDetailPageProps) {
  const { id } = await params;
  const lottery = await getLotteryDetail(id);
  const t = await getTranslations("lottery");

  if (!lottery) return notFound();

  return (
    <div className="min-h-screen bg-[#F9F9F9] pt-6 pb-20">
      <div className="max-w-380 mx-auto px-4 md:px-8">
        <LotteryHero data={lottery} />

        <LotteryPrizeFund prizeTiers={lottery.prizeTiers} />

        <LotteryHowToPlay rules={lottery.rules} />

        <LotteryConditions terms={lottery.terms} />

        <WinnersSlider title={`Победители "${lottery.title}"`} lotteryId={id} />

        <PopularTickets
          title={t("other_lotteries")}
          initialLotteries={lottery.otherLotteries}
          currentLotteryId={id}
        />
      </div>
    </div>
  );
}
