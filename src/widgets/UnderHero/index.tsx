import { WinnersMarquee, WinnerType } from './WinnersMarquee';

// Данные лежат на сервере
const RECENT_WINNERS: WinnerType[] = [
  {
    id: 1,
    name: 'Азамат Д.',
    date: 'Сегодня',
    amount: '700',
    currency: 'С',
    logo: '/lotteries-logo/1.png',
    isYellow: false,
  },
  {
    id: 2,
    name: 'Айнура С.',
    date: 'Сегодня',
    amount: '7 105 000',
    currency: 'С',
    logo: '/lotteries-logo/2.png',
    isYellow: false,
  },
  {
    id: 3,
    name: 'Бектур А.',
    date: 'Вчера',
    amount: '700 000',
    currency: 'С',
    logo: '/lotteries-logo/3.png',
    isYellow: true,
  },
  {
    id: 4,
    name: 'Нурлан К.',
    date: 'Вчера',
    amount: '3 000',
    currency: 'С',
    logo: '/lotteries-logo/1.png',
    isYellow: false,
  },
  {
    id: 5,
    name: 'Гульзат М.',
    date: 'Вчера',
    amount: '6 700',
    currency: 'С',
    logo: '/lotteries-logo/2.png',
    isYellow: true,
  },
  {
    id: 6,
    name: 'Руслан Т.',
    date: 'Сегодня',
    amount: '15 000',
    currency: 'С',
    logo: '/lotteries-logo/3.png',
    isYellow: false,
  },
  {
    id: 7,
    name: 'Эрмек Б.',
    date: 'Вчера',
    amount: '50 000',
    currency: 'С',
    logo: '/lotteries-logo/1.png',
    isYellow: false,
  },
];

const UnderHero = () => {
  return (
    <section className='mx-auto relative py-12 overflow-hidden'>
      <h2 className='max-w-300 pl-4 mx-auto text-2xl md:text-3xl font-black font-benzin uppercase text-[#1C2035] mb-8'>
        Недавние победители
      </h2>

      {/* Передаем серверные данные в клиентский компонент */}
      <WinnersMarquee winners={RECENT_WINNERS} />
    </section>
  );
};

export default UnderHero;
