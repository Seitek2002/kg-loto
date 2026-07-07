import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";
import { Rubik } from "next/font/google";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import Script from "next/script";

import { Footer } from "@/widgets/footer";
import { Header } from "@/widgets/header";

import { AgeVerificationModal } from "@/features/age-verification";

import { LiquidFilterDef } from "@/shared/ui/LiquidFilterDef";
import { ToastContainer } from "@/shared/ui/Toast";

import "./globals.css";
import QueryProvider from "./providers";

// Шрифты
const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["cyrillic", "latin"],
  display: "swap",
  weight: ["400", "500", "700"],
});

const benzin = localFont({
  // Убедись, что папка font лежит в app/font/ или shared/assets/fonts/
  src: [
    { path: "./font/Benzin-Regular.woff2", weight: "400", style: "normal" },
    { path: "./font/Benzin-Medium.woff2", weight: "500", style: "normal" },
    { path: "./font/Benzin-Semibold.woff2", weight: "600", style: "normal" },
    { path: "./font/Benzin-Bold.woff2", weight: "700", style: "normal" },
    { path: "./font/Benzin-ExtraBold.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-benzin",
  display: "swap",
  preload: true,
});

// Динамический импорт для BottomNav (чтобы не грузить десктоп юзеров мобильным меню)
const BottomNav = dynamic(() =>
  import("@/widgets/bottom-nav").then((mod) => mod.BottomNav),
);

// Генерация SEO метаданных
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("seo");
  const locale = await getLocale();

  const title = t("title") === "title" ? "KGLOTO.COM" : t("title");
  const description =
    t("description") === "description"
      ? "Первый маркетплейс лотерейных билетов"
      : t("description");
  const keywords =
    t("keywords") === "keywords"
      ? "лотерея, билеты, кыргызстан, выигрыш, джекпот, kgloto"
      : t("keywords");
  const siteName = t("site_name") === "site_name" ? "KGLOTO" : t("site_name");

  return {
    title,
    description,
    keywords,
    applicationName: siteName,
    openGraph: {
      title,
      description,
      siteName,
      locale: locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    icons: { icon: "/favicon.png" },
  };
}

// 🔥 Серверный запрос за меню через нативный fetch
async function getMenuData() {
  try {
    const cookieStore = await cookies();
    const locale = cookieStore.get("NEXT_LOCALE")?.value || "ru";
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://kgloto.com/api/v1";

    const res = await fetch(`${baseUrl}/menu/`, {
      headers: {
        "Accept-Language": locale,
      },
      next: { revalidate: 3600 }, // Кешируем меню на 1 час (оно редко меняется)
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Menu Data Error:", error);
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  const cookieStore = await cookies();
  const isAgeVerified = cookieStore.get("age_verified")?.value === "true";

  const menuData = await getMenuData();

  return (
    <html lang={locale}>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-DK612GGJC5"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-DK612GGJC5');
        `}
      </Script>
      <body
        className={`${rubik.variable} ${benzin.variable} antialiased font-rubik bg-[#F5F5F5]`}
      >
        <NextIntlClientProvider messages={messages}>
          <LiquidFilterDef />

          <QueryProvider>
            <ToastContainer />
            {!isAgeVerified && <AgeVerificationModal />}

            <div className="relative min-h-screen flex flex-col">
              <Header
                theme="dark"
                headerMenu={menuData?.["header.menu"]}
                headerUpperMenu={menuData?.["header.uppermenu"]}
              />

              <main className="flex-1 pb-20 w-full mx-auto shadow-sm">
                {children}
              </main>

              <BottomNav />
              <Footer menuData={menuData} />
            </div>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
