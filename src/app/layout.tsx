import type { Metadata } from 'next';
import { Rubik } from 'next/font/google';
import localFont from 'next/font/local';
import { LiquidFilterDef } from '@/components/ui/LiquidFilterDef';
import QueryProvider from '@/providers/QueryProvider';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/widgets/Footer';
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

// 🔥 Подключаем все начертания Benzin массивом
const benzin = localFont({
  src: [
    {
      path: '../font/Benzin-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../font/Benzin-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../font/Benzin-Semibold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../font/Benzin-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../font/Benzin-ExtraBold.woff2',
      weight: '800',
      style: 'normal',
    },
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

// 🔥 Динамическая генерация SEO-метаданных
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('seo');
  const locale = await getLocale();

  // Безопасные фоллбэки, если ключей еще нет в базе
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
    // OpenGraph для красивых ссылок в WhatsApp/Telegram
    openGraph: {
      title,
      description,
      siteName,
      locale: locale,
      type: 'website',
    },
    // Карточки для X (Twitter) и других соцсетей
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    icons: { icon: '/favicon.png' },
  };
}

// 🔥 Делаем layout асинхронным, чтобы получать данные словаря
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 🔥 Вытаскиваем текущую локаль и все переводы с сервера (из i18n.ts)
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    // 🔥 Теперь lang меняется динамически ('ru' или 'ky')
    <html lang={locale}>
      <body
        // 🔥 Обновил переменную тут
        className={`${rubik.variable} ${benzin.variable} antialiased font-rubik bg-[#F5F5F5]`}
      >
        {/* 🔥 Оборачиваем приложение в провайдер переводов */}
        <NextIntlClientProvider messages={messages}>
          <LiquidFilterDef />
          <QueryProvider>
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
