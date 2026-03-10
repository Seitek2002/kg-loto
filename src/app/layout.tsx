import type { Metadata } from 'next';
import { Rubik } from 'next/font/google';
import localFont from 'next/font/local';
import { cookies } from 'next/headers'; // 🔥 Добавили импорт кук
import { LiquidFilterDef } from '@/components/ui/LiquidFilterDef';
import QueryProvider from '@/providers/QueryProvider';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/widgets/Footer';
import { AgeVerificationModal } from '@/components/ui/AgeVerificationModal'; // 🔥 Добавили импорт модалки
import dynamic from 'next/dynamic';
import './globals.css';

import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale, getTranslations } from 'next-intl/server';

const rubik = Rubik({
  variable: '--font-rubik',
  subsets: ['cyrillic', 'latin'],
  display: 'swap',
  weight: ['400', '500', '700'],
});

const benzin = localFont({
  src: [
    { path: '../font/Benzin-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../font/Benzin-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../font/Benzin-Semibold.woff2', weight: '600', style: 'normal' },
    { path: '../font/Benzin-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../font/Benzin-ExtraBold.woff2', weight: '800', style: 'normal' },
  ],
  variable: '--font-benzin',
  display: 'swap',
  preload: true,
});

const BottomNav = dynamic(() =>
  import('@/components/features/navigation/BottomNav').then(
    (mod) => mod.BottomNav,
  ),
);

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('seo');
  const locale = await getLocale();

  const title = t('title') === 'title' ? 'KGLOTO.COM' : t('title');
  const description =
    t('description') === 'description'
      ? 'Первый маркетплейс лотерейных билетов'
      : t('description');
  const keywords =
    t('keywords') === 'keywords'
      ? 'лотерея, билеты, кыргызстан, выигрыш, джекпот, kgloto'
      : t('keywords');
  const siteName = t('site_name') === 'site_name' ? 'KGLOTO' : t('site_name');

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
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    icons: { icon: '/favicon.png' },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  // 🔥 Получаем куки на сервере и проверяем наличие флага
  const cookieStore = await cookies();
  const isAgeVerified = cookieStore.get('age_verified')?.value === 'true';

  return (
    <html lang={locale}>
      <body
        className={`${rubik.variable} ${benzin.variable} antialiased font-rubik bg-[#F5F5F5]`}
      >
        <NextIntlClientProvider messages={messages}>
          <LiquidFilterDef />
          <QueryProvider>
            {/* 🔥 Если куки нет, рендерим модалку поверх всего сайта */}
            {!isAgeVerified && <AgeVerificationModal />}

            <div className='relative min-h-screen flex flex-col'>
              <Header theme='dark' />

              <main className='flex-1 pb-20 w-full mx-auto shadow-sm'>
                {children}
              </main>

              <BottomNav />
              <Footer />
            </div>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
