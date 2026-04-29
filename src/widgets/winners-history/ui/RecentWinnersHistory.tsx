import { getTranslations } from "next-intl/server";

import { getRecentWinners } from "@/entities/winner/api/winnerServerApi";

// Если компонента Title у тебя еще нет в shared/ui, создай его
import { Title } from "@/shared/ui/Title";

import { WinnersMarquee } from "./WinnersMarquee";

export const RecentWinnersHistory = async () => {
  // const t = await getTranslations('home'); // Раскомментируй, когда будет словарь
  const t = (key: string) =>
    key === "recent_winners_title" ? "ПОСЛЕДНИЕ ПОБЕДИТЕЛИ" : key;

  const winners = await getRecentWinners();

  if (!winners || winners.length === 0) {
    return null;
  }

  let paddedWinners = [...winners];
  while (paddedWinners.length < 8) {
    paddedWinners = [...paddedWinners, ...winners];
  }

  return (
    <section className="mx-auto relative py-12 overflow-hidden w-full">
      <div className="pl-4 uppercase mb-8 max-w-310 mx-auto">
        <Title>{t("recent_winners_title")}</Title>
      </div>

      <WinnersMarquee winners={paddedWinners} />
    </section>
  );
};
