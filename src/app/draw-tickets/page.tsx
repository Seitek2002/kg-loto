// 🔥 БЕЗ 'use client'! Это теперь чистый серверный компонент.
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

// Импорты блоков
import { DrawTicketsClient } from './components/DrawTicketsClient';
import { DrawRulesBlock } from './components/DrawRulesBlock';
import { DrawTicketsBlock } from './components/DrawTicketsBlock';
import { LotteryConditions } from '@/components/features/lottery-detail/LotteryConditions';
import { PopularTickets } from '@/widgets/PopularTickets';
import { WinnersHistory } from '@/widgets/WinnersHistory';
import { LotteryItem } from '@/types/api';

const MOCK_TERMS = [
  {
    id: 1,
    text: 'Лицам младше 18-ти лет запрещено приобретать лотерейные билеты.',
    order: 1,
  },
  {
    id: 2,
    text: 'Участником считается физическое лицо, законно приобретшее лотерейный билет.',
    order: 2,
  },
  {
    id: 3,
    text: 'Стоимость билета не должна превышать цену, указанную на билете.',
    order: 3,
  },
  {
    id: 4,
    text: 'Оператор не несет ответственности за утрату или повреждение билета после его приобретения.',
    order: 4,
  },
  {
    id: 5,
    text: 'Билет возврату или обмену не подлежит. Каждый билет имеет уникальный номер: дублирование номеров в рамках одного тиража исключено.',
    order: 5,
  },
  {
    id: 6,
    text: 'Приобретая билет, Участник автоматически соглашается с условиями лотереи, размещенными на сайте www.kgloto.com.',
    order: 6,
  },
  { id: 7, text: 'Розыгрыш проводится в дату, указанную на билете', order: 7 },
  {
    id: 8,
    text: 'Участник обязан самостоятельно проверять результаты на сайте или в точках продаж.',
    order: 8,
  },
  {
    id: 9,
    text: 'Трансляция доступна на сайте www.kgloto.com и Youtube-канале.',
    order: 9,
  },
  {
    id: 10,
    text: 'Билет является единственным документом, подтверждающим право на получение выигрыша. Необходимо сохранять его до завершения всех процедур.',
    order: 10,
  },
  {
    id: 11,
    text: 'Налоги и сборы удерживаются в соответствии с законодательством Кыргызской Республики. Подробная информация размещена на сайте Оператора.',
    order: 11,
  },
];

const MOCK_OTHER_LOTTERIES: LotteryItem[] = [
  {
    id: 2,
    title: 'Легкий выигрыш!',
    titleText: '',
    subtitle:
      'Популярные лотереи привлекают внимание благодаря крупным джекпотам, частым тиражам и удобным условиям участия.',
    logo: 'https://kgloto.com/media/lottery/logos/2026/03/05/Frame_20.png',
    imageLive:
      'https://kgloto.com/media/lottery/live/2026/03/04/%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA_%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0_2026-03-04_%D0%B2_18_IYDmT0B.25.03.png',
    mainPrize1: '500 000 сом',
    mainPrize2: '2 x 100 000 сом',
    mainPrize3: '5 x 50 000 сом',
    prizeText: '500 000 KGS',
    buttonText: 'Играть',
    buttonPrice: 50,
    buttonLabel: 'ИГРАТЬ • 50 СОМ',
    buttonUrl: undefined,
    drawTime: '15:00',
    theme: 'white',
    backgroundImage:
      'https://kgloto.com/media/lottery/backgrounds/2026/03/04/onoi_cart_edited.json',
    font: 'default',
  },
  {
    id: 1,
    title: 'Забери подарок!',
    titleText: '',
    subtitle: '',
    logo: 'https://kgloto.com/media/lottery/logos/2026/03/05/Frame_19.png',
    imageLive:
      'https://kgloto.com/media/lottery/live/2026/03/05/%D1%83%D0%B9%D0%B3%D0%BE_%D0%B1%D0%B5%D0%BB%D0%B5%D0%BA.jpg',
    mainPrize1: '3 x Ноутбук',
    mainPrize2: '8 x Смартфон Xiaomi',
    mainPrize3: '10 x Телевизоры 43 дюйма',
    prizeText: 'Ноутбук',
    buttonText: 'Играть',
    buttonPrice: 200,
    buttonLabel: 'ИГРАТЬ • 200 СОМ',
    buttonUrl: 'https://kgloto.com/lottery/1',
    drawTime: '16:50',
    theme: 'white',
    backgroundImage:
      'https://kgloto.com/media/lottery/backgrounds/2026/03/04/uigo_cart_edited.json',
    font: 'default',
  },
];

export default async function SuperJackpotPage() {
  // Теперь серверные переводы работают без проблем!
  const t = await getTranslations('populartickets');

  return (
    <div className='min-h-screen bg-[#F9F9F9] font-rubik pb-20'>
      <div className='max-w-350 mx-auto px-4 pt-6'>
        {/* ХЛЕБНЫЕ КРОШКИ */}
        <nav className='flex items-center gap-2 text-[12px] font-medium text-gray-500 mb-6'>
          <Link href='/' className='hover:text-[#2D2D2D] transition-colors'>
            Главная
          </Link>
          <span>/</span>
          <Link
            href='/draw-lotteries'
            className='hover:text-[#2D2D2D] transition-colors'
          >
            Тиражные лотереи
          </Link>
          <span>/</span>
          <span className='text-[#2D2D2D] font-bold'>Суперджекпот</span>
        </nav>

        {/* 🔥 КЛИЕНТСКАЯ ОБОЛОЧКА С ПЕРЕДАЧЕЙ СЕРВЕРНЫХ ПРОПСОВ */}
        <DrawTicketsClient
          // ТАБ 1: Билеты
          ticketsTab={
            <div className='mt-16 lg:mt-20'>
              <div className='mb-12'>
                <WinnersHistory />{' '}
                {/* Вызываем серверный компонент на сервере! */}
              </div>
              <DrawTicketsBlock />
            </div>
          }
          // ТАБ 2: Правила игры
          rulesTab={
            <>
              <DrawRulesBlock />
              <div className='mt-16 lg:mt-24'>
                <WinnersHistory />
              </div>
              <LotteryConditions terms={MOCK_TERMS} />
              <PopularTickets
                title={t('title') || 'Другие лотереи'}
                initialLotteries={MOCK_OTHER_LOTTERIES}
              />
            </>
          }
          // ТАБ 3: Архив тиражей
          archiveTab={
            <div className='mt-20 text-center text-gray-400 font-bold text-xl'>
              Здесь будет Архив тиражей...
            </div>
          }
        />
      </div>
    </div>
  );
}
