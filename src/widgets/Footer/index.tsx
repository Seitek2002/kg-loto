import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';
import { ApiResponse, LotteryItem } from '@/types/api';

// Запрашиваем лотереи прямо в Footer (выполняется на сервере)
async function getFooterLotteries(): Promise<LotteryItem[]> {
  try {
    const { data } = await api.get<ApiResponse<LotteryItem[]>>('/lotteries/');
    return data.data || [];
  } catch (error) {
    console.error('Footer Lotteries Error:', error);
    return [];
  }
}

// Вынесли кнопки сторов в отдельный мини-компонент
const StoreButton = ({ type }: { type: 'appstore' | 'googleplay' }) => {
  const isApple = type === 'appstore';

  return (
    <Link
      href='#'
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
          Скачайте в
        </span>
        <span className='text-[11px] font-bold font-benzin uppercase leading-tight mt-1'>
          {isApple ? 'App Store' : 'Google Play'}
        </span>
      </div>
    </Link>
  );
};

export const Footer = async () => {
  const lotteries = await getFooterLotteries();

  const footerSections = [
    {
      title: 'Лотереи',
      links:
        lotteries.length > 0
          ? lotteries.map((loto) => ({
              name: loto.title,
              href: `/lottery/${loto.id}`,
            }))
          : [{ name: 'Нет доступных лотерей', href: '#' }],
    },
    {
      title: 'Покупки',
      links: [
        { name: 'Подарить билет', href: '/gift' },
        { name: 'Карта продаж', href: '/map' },
      ],
    },
    {
      title: 'Компания',
      links: [
        { name: 'О компании', href: '/about' },
        { name: 'Контакты', href: '#' },
        { name: 'Обратная связь', href: 'tel:+996312440107' },
        { name: 'Новости', href: '/news' },
      ],
    },
    {
      title: 'Информация',
      links: [
        { name: 'Проверить билет', href: '/#check' },
        { name: 'Победители', href: '/winners' },
        { name: 'Как получить выигрыш', href: '/rules' },
        { name: 'Вопросы и ответы', href: '/faq' },
      ],
    },
  ];

  return (
    <footer className='bg-[#F9F9F9] pt-10 md:pt-16 pb-10 border-t border-gray-200 text-[#2D2D2D] font-rubik'>
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
              2021-2026 ООО «KGLOTO»
            </p>
          </div>

          {/* Сетка ссылок */}
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
                        className='text-[13px] md:text-xs font-bold md:uppercase text-[#2D2D2D] hover:text-[#FFD600] transition-colors leading-tight'
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
          {/* Контакты и Безопасность */}
          <div className='flex flex-col gap-6 lg:gap-8'>
            <div className='flex flex-col lg:flex-row gap-4 lg:gap-12'>
              <div>
                <span className='block text-xs text-gray-500 mb-1 lg:mb-2'>
                  Горячая линия
                </span>
                <a
                  href='tel:+996312440107'
                  className='text-[17px] md:text-xl font-bold text-[#2D2D2D] hover:text-[#FFD600]'
                >
                  996 312 44 01 07
                </a>
              </div>
              <div className='mt-1 lg:mt-0'>
                <a
                  href='mailto:support@kgloto.kg'
                  className='text-[15px] md:text-sm text-[#2D2D2D] hover:text-[#FFD600]'
                >
                  support@kgloto.kg
                </a>
              </div>
            </div>

            {/* Моб. версия: Безопасность + 18+ (в одну строку) */}
            <div className='flex lg:hidden items-center justify-between gap-4 mt-2'>
              <p className='text-[11px] text-gray-500 max-w-[220px] leading-relaxed'>
                Мы гарантируем безопасность всех способов оплаты и не сохраняем
                ваши данные
              </p>
              <span className='font-black text-2xl text-[#2D2D2D]'>18+</span>
            </div>
          </div>

          {/* Разделитель только для мобилок */}
          <div className='h-px bg-gray-300 w-full lg:hidden my-2' />

          {/* QR и Кнопки */}
          <div className='flex items-center gap-6'>
            {/* Текст для ПК */}
            <div className='text-right hidden lg:block'>
              <p className='text-xs text-gray-500 max-w-25'>
                Скачайте наше приложение
              </p>
            </div>

            {/* QR Код */}
            <div className='w-32 h-32 lg:w-20 lg:h-20 bg-white p-2 rounded-xl shadow-sm relative shrink-0'>
              <Image
                src='/qr.svg'
                alt='QR App'
                fill
                className='object-contain p-2 lg:p-1'
              />
            </div>

            {/* Моб. версия: Текст + 2 кнопки сторов */}
            <div className='flex flex-col gap-3 lg:hidden'>
              <p className='text-[13px] text-[#2D2D2D] leading-snug'>
                Скачайте наше
                <br />
                приложение
              </p>
              <div className='flex flex-col gap-2'>
                <StoreButton type='appstore' />
                <StoreButton type='googleplay' />
              </div>
            </div>
          </div>
        </div>

        <div className='hidden lg:flex border-b border-gray-200 pb-12 mb-8'>
          <p className='text-xs text-gray-400 max-w-sm leading-relaxed'>
            Мы гарантируем безопасность всех способов оплаты и не сохраняем ваши
            данные
          </p>
        </div>

        <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 text-[11px] text-gray-500 font-medium'>
          <div className='grid grid-cols-2 lg:flex lg:flex-row gap-x-4 gap-y-5 lg:gap-6 w-full lg:w-auto'>
            <Link href='#' className='hover:text-[#2D2D2D] leading-relaxed'>
              Политика обработки
              <br className='lg:hidden' /> персональных данных
            </Link>
            <Link href='#' className='hover:text-[#2D2D2D] leading-relaxed'>
              Обработка персональных
              <br className='lg:hidden' /> данных третьими лицами
            </Link>
            <Link href='#' className='hover:text-[#2D2D2D] leading-relaxed'>
              Правила программы
              <br className='lg:hidden' /> лояльности
            </Link>
            <Link href='#' className='hover:text-[#2D2D2D] leading-relaxed'>
              Договор-оферта для
              <br className='lg:hidden' /> участников лотерей
            </Link>
          </div>
          <div className='hidden lg:block font-black text-xl text-[#2D2D2D]'>
            18+
          </div>
        </div>
      </div>
    </footer>
  );
};