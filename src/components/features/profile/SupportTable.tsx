'use client';

import { StatusBadge } from './StatusBadge';

interface SupportTableProps {
  tickets: Array<{
    id: string;
    date: string;
    message: string;
    reply: string;
    status: string;
  }>;
}

export const SupportTable = ({ tickets }: SupportTableProps) => {
  return (
    <div className='hidden lg:block w-full overflow-x-auto'>
      <table className='w-full text-left border-collapse'>
        <thead>
          <tr className='text-[#4B4B4B] text-[20px] font-medium'>
            <th className='py-4 px-4 whitespace-nowrap w-[10%]'>№ Тикета</th>
            <th className='py-4 px-4 w-[30%]'>Сообщение</th>
            <th className='py-4 px-4 whitespace-nowrap w-[15%]'>
              Дата создания
            </th>
            <th className='py-4 px-4 whitespace-nowrap w-[15%]'>Статус</th>
            <th className='py-4 px-4 w-[30%]'>Ответ</th>
          </tr>
        </thead>
        <tbody className='text-base text-[#4B4B4B]'>
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              // 🔥 Задаем фиксированную высоту для всех строк
              className='even:bg-transparent odd:bg-[#FFF6F6] h-24'
            >
              <td className='px-5'>{ticket.id}</td>
              <td className='px-5 pr-10'>
                {/* 🔥 Ограничиваем текст до 2 строк, лишнее уходит в "..." */}
                <div className='line-clamp-2 leading-relaxed'>
                  {ticket.message}
                </div>
              </td>
              <td className='px-5'>{ticket.date}</td>
              <td className='px-5'>
                <StatusBadge status={ticket.status} />
              </td>
              <td className='px-5 pr-10'>
                {/* 🔥 То же самое для ответа */}
                <div className='line-clamp-2 leading-relaxed'>
                  {ticket.reply}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
