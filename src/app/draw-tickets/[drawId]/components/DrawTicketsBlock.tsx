'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';
import { useCurrentDraw, useTickets, TicketDto } from '@/entities/ticket/api';

const getTicketPlural = (count: number) => {
  const lastDigit = count % 10;
  const lastTwo = count % 100;
  if (lastTwo >= 11 && lastTwo <= 19) return 'билетов';
  if (lastDigit === 1) return 'билет';
  if (lastDigit >= 2 && lastDigit <= 4) return 'билета';
  return 'билетов';
};

interface TicketCardProps {
  ticketNumber: number | string;
  price: number;
  selectedNumbers: number[];
  isInBasket: boolean;
  onToggle: () => void;
}

const TicketCard = ({
  ticketNumber,
  price,
  selectedNumbers,
  isInBasket,
  onToggle,
}: TicketCardProps) => {
  const numbers = Array.from({ length: 36 }, (_, i) => i + 1);

  return (
    <div
      className={clsx(
        'bg-white rounded-3xl p-5 shadow-sm border flex flex-col relative transition-colors duration-300',
        isInBasket ? 'border-[#4B4B4B]' : 'border-gray-100',
      )}
    >
      <div className='absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#F9F9F9] rounded-full border-r border-gray-100' />
      <div className='absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#F9F9F9] rounded-full border-l border-gray-100' />

      <div className='flex font-benzin justify-between items-center border-b border-dashed border-gray-300 pb-4 mb-4'>
        <span className='text-gray-400 font-medium text-sm'>
          Билет №{ticketNumber}
        </span>
        <span className='font-bold text-[#4B4B4B] text-[15px]'>
          {price} <span className='underline'>с</span>
        </span>
      </div>

      <div className='grid grid-cols-6 gap-2 mb-6'>
        {numbers.map((num) => {
          const isSelected = selectedNumbers?.includes(num);
          return (
            <div
              key={num}
              className={clsx(
                'flex items-center justify-center aspect-square rounded-md text-[13px] font-bold transition-colors cursor-pointer',
                isSelected
                  ? 'bg-[#F58220] text-white shadow-sm'
                  : 'bg-[#F5F5F5] text-[#4B4B4B] hover:bg-gray-200',
              )}
            >
              {num}
            </div>
          );
        })}
      </div>

      <button
        onClick={onToggle}
        className={clsx(
          'w-full py-3.5 rounded-full font-bold text-xs uppercase transition-all active:scale-95 shadow-sm',
          isInBasket
            ? 'bg-[#4B4B4B] text-white hover:bg-[#4B4B4B]'
            : 'bg-[#F58220] text-white hover:bg-[#E5761A]', // 🔥 Убрали чередование, всегда оранжевая
        )}
      >
        {isInBasket ? 'Убрать' : `Играть • ${price} с`}
      </button>
    </div>
  );
};

// Скелетон для загрузки билетов
const TicketSkeleton = () => (
  <div className='bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col relative animate-pulse'>
    <div className='flex justify-between items-center border-b border-dashed border-gray-300 pb-4 mb-4'>
      <div className='w-24 h-4 bg-gray-200 rounded' />
      <div className='w-12 h-4 bg-gray-200 rounded' />
    </div>
    <div className='grid grid-cols-6 gap-2 mb-6'>
      {Array.from({ length: 36 }).map((_, i) => (
        <div key={i} className='aspect-square rounded-md bg-gray-100' />
      ))}
    </div>
    <div className='w-full h-10 bg-gray-200 rounded-full' />
  </div>
);

