import type { Metadata } from 'next';
import { Rubik } from 'next/font/google';
import localFont from 'next/font/local';
import { LiquidFilterDef } from '@/components/ui/LiquidFilterDef';
import QueryProvider from '@/providers/QueryProvider';
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
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
