import type { Metadata } from 'next';
import { Rubik } from 'next/font/google';
import localFont from 'next/font/local';
import { LiquidFilterDef } from '@/components/ui/LiquidFilterDef';
import QueryProvider from '@/providers/QueryProvider';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/widgets/Footer';
import dynamic from 'next/dynamic';
import './globals.css';

// 🔥 Импортируем провайдер и серверные функции для next-intl
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';

const rubik = Rubik({
  variable: '--font-rubik',
  subsets: ['cyrillic', 'latin'],
  display: 'swap',
  weight: ['400', '500', '700'],
});

const benzinHero = localFont({
  src: '../font/Benzin-ExtraBold.woff2',
  variable: '--font-benzin',
  display: 'swap',
  weight: '800',
  preload: true,
});

const BottomNav = dynamic(() =>
  import('@/components/features/navigation/BottomNav').then(
    (mod) => mod.BottomNav,
  ),
);

export const metadata: Metadata = {
  title: 'KGLOTO.COM',
  description: 'Первый маркетплейс лотерейных билетов',
  icons: { icon: '/favicon.png' },
};

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
        className={`${rubik.variable} ${benzinHero.variable} antialiased font-rubik bg-[#F5F5F5]`}
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
