import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { QRCodeSVG } from 'qrcode.react';
import { MenuData, MenuItem } from '@/types/api';

const StoreButton = ({
  type,
  downloadText,
  href,
}: {
  type: 'appstore' | 'googleplay';
  downloadText: string;
  href: string;
}) => {
  const isApple = type === 'appstore';

  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className='flex items-center gap-3 bg-[#262626] text-white px-5 py-2.5 rounded-[14px] hover:bg-black active:scale-95 transition-all min-w-[150px]'
    >
      {isApple ? (
        <svg className='w-6 h-6 fill-current' viewBox='0 0 24 24'>
          <path d='M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.5 1.3 0 2.52.87 3.3.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.39 2.82M13 3.5c.73-.83 1.21-1.96 1.07-3.09-1.05.06-2.31.74-3.03 1.59-.65.74-1.23 1.92-1.07 3.07 1.17.09 2.35-.73 3.03-1.57' />
        </svg>
      ) : (
        <svg className='w-6 h-6 fill-current' viewBox='0 0 24 24'>
          <path d='M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z' />
        </svg>
      )}

      <div className='flex flex-col'>
        <span className='text-[8px] uppercase font-medium text-gray-300 leading-none'>
          {downloadText}
        </span>
        <span className='text-[11px] font-bold font-benzin uppercase leading-tight mt-1'>
          {isApple ? 'App Store' : 'Google Play'}
        </span>
      </div>
    </a>
  );
};

// 🔥 Хелпер для безопасного парсинга ссылок
const getRelativeUrl = (url: string) => {
  try {
    return new URL(url).pathname;
  } catch {
    return url.startsWith('/') ? url : `/${url}`;
  }
};

interface FooterProps {
  menuData?: MenuData | null;
}

