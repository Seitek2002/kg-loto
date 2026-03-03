import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// 🔥 Подключаем плагин next-intl.
// По умолчанию он будет искать файл конфигурации по пути: src/i18n.ts
const withNextIntl = createNextIntlPlugin('./src/config/i18n.ts');

const nextConfig: NextConfig = {
  compress: true,
  output: 'standalone',

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'crm.kgloto.com',
        pathname: '/**',
      },
    ],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

// 🔥 Оборачиваем твой конфиг в плагин
export default withNextIntl(nextConfig);
