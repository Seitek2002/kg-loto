'use client';

import { clsx } from 'clsx';

// 🔥 Создаем интерфейс для пропсов карточки
interface TicketCardProps {
  ticketNumber: number | string;
  price: number;
  selectedNumbers: number[];
  isOrangeButton: boolean;
}

// Заменяем any на TicketCardProps
const TicketCard = ({
  ticketNumber,
  price,
  selectedNumbers,
  isOrangeButton,
}: TicketCardProps) => {
  const numbers = Array.from({ length: 36 }, (_, i) => i + 1);

  return (
    <div className='bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col relative'>
      <div className='absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#F9F9F9] rounded-full border-r border-gray-100' />
      <div className='absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#F9F9F9] rounded-full border-l border-gray-100' />

      <div className='flex justify-between items-center border-b border-dashed border-gray-300 pb-4 mb-4'>
        <span className='text-gray-400 font-medium text-sm'>
          Билет №{ticketNumber}
        </span>
        <span className='font-bold text-[#2D2D2D] text-[15px]'>
          {price} <span className='underline'>с</span>
        </span>
      </div>

      <div className='grid grid-cols-6 gap-2 mb-6'>
        {numbers.map((num) => {
          const isSelected = selectedNumbers.includes(num);
          return (
            <div
              key={num}
              className={clsx(
                'flex items-center justify-center aspect-square rounded-md text-[13px] font-bold transition-colors cursor-pointer',
                isSelected
                  ? 'bg-[#F58220] text-white shadow-sm'
                  : 'bg-[#F5F5F5] text-[#2D2D2D] hover:bg-gray-200',
              )}
            >
              {num}
            </div>
          );
        })}
      </div>

      <button
        className={clsx(
          'w-full py-3.5 rounded-full font-bold text-xs uppercase transition-transform active:scale-95 shadow-sm',
          isOrangeButton
            ? 'bg-[#F58220] text-white hover:bg-[#E5761A]'
            : 'bg-[#4B4B4B] text-white hover:bg-[#3A3A3A]',
        )}
      >
        Играть • 100 с
      </button>
    </div>
  );
};

export const DrawTicketsBlock = () => {
  // TypeScript теперь сам поймет типы этих объектов
  const mockTickets = [
    { id: 1, selected: [1, 16, 26, 30], isOrange: false },
    { id: 2, selected: [1, 16, 26, 30], isOrange: true },
    { id: 3, selected: [1, 16, 26, 30], isOrange: true },
    { id: 4, selected: [1, 16, 26, 30], isOrange: true },
    { id: 5, selected: [1, 16, 26, 30], isOrange: false },
    { id: 6, selected: [1, 16, 26, 30], isOrange: true },
  ];

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10'>
        {mockTickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticketNumber={ticket.id}
            price={150}
            selectedNumbers={ticket.selected}
            isOrangeButton={ticket.isOrange}
          />
        ))}
      </div>

      <div className='flex justify-center'>
        <button className='bg-transparent border border-[#A3A3A3] text-[#4B4B4B] font-medium py-3 px-12 rounded-full hover:bg-gray-50 active:scale-95 transition-all text-sm'>
          Посмотреть еще
        </button>
      </div>
    </div>
  );
};
