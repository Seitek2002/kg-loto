import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ChevronRight } from "lucide-react";

import { OtherMaterialsSlider } from "@/widgets/other-news-slider";

import { getNewsBySlug, getNewsList } from "@/entities/news/api/newsServerApi";

import { SITE_NAME, SITE_URL, buildMetadata } from "@/shared/config/seo";
import { JsonLd } from "@/shared/ui/JsonLd";
import { PageHeader } from "@/shared/ui/PageHeader";

interface NewsDetailsPageProps {
  params: Promise<{ slug: string }>;
}

// 🔥 ДИНАМИЧЕСКИЕ МЕТАДАННЫЕ
export async function generateMetadata({
  params,
}: NewsDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;

  // Делаем запрос (Next.js его закэширует)
  const article = await getNewsBySlug(slug);

  if (!article) {
    return { title: `Новость не найдена | ${SITE_NAME}` };
  }

  return buildMetadata({
    title: `${article.title} | ${SITE_NAME}`,
    description: article.shortText || article.title,
    path: `/news/${slug}`,
    image: article.image,
    type: "article",
  });
}

export default async function NewsDetailsPage({
  params,
}: NewsDetailsPageProps) {
  const { slug } = await params;

  // Запрашиваем текущую новость и список всех новостей параллельно
  const [article, allNews] = await Promise.all([
    getNewsBySlug(slug),
    getNewsList(),
  ]);

  if (!article) {
    return notFound();
  }

  // Фильтруем текущую новость
  const otherArticles = allNews.filter(
    (item) => String(item.slug) !== String(slug),
  );

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const htmlContent = article.content || article.shortText || "";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    ...(article.shortText ? { description: article.shortText } : {}),
    ...(article.image ? { image: [article.image] } : {}),
    ...(article.publishedAt ? { datePublished: article.publishedAt } : {}),
    mainEntityOfPage: `${SITE_URL}/news/${slug}`,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-rubik">
      <JsonLd data={articleJsonLd} />
      <div className="px-4 pt-4">
        <PageHeader title="" />
      </div>

      <main className="max-w-300 mx-auto px-4 lg:px-8 pt-10 lg:pt-12 pb-20 overflow-hidden">
        {/* ХЛЕБНЫЕ КРОШКИ */}
        <nav className="hidden lg:flex items-center gap-2 text-[10px] sm:text-xs font-bold text-gray-400 mb-6 uppercase overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#4B4B4B] transition-colors">
            Главная
          </Link>
          <ChevronRight size={14} className="shrink-0" />
          <Link href="/news" className="hover:text-[#4B4B4B] transition-colors">
            Новости
          </Link>
          <ChevronRight size={14} className="shrink-0" />
          <span className="text-[#4B4B4B] truncate max-w-50 sm:max-w-none">
            {article.title}
          </span>
        </nav>

        {/* ЗАГОЛОВОК И ДАТА */}
        <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-black font-benzin text-[#4B4B4B] uppercase leading-tight mb-4 max-w-4xl">
          {article.title}
        </h1>
        <div className="text-xs font-bold font-rubik text-[#737373] uppercase mb-8 lg:mb-12">
          {formattedDate}
        </div>

        {/* КОНТЕНТ НОВОСТИ (с классом html-content для стилей из globals.css) */}
        <div className="w-full max-w-4xl">
          <div
            className="html-content text-sm sm:text-base text-[#4B4B4B] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>

        {/* СЛАЙДЕР "ДРУГИЕ МАТЕРИАЛЫ" */}
        <OtherMaterialsSlider articles={otherArticles} />
      </main>
    </div>
  );
}
