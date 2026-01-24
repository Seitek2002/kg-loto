import { LotteryCard } from '@/components/features/lottery/LotteryCard';

export const PopularTickets = () => {
  const lotteries = [
    {
      id: 1,
      title: 'Космический Старт',
      description:
        'Классическая лотерея. Темный фон, поэтому текст должен быть БЕЛЫМ автоматически.',
      prize: '1 000 000 KGS',
      price: 100,
      time: '20:00',
      // Темный синий -> Белый текст (Auto)
      gradientFrom: 'from-blue-600',
      gradientTo: 'to-indigo-900',
    },
    {
      id: 2,
      title: 'Золотая Лихорадка',
      description:
        'Яркий желтый фон. Текст и кнопка должны стать ЧЕРНЫМИ автоматически.',
      prize: '500 000 KGS',
      price: 200,
      time: '12:30',
      // Желтый/Оранжевый -> Темный текст (Auto: yellow/orange)
      gradientFrom: 'from-yellow-300',
      gradientTo: 'to-orange-400',
    },
    {
      id: 3,
      title: 'Лаймовый Фреш',
      description:
        'Кислотный салатовый фон. Текст обязан быть ЧЕРНЫМ для читаемости.',
      prize: 'IPHONE 17 PRO',
      price: 50,
      time: '15:00',
      // Лайм/Зеленый -> Темный текст (Auto: lime/300)
      gradientFrom: 'from-lime-300',
      gradientTo: 'to-green-400',
    },
    {
      id: 4,
      title: 'Белые Ночи',
      description:
        'Почти белый фон. Мы принудительно ставим theme="dark", чтобы текст был черным.',
      prize: 'TESLA MODEL 3',
      price: 500,
      time: '09:00',
      // Очень светлый серый -> Темный текст (Explicit)
      gradientFrom: 'from-gray-100',
      gradientTo: 'to-slate-200',
      theme: 'dark', // <-- Явное указание
    },
    {
      id: 5,
      title: 'Розовая Пантера',
      description: 'Яркий розовый. Текст должен остаться БЕЛЫМ.',
      prize: '50 000 KGS',
      price: 80,
      time: '18:45',
      // Розовый/Фуксия -> Белый текст (Auto: 500+)
      gradientFrom: 'from-pink-500',
      gradientTo: 'to-rose-600',
      theme: 'white', // <-- Явное указание (на всякий случай)
    },
    {
      id: 6,
      title: 'Морская Лагуна',
      description:
        'Светло-голубой (cyan). Текст должен стать ЧЕРНЫМ (как на воде).',
      prize: 'ТУР В ДУБАЙ',
      price: 300,
      time: '10:15',
      // Голубой -> Темный текст (Auto: cyan/sky)
      gradientFrom: 'from-cyan-300',
      gradientTo: 'to-sky-400',
    },
  ];

  return (
    <div>
      <h1 className='text-base font-bold text-[#4B4B4B] font-benzin uppercase'>
        Популярные лотереи
      </h1>
      <p className='text-xs text-[#6E6E6E] my-3'>
        Популярные лотереи привлекают внимание благодаря крупным джекпотам,
        частым тиражам и удобным условиям участия. Тысячи игроков ежедневно
        выбирают именно эти розыгрыши, чтобы испытать удачу и побороться за
        выигрыш.
      </p>

      {lotteries.map((loto) => (
        <LotteryCard
          key={loto.id}
          title={loto.title}
          description={loto.description}
          prize={loto.prize}
          price={loto.price}
          gradientFrom={loto.gradientFrom}
          gradientTo={loto.gradientTo}
        />
      ))}
    </div>
  );
};
