import type { Metadata } from 'next';
import { Rubik } from 'next/font/google';
import localFont from 'next/font/local';
import { LiquidFilterDef } from '@/components/ui/LiquidFilterDef';
import './globals.css';

// Rubik грузим через Google Fonts (они быстрые)
const rubik = Rubik({
  variable: '--font-rubik',
  subsets: ['cyrillic', 'latin'], // 🔥 Ограничиваем символы (важно!)
  display: 'swap',
  weight: ['400', '500', '700'], // Грузим только нужные веса
});

// 🔥 ГЛАВНЫЙ ХАК: Грузим только тот вес, который в заголовке Hero (например 800)
// Это сделает файл шрифта в 5 раз легче.
const benzinHero = localFont({
  src: '../font/Benzin-ExtraBold.woff2', // Убедись, что путь верный
  variable: '--font-benzin', // Используем ту же переменную
  display: 'swap',
  weight: '800',
  preload: true, // Принудительный прелоад
});

// Остальные веса можно подгрузить отдельно или вообще забить,
// если они не используются на первом экране.
// Если нужны другие веса для остального сайта, добавь их в отдельный localFont,
// но НЕ используй переменную --font-benzin, чтобы не перебивать Hero.

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
      {/* Важно: Сначала грузим шрифт, потом CSS. 
         Хотя Next.js сам это оптимизирует, порядок переменных важен.
      */}
      <body
        className={`${rubik.variable} ${benzinHero.variable} antialiased font-rubik bg-[#F5F5F5]`}
      >
        <LiquidFilterDef />
        {children}
      </body>
    </html>
  );
}
