'use client';

import Image from 'next/image';
import Link from 'next/link';

const footerSections = [
  {
    title: 'Лотереи',
    links: [
      { name: 'Оной', href: '#' },
      { name: 'Уйго белек', href: '#' },
      { name: 'Мен миллионер', href: '#' },
    ],
  },
  {
    title: 'Покупки',
    links: [
      { name: 'Подарить билет', href: '#' },
      { name: 'Карта продаж', href: '/map' },
    ],
  },
  {
    title: 'Информация',
    links: [
      { name: 'Проверить билет', href: '/scan/manual' },
      { name: 'Победители', href: '/winners' },
      { name: 'Как получить выигрыш', href: '/rules' },
      { name: 'Вопросы и ответы', href: '/faq' },
    ],
  },
  {
    title: 'Компания',
    links: [
      { name: 'О компании', href: '/about' },
      { name: 'Контакты', href: '#' },
      { name: 'Обратная связь', href: '#' },
      { name: 'Новости', href: '#' },
    ],
  },
];

export const Footer = () => {
  return (
    <footer className='hidden md:block bg-[#F9F9F9] pt-16 pb-8 border-t border-gray-200 text-[#2D2D2D] font-rubik'>
      <div className='max-w-350 mx-auto px-8'>
        <div className='grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-16'>
          <div className='lg:col-span-2 flex flex-col justify-between'>
            <Link href='/' className='relative w-32 h-10 mb-4'>
              <Image
                src='/logo.png'
                alt='KGLOTO'
                fill
                className='object-contain object-left'
              />
            </Link>
            <p className='text-xs text-gray-400 mt-4'>2021-2026 ООО «KGLOTO»</p>
          </div>

          {/* Колонки с ссылками */}
          {footerSections.map((section, idx) => (
            <div key={idx} className='flex flex-col gap-4'>
              <h4 className='text-xs text-gray-400 uppercase'>
                {section.title}
              </h4>
              <ul className='flex flex-col gap-3'>
                {section.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link
                      href={link.href}
                      className='text-xs font-bold uppercase hover:text-[#FFD600] transition-colors'
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* --- СРЕДНЯЯ ЧАСТЬ (Контакты + QR) --- */}
        <div className='flex flex-wrap items-end justify-between gap-8 border-b border-gray-200 pb-12 mb-8'>
          {/* Контакты */}
          <div className='flex flex-col gap-8'>
            <div className='flex items-start gap-12'>
              <div>
                <span className='block text-xs text-gray-400 mb-1'>
                  Горячая линия
                </span>
                <a
                  href='tel:+996312440107'
                  className='text-sm text-[#2D2D2D] hover:text-[#FFD600]'
                >
                  996 312 44 01 07
                </a>
              </div>
              <div>
                <span className='block text-xs text-gray-400 mb-1'>Email</span>
                <a
                  href='mailto:support@kgloto.kg'
                  className='text-sm text-[#2D2D2D] hover:text-[#FFD600]'
                >
                  support@kgloto.kg
                </a>
              </div>
            </div>

            <p className='text-xs text-gray-400 max-w-sm leading-relaxed'>
              Мы гарантируем безопасность всех способов оплаты и не сохраняем
              ваши данные
            </p>
          </div>

          {/* QR Код */}
          <div className='flex items-center gap-4'>
            <div className='text-right hidden lg:block'>
              <p className='text-xs text-gray-500 max-w-[100px]'>
                Скачайте наше приложение
              </p>
            </div>
            <div className='w-20 h-20 bg-white p-2 rounded-lg shadow-sm'>
              <Image
                src='/qr.svg'
                alt='QR App'
                width={80}
                height={80}
                className='w-full h-full object-contain'
              />
            </div>
          </div>
        </div>

        {/* --- НИЖНЯЯ ЧАСТЬ (Юридическая инфа) --- */}
        <div className='flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-gray-400 font-rubik'>
          <div className='flex flex-wrap gap-6'>
            <Link href='#' className='hover:text-[#2D2D2D] transition-colors'>
              Политика обработки персональных данных
            </Link>
            <Link href='#' className='hover:text-[#2D2D2D] transition-colors'>
              Правила программы лояльности
            </Link>
            <Link href='#' className='hover:text-[#2D2D2D] transition-colors'>
              Обработка персональных данных третьими лицами
            </Link>
            <Link href='#' className='hover:text-[#2D2D2D] transition-colors'>
              Договор-оферта для участников лотерей
            </Link>
          </div>

          <div className='font-black text-xl text-[#2D2D2D]'>18+</div>
        </div>
      </div>
    </footer>
  );
};

// https://www.youtube.com/shorts/anhwDGMpJB0
