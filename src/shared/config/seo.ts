import type { Metadata } from "next";

// Публичный origin сайта (без /api/v1) — нужен для sitemap, robots, OG-ссылок.
// Берём из того же env, что и API, чтобы не заводить второй источник правды.
const deriveSiteUrl = () => {
  try {
    return new URL(
      process.env.NEXT_PUBLIC_API_URL || "https://kgloto.com/api/v1",
    ).origin;
  } catch {
    return "https://kgloto.com";
  }
};

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || deriveSiteUrl();
export const SITE_NAME = "KGLOTO";

// Дефолтная картинка для соцсетей (OG/Twitter), когда у страницы нет своей.
export const DEFAULT_OG_IMAGE = "/images/hero/main-bg.png";

interface BuildMetadataParams {
  title: string;
  description?: string;
  // Относительный путь страницы, напр. "/news" — используется для og:url
  path?: string;
  // Абсолютный URL картинки (напр. из CMS) либо относительный путь в /public
  image?: string | null;
  type?: "website" | "article";
}

// Единая сборка метатегов, чтобы og/twitter были заполнены корректно на каждой
// странице (Next.js не наследует og-поля из layout, если страница задаёт свои).
export const buildMetadata = ({
  title,
  description,
  path = "/",
  image,
  type = "website",
}: BuildMetadataParams): Metadata => {
  const url = new URL(path, SITE_URL).toString();
  const ogImage = image || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
};

// Статическая разметка организации для сниппетов в поиске.
export const organizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+996226777877",
    contactType: "customer service",
    areaServed: "KG",
    availableLanguage: ["ru", "ky"],
  },
});
