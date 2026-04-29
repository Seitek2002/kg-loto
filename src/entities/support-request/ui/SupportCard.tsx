"use client";
import { StatusBadge } from "./StatusBadge";

interface SupportCardProps {
  request: {
    id: string;
    date: string;
    message: string;
    reply: string;
    status: string;
  };
}

export const SupportCard = ({ request }: SupportCardProps) => (
  <div className="flex flex-col bg-white border border-[#E5E5E5] rounded-[20px] p-5 shadow-sm">
    <div className="mb-4">
      <StatusBadge status={request.status} />
    </div>
    <div className="flex flex-col gap-2.5 border-b border-[#E5E5E5] pb-4 mb-4">
      <div className="flex justify-between items-center">
        <span className="text-xs text-[#6E6E6E]">№ Обращения</span>
        <span className="text-[13px] font-bold text-[#4B4B4B]">
          {request.id}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-[#6E6E6E]">Дата создания</span>
        <span className="text-[13px] font-bold text-[#4B4B4B]">
          {request.date}
        </span>
      </div>
    </div>
    <div className="flex flex-col gap-1.5 mb-4">
      <span className="text-[13px] font-bold text-[#4B4B4B]">Сообщение</span>
      <p className="text-xs text-[#4B4B4B] leading-relaxed">
        {request.message}
      </p>
    </div>
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] font-bold text-[#4B4B4B]">Ответ</span>
      <p className="text-xs text-[#4B4B4B] leading-relaxed">{request.reply}</p>
    </div>
  </div>
);
