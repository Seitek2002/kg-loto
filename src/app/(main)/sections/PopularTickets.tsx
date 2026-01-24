import { LotteryCard } from '@/components/features/lottery/LotteryCard';

export const PopularTickets = () => {
  const lotteries = [
    {
      id: 1,
      title: 'Название лотереи',
      description:
        'Популярные лотереи привлекают внимание благодаря крупным джекпотам, частым тиражам и удобным условиям участия.',
      prize: '1 000 000 KGS',
      price: 100,
      // Синий градиент (как card1.png)
      gradientFrom: 'from-blue-200',
      gradientTo: 'to-blue-500',
    },
    {
      id: 2,
      title: 'Название лотереи',
      description:
        'Популярные лотереи привлекают внимание благодаря крупным джекпотам...',
      prize: '150 000 KGS',
      price: 100,
      // Оранжево-фиолетовый (как card2.png)
      gradientFrom: 'from-orange-300 via-pink-400',
      gradientTo: 'to-indigo-500',
    },
    {
      id: 3,
      title: 'Золотой билет',
      description: 'Тысячи игроков ежедневно выбирают именно эти розыгрыши.',
      prize: '5 000 000 KGS',
      price: 200,
      // Желто-оранжевый (как card3.png)
      gradientFrom: 'from-yellow-300',
      gradientTo: 'to-orange-500',
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
