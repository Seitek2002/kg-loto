'use client';

import { StatusBadge } from './StatusBadge';

interface SupportCardProps {
  ticket: {
    id: string;
    date: string;
    message: string;
    reply: string;
    status: string;
  };
}

export const SupportCard = ({ ticket }: SupportCardProps) => {
  return (
    <div className='flex flex-col bg-white border border-[#E5E5E5] rounded-[20px] p-5 shadow-sm'>
      <div className='mb-4'>
        <StatusBadge status={ticket.status} />
      </div>

      <div className='flex flex-col gap-2.5 border-b border-[#E5E5E5] pb-4 mb-4'>
        <div className='flex justify-between items-center'>
          <span className='text-xs text-[#6E6E6E]'>№ Тикета</span>
          <span className='text-[13px] font-bold text-[#2D2D2D]'>
            {ticket.id}
          </span>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-xs text-[#6E6E6E]'>Дата создания</span>
          <span className='text-[13px] font-bold text-[#2D2D2D]'>
            {ticket.date}
          </span>
        </div>
      </div>

      <div className='flex flex-col gap-1.5 mb-4'>
        <span className='text-[13px] font-bold text-[#2D2D2D]'>Сообщение</span>
        <p className='text-xs text-[#4B4B4B] leading-relaxed'>
          {ticket.message}
        </p>
      </div>

      <div className='flex flex-col gap-1.5'>
        <span className='text-[13px] font-bold text-[#2D2D2D]'>Ответ</span>
        <p className='text-xs text-[#4B4B4B] leading-relaxed'>{ticket.reply}</p>
      </div>
    </div>
  );
};
