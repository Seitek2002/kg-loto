'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  TicketDetailCard,
  TicketDetailData, // Убедись, что этот тип экспортируется из компонента
} from '@/components/features/tickets/TicketDetailCard';

// Импортируем наши сторы и базу
import { useTicketsStore } from '@/store/tickets';
import { LOTTERIES_DB } from '@/data/mock-lotteries';

export default function TicketDetailPage() {
  const params = useParams();
  const id = params.id as string;

  // 1. Ищем купленный билет в сторе пользователя
  const userTicket = useTicketsStore((state) =>
    state.tickets.find((t) => t.id === id),
  );

  // 2. Собираем полные данные для карточки
  const ticketData: TicketDetailData | null = useMemo(() => {
    if (!userTicket) return null;

    // Находим дизайн лотереи (фон, шрифт) по ID лотереи
    const lotteryInfo = LOTTERIES_DB.find((l) => l.id === userTicket.lotteryId);

    // Если вдруг лотерея не найдена, берем дефолтную (чтобы не крашилось)
    const design = lotteryInfo || LOTTERIES_DB[0];

    // ВОЗВРАЩАЕМ ОБЪЕКТ В ФОРМАТЕ, КОТОРЫЙ ЖДЕТ TicketDetailCard
    return {
      id: userTicket.id,
      title: design.title, // Берем из базы лотерей
      ticketNumber: userTicket.ticketNumber, // Берем из билета пользователя
      price: design.price,
      buyDate: userTicket.purchaseDate,

      // Этих данных пока нет в сторе, ставим заглушки или берем из дизайна
      drawId: '000175',
      drawDate: '25 января 2026',
      location: 'г. Бишкек',
      drawTime: design.time,

      prizeAmount: design.prize,
      status: userTicket.status,

      // 🔥 Передаем новые параметры фона вместо градиентов
      // (В TicketDetailCard нужно будет поддержать backgroundId, сейчас поправим и его)
      theme: design.theme,
      backgroundId: design.backgroundId,
      prizeFontId: design.prizeFontId,
    };
  }, [userTicket]);

  if (!ticketData) {
    return (
      <div className='p-10 text-center text-gray-400'>Билет не найден</div>
    );
  }

  return (
    <div className='min-h-screen bg-[#F9F9F9] px-4 pt-2 pb-10'>
      {/* 1. Хедер */}
      <PageHeader title='БИЛЕТ' />

      {/* 2. Карточка */}
      <div className='mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500'>
        {/* Передаем собранные данные */}
        <TicketDetailCard data={ticketData} />
      </div>

      {/* 3. Подвал */}
      <div className='mt-8 text-center'>
        <p className='text-xs font-bold font-rubik text-[#2D2D2D]'>
          Правила игры?{' '}
          <Link href='/rules' className='text-[#FFD600] hover:underline'>
            Смотреть правила
          </Link>
        </p>
      </div>
    </div>
  );
}
