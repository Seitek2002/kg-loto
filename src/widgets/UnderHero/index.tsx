import { getTranslations } from 'next-intl/server';
import { WinnersMarquee, WinnerType } from './WinnersMarquee';
import { Title } from '@/components/ui/Title';

const UnderHero = async () => {
  const t = await getTranslations('home');

  const RECENT_WINNERS: WinnerType[] = [
    {
      id: 1,
      name: 'Азамат Д.',
      date: t('today'), // Сегодня
      amount: '700',
      currency: 'С',
      logo: '/lotteries-logo/1.png',
      isYellow: false,
    },
    {
      id: 2,
      name: 'Айнура С.',
      date: t('today'),
      amount: '7 105 000',
      currency: 'С',
      logo: '/lotteries-logo/2.png',
      isYellow: false,
    },
    {
      id: 3,
      name: 'Бектур А.',
      date: t('yesterday'), // Вчера
      amount: '700 000',
      currency: 'С',
      logo: '/lotteries-logo/3.png',
      isYellow: true,
    },
    {
      id: 4,
      name: 'Нурлан К.',
      date: t('yesterday'),
      amount: '3 000',
      currency: 'С',
      logo: '/lotteries-logo/1.png',
      isYellow: false,
    },
    {
      id: 5,
      name: 'Гульзат М.',
      date: t('yesterday'),
      amount: '6 700',
      currency: 'С',
      logo: '/lotteries-logo/2.png',
      isYellow: true,
    },
    {
      id: 6,
      name: 'Руслан Т.',
      date: t('today'),
      amount: '15 000',
      currency: 'С',
      logo: '/lotteries-logo/3.png',
      isYellow: false,
    },
    {
      id: 7,
      name: 'Эрмек Б.',
      date: t('yesterday'),
      amount: '50 000',
      currency: 'С',
      logo: '/lotteries-logo/1.png',
      isYellow: false,
    },
  ];

  return (
    <section className='mx-auto relative py-12 overflow-hidden'>
      <div className='pl-4 uppercase mb-8 max-w-300 mx-auto'>
        <Title>
          {t('recent_winners_title')}
        </Title>
      </div>

      <WinnersMarquee winners={RECENT_WINNERS} />
    </section>
  );
};

export default UnderHero;