export const Footer = async ({ menuData }: FooterProps) => {
  const t = await getTranslations('footer');

  const phone1 = t('phone_1') === 'phone_1' ? '+996 998 777 377' : t('phone_1');
  const phone2 = t('phone_2') === 'phone_2' ? '+996 226 777 877' : t('phone_2');
  const phone3 = t('phone_3') === 'phone_3' ? '+996 507 778 733' : t('phone_3');

  const email = t('email') === 'email' ? 'support@kgloto.kg' : t('email');

  const APP_STORE_LINK =
    'https://apps.apple.com/kg/app/kgloto-checker/id6757925326';
  const GOOGLE_PLAY_LINK =
    'https://play.google.com/store/apps/details?id=kg.loto.app';

  // 🔥 Сортируем и подготавливаем данные из объекта menuData
  const formatLinks = (items?: MenuItem[]) => {
    if (!items || items.length === 0) return [];
    return items
      .filter((item) => item.isActive)
      .sort((a, b) => a.order - b.order)
      .map((item) => ({
        name: item.title,
        href: getRelativeUrl(item.link),
      }));
  };

  const footerSections = [
    {
      title: t('lotteries'),
      links:
        formatLinks(menuData?.['footer.lotteries']).length > 0
          ? formatLinks(menuData?.['footer.lotteries'])
          : [{ name: t('no_lotteries'), href: '#' }],
    },
    {
      title: t('purchases'),
      links: formatLinks(menuData?.['footer.purchases']),
    },
    {
      title: t('company'),
      links: formatLinks(menuData?.['footer.company']),
    },
    {
      title: t('info'),
      links: formatLinks(menuData?.['footer.info']),
    },
  ];

  return (
    <footer className='bg-[#F9F9F9] pt-10 md:pt-16 pb-10 border-t border-gray-200 text-[#4B4B4B] font-rubik'>
      <div className='max-w-[1400px] mx-auto px-5 md:px-8'>
        <div className='flex flex-col lg:flex-row gap-10 lg:gap-8 mb-8 lg:mb-16'>
          {/* Логотип */}
          <div className='lg:w-1/3 flex flex-col justify-between order-1 lg:order-none'>
            <div className='mb-4'>
              <Link
                href='/'
                className='relative block w-36 md:w-45 h-14 md:h-16'
              >
                <Image
                  src='/logo.png'
                  alt='KGLOTO'
                  fill
                  className='object-contain object-left'
                />
              </Link>
            </div>
            <p className='text-xs font-medium text-[#6E6E6E]'>
              {t('copyright')}
            </p>
          </div>

          {/* Сетка динамических ссылок */}
          <div className='lg:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 order-2 lg:order-none'>
            {footerSections.map((section, idx) => (
              <div key={idx} className='flex flex-col gap-4'>
                <h4 className='text-[13px] md:text-xs text-gray-500 md:text-gray-400'>
                  {section.title}
                </h4>
                <ul className='flex flex-col gap-3.5'>
                  {section.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <Link
                        href={link.href}
                        className='text-[13px] md:text-xs font-bold md:uppercase text-[#4B4B4B] hover:text-[#FFD600] transition-colors leading-tight block max-w-full break-words'
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className='h-px bg-gray-300 w-full mb-8 lg:hidden' />
        <div className='flex flex-col lg:flex-row justify-between gap-8 mb-8'>
          <div className='flex flex-col gap-6 lg:gap-8'>
            <div className='flex flex-col lg:flex-row gap-8 lg:gap-12'>
              <div>
                <span className='block text-xs text-gray-500 mb-2 lg:mb-3'>
                  {t('hotline')}
                </span>
                <div className='flex flex-col gap-1.5'>
                  <a
                    href={`tel:${phone1.replace(/\s/g, '')}`}
                    className='text-[16px] md:text-[18px] font-bold text-[#4B4B4B] hover:text-[#FFD600] transition-colors whitespace-nowrap'
                  >
                    {phone1}
                  </a>
                  <a
                    href={`tel:${phone2.replace(/\s/g, '')}`}
                    className='text-[16px] md:text-[18px] font-bold text-[#4B4B4B] hover:text-[#FFD600] transition-colors whitespace-nowrap'
                  >
                    {phone2}
                  </a>
                  <a
                    href={`tel:${phone3.replace(/\s/g, '')}`}
                    className='text-[16px] md:text-[18px] font-bold text-[#4B4B4B] hover:text-[#FFD600] transition-colors whitespace-nowrap'
                  >
                    {phone3}
                  </a>
                </div>
              </div>
              <div className='mt-1 lg:mt-0'>
                <a
                  href={`mailto:${email}`}
                  className='text-[15px] md:text-sm text-[#4B4B4B] hover:text-[#FFD600]'
                >
                  {email}
                </a>
              </div>
            </div>

            <div className='flex lg:hidden items-center justify-between gap-4 mt-2'>
              <p className='text-[11px] text-gray-500 max-w-[220px] leading-relaxed'>
                {t('security_guarantee')}
              </p>
              <span className='font-black text-2xl text-[#4B4B4B]'>18+</span>
            </div>
          </div>

          <div className='h-px bg-gray-300 w-full lg:hidden my-2' />

          <div className='flex items-center gap-6'>
            <div className='text-right hidden lg:block'>
              <p className='text-xs text-gray-500 max-w-25'>
                {t('download_app')}
              </p>
            </div>

            <div className='w-32 h-32 lg:w-20 lg:h-20 bg-white p-2 rounded-xl shadow-sm relative shrink-0'>
              <QRCodeSVG
                value='https://kgloto.com'
                className='w-full h-full text-[#4B4B4B]'
                level='H'
              />
            </div>

            <div className='flex flex-col gap-3 lg:hidden'>
              <p className='text-[13px] text-[#4B4B4B] leading-snug max-w-[120px]'>
                {t('download_app')}
              </p>
              <div className='flex flex-col gap-2'>
                <StoreButton
                  type='appstore'
                  href={APP_STORE_LINK}
                  downloadText={t('download_in')}
                />
                <StoreButton
                  type='googleplay'
                  href={GOOGLE_PLAY_LINK}
                  downloadText={t('download_in')}
                />
              </div>
            </div>
          </div>
        </div>

        <div className='hidden lg:flex border-b border-gray-200 pb-12 mb-8'>
          <p className='text-xs text-gray-400 max-w-sm leading-relaxed'>
            {t('security_guarantee')}
          </p>
        </div>

        <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 text-[11px] text-gray-500 font-medium'>
          <div className='grid grid-cols-2 lg:flex lg:flex-row gap-x-4 gap-y-5 lg:gap-6 w-full lg:w-auto'>
            <a
              href={t('docs.policy_file')}
              target='_blank'
              rel='noopener noreferrer'
              className='hover:text-[#4B4B4B] leading-relaxed max-w-[150px] lg:max-w-none'
            >
              {t('docs.policy')}
            </a>
          </div>
          <div className='hidden lg:block font-black text-xl text-[#4B4B4B]'>
            18+
          </div>
        </div>
      </div>
    </footer>
  );
};
