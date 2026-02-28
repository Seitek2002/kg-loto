import type { Metadata } from 'next';
import { Rubik } from 'next/font/google';
import localFont from 'next/font/local';
import { LiquidFilterDef } from '@/components/ui/LiquidFilterDef';
import QueryProvider from '@/providers/QueryProvider';
import { Header } from '@/components/ui/Header'; // 🔥 Подключаем шапку
import { Footer } from '@/widgets/Footer'; // 🔥 Подключаем футер
import dynamic from 'next/dynamic';
import './globals.css';

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

// 🔥 Динамический импорт (отличная практика для компонентов, которые не нужны при первой отрисовке сервера)
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ru'>
      <body
        className={`${rubik.variable} ${benzinHero.variable} antialiased font-rubik bg-[#F5F5F5]`}
      >
        <LiquidFilterDef />
        <QueryProvider>
          {/* 🔥 Обертка для всей страницы. 
            flex flex-col и flex-1 для main помогают прижать Footer к самому низу, 
            даже если контента на странице мало.
          */}
          <div className='relative min-h-screen flex flex-col'>
            {/* Статичная шапка, не подвержена анимациям переходов */}
            <Header theme='dark' />

            {/* Внутри children сработает твой template.tsx с анимациями */}
            <main className='flex-1 pb-20 w-full mx-auto shadow-sm'>
              {children}
            </main>

            {/* Навигация, которая теперь железобетонно прилипнет к экрану телефона */}
            <BottomNav />

            {/* Статичный футер */}
            <Footer />
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
