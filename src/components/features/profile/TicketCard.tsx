'use client';

import Image from 'next/image';
import { clsx } from 'clsx'; // 🔥 Добавил clsx для удобного скрытия отступов

interface TicketCardProps {
  prizeAmount: string;
  ticketName: string;
  price: number;
  date: string;
  logoSrc: string;
  status?: 'winning' | 'unchecked' | 'losing';
  onReceive?: () => void;
}

export const TicketCard = ({
  prizeAmount,
  ticketName,
  price,
  date,
  logoSrc,
  status = 'winning',
  onReceive,
}: TicketCardProps) => {
  return (
    // 🔥 h-fit не дает проигрышной карточке растягиваться по высоте соседей
    <div className='flex flex-col h-fit bg-white border border-[#909090] rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow'>
      {/* 🔥 ВЕРХНЯЯ ЧАСТЬ (Скрываем ПОЛНОСТЬЮ для непроверенных билетов) */}
      {status !== 'unchecked' && (
        <div className='mb-4 border-b border-[#909090] pb-3'>
          {status === 'losing' ? (
            <span className='text-xs sm:text-base text-[#EB5757] font-semibold block'>
              Проигрыш
            </span>
          ) : (
            <>
              <span className='text-xs sm:text-base text-[#4B4B4B] font-semibold mb-2 block'>
                Ваш приз
              </span>
              <span className='text-base sm:text-[32px] font-black text-[#FF7600] whitespace-nowrap'>
                {prizeAmount}{' '}
                <span className='underline decoration-2 underline-offset-4'>
                  с
                </span>
              </span>
            </>
          )}
        </div>
      )}

      {/* ИНФОРМАЦИЯ О БИЛЕТЕ */}
      {/* Убираем нижний отступ (mb-6), если кнопки нет (статус losing), чтобы карточка была компактнее */}
      <div
        className={clsx(
          'flex justify-between items-center',
          status !== 'losing' && 'mb-6',
        )}
      >
        <div className='flex flex-col'>
          <h3 className='text-[18px] sm:text-[24px] font-semibold text-[#4B4B4B] mb-3.5'>
            {ticketName}
          </h3>
          <div className='text-xs md:text-base text-[#6E6E6E] flex flex-col gap-1.5'>
            <span>Стоимость: {price}</span>
            <span>Дата покупки: {date}</span>
          </div>
        </div>
        <div className='relative max-w-29.75 shrink-0 ml-3'>
          <Image
            src={logoSrc}
            alt={ticketName}
            width={120}
            height={100}
            className='object-contain'
          />
        </div>
      </div>

      {/* КНОПКА (Скрываем, если проигрыш) */}
      {status !== 'losing' && (
        <button
          onClick={onReceive}
          className='w-full cursor-pointer bg-[#3D3D3D] text-white uppercase text-xs sm:text-[14px] font-medium py-3 rounded-full hover:bg-black active:scale-[0.98] transition-all'
        >
          {status === 'unchecked' ? 'ПРОВЕРИТЬ' : 'ПОЛУЧИТЬ'}
        </button>
      )}
    </div>
  );
};
