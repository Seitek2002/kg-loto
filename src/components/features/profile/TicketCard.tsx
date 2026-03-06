'use client';

import Image from 'next/image';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

interface TicketCardProps {
  prizeAmount: string;
  ticketName: string;
  price: number;
  date: string;
  logoSrc: string;
  status?: 'winning' | 'unchecked' | 'losing';
  badge?: { text: string; variant: 'success' | 'waiting' | 'processing' };
  showButton?: boolean;
  onReceive?: () => void;
}

export const TicketCard = ({
  prizeAmount,
  ticketName,
  price,
  date,
  logoSrc,
  status = 'winning',
  badge,
  showButton = true,
  onReceive,
}: TicketCardProps) => {
  // 🔥 Инициализируем переводы для карточки
  const t = useTranslations('ticket_card');

  // Умная логика проверки приза (определяем: деньги это или техника)
  const cleanAmount = prizeAmount.replace(/\s/g, ''); // убираем пробелы
  const isNumeric = !isNaN(Number(cleanAmount)) && cleanAmount !== '';
  const numericValue = isNumeric ? Number(cleanAmount) : 0;

  // Приз оранжевый, если это техника (!isNumeric) ИЛИ сумма >= 10 000
  const isHighlighted = !isNumeric || numericValue >= 10000;

  return (
    <div className='flex flex-col h-fit bg-white border border-[#909090] rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow'>
      {/* ВЕРХНЯЯ ЧАСТЬ (Скрывается для непроверенных билетов) */}
      {status !== 'unchecked' && (
        <div className='mb-4 border-b border-[#909090] pb-3 flex justify-between items-center'>
          <div>
            {status === 'losing' ? (
              <span className='text-xs sm:text-base text-[#EB5757] font-semibold block'>
                {t('status_loss')} {/* Проигрыш */}
              </span>
            ) : (
              <>
                <span className='text-xs sm:text-base text-[#4B4B4B] font-semibold mb-2 block'>
                  {t('your_prize')} {/* Ваш приз */}
                </span>
                <span
                  className={clsx(
                    'text-base sm:text-[32px] font-black whitespace-nowrap',
                    isHighlighted ? 'text-[#FF7600]' : 'text-[#4B4B4B]',
                  )}
                >
                  {prizeAmount}
                  {/* Добавляем "с" только если приз — это деньги */}
                  {isNumeric && (
                    <>
                      {' '}
                      <span className='underline decoration-2 underline-offset-4'>
                        с
                      </span>
                    </>
                  )}
                </span>
              </>
            )}
          </div>

          {/* Бейджик (для страницы призов) */}
          {badge && (
            <div
              className={clsx(
                'px-3 sm:px-3 py-2 rounded-full text-xs sm:text-base font-semibold whitespace-nowrap',
                badge.variant === 'success' && 'bg-[#C4FFD6] text-[#008236]',
                badge.variant === 'waiting' && 'bg-[#FFECC4] text-[#FF8D28]',
                badge.variant === 'processing' && 'bg-[#C4DCFF] text-[#0088FF]',
              )}
            >
              {badge.text}
            </div>
          )}
        </div>
      )}

      {/* ИНФОРМАЦИЯ О БИЛЕТЕ */}
      <div
        className={clsx(
          'flex justify-between items-center',
          status !== 'losing' && showButton && 'mb-6', // Убираем отступ, если кнопки нет
        )}
      >
        <div className='flex flex-col'>
          <h3 className='text-[18px] sm:text-[24px] font-semibold text-[#4B4B4B] mb-3.5'>
            {ticketName}
          </h3>
          <div className='text-xs md:text-base text-[#6E6E6E] flex flex-col gap-1.5'>
            <span>
              {t('price')}: {price}
            </span>{' '}
            {/* Стоимость: 500 */}
            <span>
              {t('purchase_date')}: {date}
            </span>{' '}
            {/* Дата покупки: 12.09.2026 */}
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

      {/* КНОПКА (Скрывается для проигрыша и на странице призов) */}
      {status !== 'losing' && showButton && (
        <button
          onClick={onReceive}
          className='w-full cursor-pointer bg-[#3D3D3D] text-white uppercase text-xs sm:text-[14px] font-medium py-3 rounded-full hover:bg-black active:scale-[0.98] transition-all'
        >
          {status === 'unchecked' ? t('btn_check') : t('btn_receive')}{' '}
          {/* ПРОВЕРИТЬ / ПОЛУЧИТЬ */}
        </button>
      )}
    </div>
  );
};
