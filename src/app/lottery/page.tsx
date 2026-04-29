import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { LotteryList } from "@/widgets/lottery-list";

import { getLotteriesData } from "@/entities/lottery/api/lotteryServerApi";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("populartickets");
  const tSeo = await getTranslations("seo");
  const siteName =
    tSeo("site_name") === "site_name" ? "KGLOTO" : tSeo("site_name");

  return {
    title: `${t("title")} | ${siteName}`,
  };
}

export default async function LotteriesPage() {
  const lotteries = await getLotteriesData();

  // Берем переводы
  const t = await getTranslations("populartickets");
  const tHeader = await getTranslations("header");

  return (
    <LotteryList
      initialLotteries={lotteries}
      pageTitle={tHeader("instant")} // "Моментальные"
      title={t("title")} // "Популярные лотереи"
      description={t("desc")} // Описание
    />
  );
}
