'use client';

import { QRCodeSVG } from 'qrcode.react';
import { BaseCard } from '@/components/ui/BaseCard';
import { clsx } from 'clsx';
import { TicketDetailData } from './TicketDetailCard';

export const TicketRulesCard = ({ data }: { data: TicketDetailData }) => {
  const isDark = data.theme === 'dark';
  const labelColor = isDark ? 'text-gray-600' : 'text-white/60';
  const valueColor = isDark ? 'text-[#2D2D2D]' : 'text-white';
  const borderColor = isDark ? 'border-gray-300/50' : 'border-white/20';

  return (
    <BaseCard
      backgroundId={data.backgroundId}
      theme={data.theme}
      className='h-full flex flex-col'
    >
      {/* Заголовок */}
      <h2
        className={clsx(
          'text-xl font-black font-benzin uppercase mb-6',
          valueColor,
        )}
      >
        ПРАВИЛА ИГРЫ
      </h2>

      {/* Инфо-блок (дублирует данные билета для удобства) */}
      <div className='flex flex-col gap-3 mb-8'>
        <Row
          label='Номер билета:'
          value={data.ticketNumber}
          lColor={labelColor}
          vColor={valueColor}
        />
        <Row
          label='Цена билета:'
          value={`${data.price} KGS`}
          lColor={labelColor}
          vColor={valueColor}
        />
        <Row
          label='Дата покупки:'
          value={data.buyDate}
          lColor={labelColor}
          vColor={valueColor}
        />

        <div className={clsx('h-px w-full my-2', borderColor)} />

        <Row
          label='Тираж №:'
          value={data.drawId}
          lColor={labelColor}
          vColor={valueColor}
        />
        <Row
          label='Дата тиража:'
          value={data.drawDate}
          lColor={labelColor}
          vColor={valueColor}
        />
      </div>

      {/* Текст правил */}
      <p
        className={clsx('text-xs font-rubik leading-relaxed mb-8', labelColor)}
      >
        Популярные лотереи привлекают внимание благодаря крупным джекпотам,
        частым тиражам и удобным условиям участия. Тысячи игроков ежедневно
        выбирают именно эти розыгрыши.
      </p>

      {/* QR Код и Footer */}
      <div className='mt-auto pt-6 border-t border-white/10 flex items-end justify-between'>
        <div className='bg-white p-2 rounded-xl'>
          {/* Генерируем QR с ID билета */}
          <QRCodeSVG value={`https://kgloto.kg/check/${data.id}`} size={80} />
        </div>
      </div>
    </BaseCard>
  );
};

// Мини-компонент строки (можно вынести в отдельный файл, чтобы не дублировать)
const Row = ({ label, value, lColor, vColor }: any) => (
  <div className='flex justify-between items-center'>
    <span className={clsx('text-xs font-bold font-rubik', lColor)}>
      {label}
    </span>
    <span className={clsx('text-xs font-bold font-rubik text-right', vColor)}>
      {value}
    </span>
  </div>
);
