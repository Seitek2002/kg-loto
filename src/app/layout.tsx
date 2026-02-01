import type { Metadata } from 'next';
import { Rubik } from 'next/font/google';
import localFont from 'next/font/local';

import { LiquidFilterDef } from '@/components/ui/LiquidFilterDef';
import './globals.css';

const rubik = Rubik({
  variable: '--font-rubik',
});

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
  variable: '--font-benzin', // Имя переменной CSS, через которую Tailwind подхватит шрифт
});

export const metadata: Metadata = {
  title: 'KGLOTO.COM - первый маркетплейс лотерейных билетов в Кыргызстане',
  description: 'KGLOTO.COM - первый маркетплейс лотерейных билетов в Кыргызстане',
  icons: {
    icon: '/favicon.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${rubik.variable} ${benzin.variable} antialiased font-rubik`}>
        <LiquidFilterDef />
        {children}
      </body>
    </html>
  );
}
