import type { MetadataRoute } from "next";

import { SITE_URL } from "@/shared/config/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Личные/транзакционные разделы в индексе не нужны
      disallow: [
        "/profile",
        "/cart",
        "/wallet",
        "/scan",
        "/payment",
        "/r/",
        "/api/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
