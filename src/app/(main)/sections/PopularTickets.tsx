import Link from 'next/link';
import { LotteryCard } from '@/components/features/lottery/GameCard';
import { Description } from '@/components/ui/Description';
import { Title } from '@/components/ui/Title';
import { LOTTERIES_DB } from '@/data/mock-lotteries'; // <--- Импорт базы

export const PopularTickets = () => {
  return (
    <div>
      <Title>Популярные лотереи</Title>
      <Description>
        Популярные лотереи привлекают внимание благодаря крупным джекпотам...
      </Description>

      <div className='flex flex-col gap-4'>
        {LOTTERIES_DB.map((loto) => (
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
              time={loto.time}
              gradientFrom={loto.gradientFrom}
              gradientTo={loto.gradientTo}
              theme={loto.theme}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};
