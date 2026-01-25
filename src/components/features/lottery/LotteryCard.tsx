import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { clsx } from 'clsx';

interface LotteryCardProps {
  // Основные данные
  title: string;
  description: string;
  price?: number; // Для лотереи
  prize: string;

  // Внешний вид
  gradientFrom?: string;
  gradientTo?: string;
  imageSrc?: string;
  time?: string;
  theme?: 'white' | 'dark';

  // 🔥 НОВЫЕ ПРОПЫ ДЛЯ УНИВЕРСАЛЬНОСТИ
  variant?: 'lottery' | 'prize'; // 'lottery' по умолчанию
  status?: 'received' | 'waiting'; // Только для variant='prize'
}

export function LotteryCard({
  title,
  description,
  price,
  prize,
  gradientFrom = 'from-blue-400',
  gradientTo = 'to-blue-600',
  imageSrc,
  time = '14:56',
  theme,
  variant = 'lottery', // По дефолту - игровая карточка
  status,
}: LotteryCardProps) {
  // 1. Логика определения цвета (твоя, без изменений)
  let isTextDark: boolean;
  if (theme) {
    isTextDark = theme === 'dark';
  } else if (imageSrc) {
    isTextDark = false;
  } else {
    isTextDark = isLightBackground(gradientFrom);
  }

  const textColor = isTextDark ? 'text-gray-900' : 'text-white';
  const descriptionColor = isTextDark ? 'text-gray-700' : 'text-white/90';

  // Фон для бейджей
  const badgeBg = isTextDark
    ? 'bg-black/10 border-black/5'
    : 'bg-white/20 border-white/10';
  const badgeText = isTextDark ? 'text-gray-900' : 'text-white';

  // 2. Логика для статуса приза
  const isReceived = status === 'received';
  const statusDotColor = isReceived ? 'bg-green-400' : 'bg-yellow-400';
  const statusText = isReceived ? 'получен' : 'ожидает';

  return (
    <div
      className={clsx(
        'relative w-full rounded-[32px] p-6 mb-4 flex flex-col justify-between shadow-xl overflow-hidden',
        !imageSrc && `bg-gradient-to-br ${gradientFrom} ${gradientTo}`,
      )}
      style={{ minHeight: variant === 'prize' ? '240px' : '320px' }} // Призы могут быть чуть компактнее
    >
      {/* ФОН */}
      {imageSrc && (
        <>
          <Image src={imageSrc} alt={title} fill className='object-cover z-0' />
          {!isTextDark && <div className='absolute inset-0 bg-black/40 z-0' />}
        </>
      )}

      {/* ВЕРХНИЙ БЕЙДЖ: Меняется в зависимости от варианта */}
      <div className='relative z-10 w-fit mb-4'>
        <div
          className={clsx(
            'flex items-center gap-1.5 backdrop-blur-md px-3 py-1.5 rounded-full border',
            badgeBg,
          )}
        >
          {variant === 'lottery' ? (
            // Лотерея: Часики + Время
            <>
              <Clock size={14} className={badgeText} strokeWidth={2.5} />
              <span
                className={clsx('font-bold text-sm tracking-wide', badgeText)}
              >
                {time}
              </span>
            </>
          ) : (
            // Приз: Точка + Статус
            <>
              <div
                className={clsx(
                  'w-2 h-2 rounded-full shadow-sm',
                  statusDotColor,
                )}
              />
              <span
                className={clsx(
                  'font-bold text-[10px] uppercase tracking-wider font-benzin',
                  badgeText,
                )}
              >
                {statusText}
              </span>
            </>
          )}
        </div>
      </div>

      {/* ТЕКСТЫ */}
      <div className='relative z-10 mb-auto'>
        <h3
          className={clsx(
            'text-sm font-black uppercase tracking-wide mb-3 font-benzin',
            textColor,
          )}
        >
          {title}
        </h3>
        <p
          className={clsx(
            'text-xs leading-relaxed font-medium font-rubik',
            descriptionColor,
          )}
        >
          {description}
        </p>
      </div>

      {/* ЦЕНА / ПРИЗ */}
      <div
        className={clsx(
          'relative z-10 mt-6',
          variant === 'lottery' ? 'mb-6' : 'mb-0',
        )}
      >
        <span
          className={clsx(
            'block font-benzin text-[32px] leading-none font-black uppercase tracking-tight drop-shadow-sm',
            textColor,
          )}
        >
          {prize}
        </span>
      </div>

      {/* КНОПКА (Только для лотереи) */}
      {variant === 'lottery' && price && (
        <Link href='/check-ticket' className='relative z-10 block w-full'>
          <button
            className={clsx(
              'w-full rounded-full py-4 px-6 transition-all active:scale-[0.98] shadow-lg shadow-black/5',
              isTextDark
                ? 'bg-gray-900 text-white hover:bg-gray-800'
                : 'bg-white text-gray-900 hover:bg-gray-50',
            )}
          >
            <span className='font-extrabold text-xs uppercase'>
              Играть • {price} сом
            </span>
          </button>
        </Link>
      )}
    </div>
  );
}

// Вспомогательная функция (оставляем как есть)
function isLightBackground(colorClass: string): boolean {
  const lightColors = [
    'white',
    'yellow',
    'lime',
    'amber',
    'orange',
    'cyan',
    'sky-300',
    'sky-200',
  ];
  if (lightColors.some((c) => colorClass.includes(c))) {
    if (
      colorClass.includes('-900') ||
      colorClass.includes('-800') ||
      colorClass.includes('-950')
    )
      return false;
    return true;
  }
  const match = colorClass.match(/-(\d{2,3})/);
  if (match) {
    return parseInt(match[1]) < 500;
  }
  return false;
}
