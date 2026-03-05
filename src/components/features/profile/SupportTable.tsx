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
        <tbody className='text-[13px]'>
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              className='odd:bg-transparent even:bg-[#FFF6F6] text-[#4B4B4B]'
            >
              <td className='py-5 px-4 font-semibold'>{ticket.id}</td>
              <td className='py-5 px-4 pr-10 leading-relaxed text-[#6E6E6E]'>
                {ticket.message}
              </td>
              <td className='py-5 px-4 text-[#6E6E6E]'>{ticket.date}</td>
              <td className='py-5 px-4'>
                <StatusBadge status={ticket.status} />
              </td>
              <td className='py-5 px-4 pr-10 leading-relaxed text-[#6E6E6E]'>
                {ticket.reply}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
