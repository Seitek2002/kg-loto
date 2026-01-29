import Link from 'next/link'; // <--- Импортируем Link
import { LotteryCard } from '@/components/features/lottery/GameCard';
import { Description } from '@/components/ui/Description';
import { Title } from '@/components/ui/Title';

export const PopularTickets = () => {
  const lotteries = [
    {
      id: 1,
      title: 'Космический Старт',
      description: 'Классическая лотерея. Темный фон...',
      prize: '1 000 000 KGS',
      price: 100,
      time: '20:00',
      gradientFrom: 'from-blue-600',
      gradientTo: 'to-indigo-900',
    },
    {
      id: 2,
      title: 'Золотая Лихорадка',
      description: 'Яркий желтый фон...',
      prize: '500 000 KGS',
      price: 200,
      time: '12:30',
      gradientFrom: 'from-yellow-300',
      gradientTo: 'to-orange-400',
    },
    // ... твои остальные лотереи ...
  ];

  return (
    <div>
      <Title>Популярные лотереи</Title>
      <Description>
        Популярные лотереи привлекают внимание благодаря крупным джекпотам,
        частым тиражам и удобным условиям участия...
      </Description>

      <div className='flex flex-col gap-4'>
        {lotteries.map((loto) => (
          <Link
            key={loto.id}
            href={`/lottery/${loto.id}`}
            className='block transition-transform active:scale-[0.98]'
          >
            <LotteryCard
              title={loto.title}
              description={loto.description}
              prize={loto.prize}
              price={loto.price}
              time={loto.time} // Не забудь передать время, если оно есть в пропсах LotteryCard
              gradientFrom={loto.gradientFrom}
              gradientTo={loto.gradientTo}
              // Если у тебя в массиве есть theme, передавай и его
              // theme={loto.theme}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};
