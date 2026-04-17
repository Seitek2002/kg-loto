import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

// Импорты блоков
import { DrawTicketsClient } from './components/DrawTicketsClient';
import { DrawRulesBlock } from './components/DrawRulesBlock';
import { DrawTicketsBlock } from './components/DrawTicketsBlock';
import { LotteryConditions } from '@/components/features/lottery-detail/LotteryConditions';
import { PopularTickets } from '@/widgets/PopularTickets';
import { WinnersHistory } from '@/widgets/WinnersHistory';
import { DrawArchiveBlock } from './components/DrawArchiveBlock';

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

interface PageProps {
  params: { id: string }; // 🔥 Получаем ID лотереи из URL (например, lotto-001)
}

export default async function SuperJackpotPage({ params }: PageProps) {
  const t = await getTranslations('populartickets');
  const lotteryId = params.id; // Достали ID

  return (
    <div className='min-h-screen bg-[#F9F9F9] font-rubik pb-20'>
      <div className='max-w-350 mx-auto px-4 pt-6'>
        {/* ХЛЕБНЫЕ КРОШКИ */}
        <nav className='flex items-center gap-2 text-[12px] font-medium text-[#737373] mb-6'>
          <Link href='/' className='hover:text-[#4B4B4B] transition-colors'>
            Главная
          </Link>
          <span>/</span>
          <Link
            href='/draw-tickets'
            className='hover:text-[#4B4B4B] transition-colors'
          >
            Тиражные лотереи
          </Link>
          <span>/</span>
          <span className='text-[#4B4B4B] font-bold'>Суперджекпот</span>
        </nav>

        {/* Передаем lotteryId в нужные блоки! */}
        <DrawTicketsClient
          // ТАБ 1: Билеты (Сюда прокинем ID, чтобы вытащить статус "open")
          ticketsTab={
            <div className='mt-16 lg:mt-20'>
              <div className='mb-12'>
                <WinnersHistory />
              </div>
              <DrawTicketsBlock lotteryId={lotteryId} />
            </div>
          }
          rulesTab={
            <>
              <DrawRulesBlock />
              <div className='mt-16 lg:mt-24'>
                <WinnersHistory />
              </div>
              <LotteryConditions terms={MOCK_TERMS} />
              <PopularTickets
                title={t('title') || 'Другие лотереи'}
                currentLotteryId={lotteryId}
              />
            </>
          }
          // ТАБ 3: Архив тиражей (Сюда прокинем ID, чтобы вытащить статусы "completed")
          archiveTab={<DrawArchiveBlock lotteryId={lotteryId} />}
        />
      </div>
    </div>
  );
}