export const DrawTicketsBlock = ({ lotteryId }: { lotteryId: string }) => {
  const cartItems = useCartStore((state) => state.items);
  const toggleItem = useCartStore((state) => state.toggleItem);

  const [mounted, setMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // 1. Ищем активный тираж
  const { data: activeDraw, isLoading: isLoadingDraws } =
    useCurrentDraw(lotteryId);

  // 2. Грузим билеты для активного тиража
  const { data: ticketsData, isLoading: isLoadingTickets } = useTickets(
    {
      lotteryId: lotteryId,
      drawId: activeDraw?.drawId || '',
      limit: 30, // Изменил на 30, как в webview
    },
    !!activeDraw?.drawId,
  );

  // 🔥 ИСПРАВЛЕНА ТИПИЗАЦИЯ: Указали (t: TicketDto)
  const availableTickets =
    ticketsData?.tickets?.filter((t: TicketDto) => t.status === 'available') ||
    [];

  const basketIds = cartItems.map((item) => String(item.id));

  const superTickets = cartItems.filter((t) => t.type === 'super');
  const otherTickets = cartItems.filter((t) => t.type === 'other');

  const superCount = superTickets.length;
  const superSum = superTickets.reduce((acc, t) => acc + t.price, 0);
  const otherCount = otherTickets.length;
  const otherSum = otherTickets.reduce((acc, t) => acc + t.price, 0);
  const totalPrice = superSum + otherSum;

  const isLoading = isLoadingDraws || isLoadingTickets;

  return (
    <div>
      {/* СЕТКА БИЛЕТОВ */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10'>
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <TicketSkeleton key={i} />)
        ) : !activeDraw ? (
          <div className='col-span-full text-center py-20 bg-white rounded-4xl border border-gray-100 shadow-sm'>
            <h3 className='text-xl font-bold text-[#4B4B4B] mb-2'>
              Тираж закрыт
            </h3>
            <p className='text-gray-500'>
              В данный момент нет активных тиражей для этой лотереи.
            </p>
          </div>
        ) : availableTickets.length === 0 ? (
          <div className='col-span-full text-center py-20 bg-white rounded-4xl border border-gray-100 shadow-sm'>
            <h3 className='text-xl font-bold text-[#4B4B4B] mb-2'>
              Билеты раскуплены
            </h3>
            <p className='text-gray-500'>
              Дождитесь следующего тиража или выберите другую лотерею.
            </p>
          </div>
        ) : (
          availableTickets.map((ticket: TicketDto) => {
            // 🔥 Убрали index
            const type = 'other'; // Всегда один тип
            const ticketIdStr = String(ticket.ticketId);

            return (
              <TicketCard
                key={ticketIdStr}
                ticketNumber={ticket.ticketNumber || ticketIdStr.slice(-6)}
                price={ticket.price}
                selectedNumbers={ticket.combination || []}
                isInBasket={basketIds.includes(ticketIdStr)} // 🔥 Убрали isOrangeButton
                onToggle={() =>
                  toggleItem({
                    id: ticketIdStr,
                    price: ticket.price,
                    type: type as 'super' | 'other',
                    ticketNumber: ticket.ticketNumber || ticketIdStr.slice(-6),
                    combination: ticket.combination || [],
                    lotteryId: lotteryId,
                    drawId: activeDraw.drawId,
                    name: `Тираж №${activeDraw.drawNumber}`,
                  })
                }
              />
            );
          })
        )}
      </div>

      {!isLoading && availableTickets.length > 0 && (
        <div className='flex justify-center mb-35 lg:mb-25'>
          <button className='bg-transparent border border-[#A3A3A3] text-[#4B4B4B] font-medium py-3 px-12 rounded-full hover:bg-gray-50 active:scale-95 transition-all text-sm'>
            Посмотреть еще
          </button>
        </div>
      )}

      {/* ПАПКА КОРЗИНЫ */}
      {mounted &&
        cartItems.length > 0 &&
        createPortal(
          <>
            <div className='hidden lg:flex fixed bottom-0 left-0 right-0 bg-[#FFF7F0] border-t border-[#FEEEDF] z-100 shadow-[0_-15px_40px_-10px_rgba(245,130,32,0.15)] py-4 transition-all'>
              <div className='w-full mx-auto px-8 flex items-center justify-between'>
                <div className='flex items-center gap-6'>
                  <div className='flex gap-2 opacity-90'>
                    <span
                      className='font-benzin font-black text-[#F6C635] text-[11px] leading-tight italic drop-shadow-sm'
                      style={{ WebkitTextStroke: '0.5px #D4AF37' }}
                    >
                      СУПЕР
                      <br />
                      ДЖЕКПОТ
                    </span>
                  </div>

                  <div className='flex items-center gap-6 border border-gray-300 rounded-2xl px-5 py-2.5 bg-white/60'>
                    <div className='flex flex-col'>
                      <span className='text-[#737373] text-[11px] font-medium mb-0.5'>
                        Суперджекпот:
                      </span>
                      <span className='text-[#4B4B4B] font-bold text-[14px]'>
                        {superCount} {getTicketPlural(superCount)} / {superSum}{' '}
                        <span className='underline'>с</span>
                      </span>
                    </div>
                    <div className='w-px h-8 bg-gray-300'></div>
                    <div className='flex flex-col'>
                      <span className='text-[#737373] text-[11px] font-medium mb-0.5'>
                        Другой джекпот:
                      </span>
                      <span className='text-[#4B4B4B] font-bold text-[14px]'>
                        {otherCount} {getTicketPlural(otherCount)} / {otherSum}{' '}
                        <span className='underline'>с</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className='flex items-center gap-6'>
                  <div className='flex flex-col text-right'>
                    <span className='text-[#737373] text-[12px] font-medium mb-0.5'>
                      Итого:
                    </span>
                    <span className='text-[#4B4B4B] font-black text-[16px] leading-none'>
                      {cartItems.length} {getTicketPlural(cartItems.length)}{' '}
                      &bull; {totalPrice} <span className='underline'>с</span>
                    </span>
                  </div>
                  <Link href='/cart'>
                    <button className='bg-[#F58220] hover:bg-[#E5761A] text-white font-bold text-[14px] py-3.5 px-8 rounded-xl transition-colors shadow-md active:scale-95'>
                      {user ? 'Оплатить' : 'Войдите для покупки'}
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Мобильная корзина */}
            <div
              className={clsx(
                'flex lg:hidden fixed left-0 right-0 bg-[#F9F9F9] rounded-t-3xl z-100 shadow-[0_-15px_40px_-10px_rgba(245,130,32,0.2)] transition-all duration-300 flex-col overflow-hidden',
                isExpanded ? 'bottom-0' : 'bottom-0',
              )}
            >
              <div
                className='w-full pt-3 pb-2 flex justify-center cursor-pointer active:bg-gray-100 transition-colors'
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <div className='w-12 h-1.5 bg-gray-500 rounded-full'></div>
              </div>

              <div className='px-5 pb-5 flex items-center justify-between'>
                <div
                  className='flex flex-col'
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  <span className='text-[#737373] text-[12px] font-medium mb-1'>
                    Итого:
                  </span>
                  <span className='text-[#4B4B4B] font-black text-[16px] leading-none flex items-center gap-1.5'>
                    {cartItems.length} {getTicketPlural(cartItems.length)}{' '}
                    &bull; {totalPrice}{' '}
                    <span className='underline text-sm'>с</span>
                  </span>
                </div>
                <Link href='/cart'>
                  <button className='bg-[#F58220] hover:bg-[#E5761A] text-white font-bold text-[13px] py-3.5 px-5 rounded-xl transition-colors shadow-md active:scale-95 shrink-0'>
                    {user ? 'Оплатить' : 'Войдите для покупки'}
                  </button>
                </Link>
              </div>

              <div
                className={clsx(
                  'transition-all duration-300 ease-in-out border-gray-200',
                  isExpanded
                    ? 'max-h-75 opacity-100 border-t'
                    : 'max-h-0 opacity-0 border-transparent',
                )}
              >
                <div className='p-5 pt-4 bg-[#F9F9F9]'>
                  <div className='border border-gray-300 rounded-2xl p-4 bg-white flex flex-col gap-3.5 shadow-sm'>
                    <div className='flex justify-between items-center'>
                      <span className='text-gray-600 text-[13px] font-medium'>
                        Суперджекпот:
                      </span>
                      <span className='text-[#4B4B4B] font-bold text-[14px]'>
                        {superCount} {getTicketPlural(superCount)} / {superSum}{' '}
                        <span className='underline'>с</span>
                      </span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-gray-600 text-[13px] font-medium'>
                        Другой джекпот:
                      </span>
                      <span className='text-[#4B4B4B] font-bold text-[14px]'>
                        {otherCount} {getTicketPlural(otherCount)} / {otherSum}{' '}
                        <span className='underline'>с</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>,
          document.body,
        )}
    </div>
  );
};
