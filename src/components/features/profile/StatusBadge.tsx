'use client';

import { clsx } from 'clsx';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

export const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    resolved: {
      text: 'Ответ получен',
      bg: 'bg-[#C4FFD6]',
      textCol: 'text-[#008236]',
      Icon: CheckCircle2,
    },
    processing: {
      text: 'В обработке',
      bg: 'bg-[#FFECC4]',
      textCol: 'text-[#FF8D28]',
      Icon: Clock,
    },
    rejected: {
      text: 'Отклонено',
      bg: 'bg-[#FFEBEB]',
      textCol: 'text-[#EB5757]',
      Icon: XCircle,
    },
  }[status] || {
    text: 'Неизвестно',
    bg: 'bg-gray-100',
    textCol: 'text-gray-500',
    Icon: Clock,
  };

  const { text, bg, textCol, Icon } = config;

  return (
    <div
      className={clsx(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap',
        bg,
        textCol,
      )}
    >
      <Icon size={14} className='shrink-0' />
      <span>{text}</span>
    </div>
  );
};
