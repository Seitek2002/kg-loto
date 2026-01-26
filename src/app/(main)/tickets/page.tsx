import { TicketFilters } from '@/components/features/tickets/TicketFilters';
import { LotteryCard } from '@/components/features/lottery/GameCard';
import { PageHeader } from '@/components/ui/PageHeader';

export default function TicketsPage() {
  return (
    <div className='min-h-screen bg-[#F9F9F9] px-4 pt-2 pb-32'>
      {' '}
      {/* pb-32 отступ под меню */}
      {/* 1. Хедер */}
      <PageHeader title='БИЛЕТЫ' />
      {/* 2. Фильтры */}
      <div className='mt-4 mb-8'>
        <TicketFilters />
      </div>
      {/* 3. Список билетов */}
      <div className='flex flex-col gap-6'>
        {/* Карточка 1: Желтая (как на макете) */}
        {/* Используем theme="dark", чтобы текст был черным */}
        <LotteryCard
          title='Название лотереи'
          description='Популярные лотереи привлекают внимание благодаря крупным джекпотам...'
          prize='1 000 000 KGS'
          price={100}
          time='14:56'
          gradientFrom='from-yellow-400'
          gradientTo='to-orange-500'
          theme='dark'
        />

        {/* Карточка 2: Синяя с 3D картинкой (как на макете) */}
        {/* Я подобрал похожую картинку с Unsplash (синие подарки) */}
        <LotteryCard
          title='Название лотереи'
          description='Популярные лотереи привлекают внимание благодаря крупным джекпотам...'
          prize='1 000 000 KGS'
          price={100}
          time='14:56'
          imageSrc='https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop'
          theme='white' // Текст белый поверх картинки
        />
      </div>
    </div>
  );
}
