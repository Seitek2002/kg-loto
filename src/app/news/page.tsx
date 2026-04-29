import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { NewsList } from "@/widgets/news-list";

import { getNewsList } from "@/entities/news/api/newsServerApi";

export async function generateMetadata(): Promise<Metadata> {
  const tSeo = await getTranslations("seo");
  const siteName =
    tSeo("site_name") === "site_name" ? "KGLOTO" : tSeo("site_name");

  return {
    title: `Новости | ${siteName}`,
  };
}

export default async function NewsPage() {
  const news = await getNewsList();
  return <NewsList initialNews={news} />;
}
