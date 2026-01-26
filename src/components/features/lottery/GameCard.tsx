import Link from 'next/link';
import { Clock } from 'lucide-react';
import { clsx } from 'clsx';
import { BaseCard } from '@/components/ui/BaseCard'; // Убедись, что путь правильный

interface LotteryCardProps {
  title: string;
  description: string;
  price?: number;
  prize: string;

  gradientFrom?: string;
  gradientTo?: string;
  imageSrc?: string;
  time?: string;
  theme?: 'white' | 'dark';

  variant?: 'lottery' | 'prize';
  status?: 'received' | 'waiting';
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
  variant = 'lottery',
  status,
}: LotteryCardProps) {
  let finalTheme: 'dark' | 'white';

  if (theme) {
    finalTheme = theme;
  } else if (imageSrc) {
    finalTheme = 'white'; // На картинках обычно белый текст читается лучше
  } else {
    finalTheme = isLightBackground(gradientFrom) ? 'dark' : 'white';
  }

  const isDark = finalTheme === 'dark';

  const descriptionColor = isDark ? 'text-gray-700' : 'text-white/90';

  const badgeBg = isDark
    ? 'bg-black/10 border-black/5'
    : 'bg-white/20 border-white/10';
  const badgeText = isDark ? 'text-gray-900' : 'text-white';

  const buttonClass = isDark
    ? 'bg-gray-900 text-white hover:bg-gray-800'
    : 'bg-white text-gray-900 hover:bg-gray-50';

  const isReceived = status === 'received';
  const statusDotColor = isReceived ? 'bg-green-400' : 'bg-yellow-400';
  const statusText = isReceived ? 'получен' : 'ожидает';

  return (
    <BaseCard
      gradientFrom={gradientFrom}
      gradientTo={gradientTo}
      imageSrc={imageSrc}
      theme={finalTheme}
      className='mb-4'
      minHeight={variant === 'prize' ? '240px' : '320px'}
    >
      <div className='w-fit mb-4'>
        <div
          className={clsx(
            'flex items-center gap-1.5 backdrop-blur-md px-3 py-1.5 rounded-full border',
            badgeBg,
          )}
        >
          {variant === 'lottery' ? (
            // Лотерея: Часики
            <>
              <Clock size={14} className={badgeText} strokeWidth={2.5} />
              <span
                className={clsx('font-bold text-sm tracking-wide', badgeText)}
              >
                {time}
              </span>
            </>
          ) : (
            // Приз: Статус
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

      {/* 2. ТЕКСТЫ */}
      <div className='mb-auto'>
        {/* Заголовок (цвет наследуется от BaseCard, но можно переопределить) */}
        <h3 className='text-sm font-black uppercase tracking-wide mb-3 font-benzin opacity-100'>
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

      <div className={clsx('mt-6', variant === 'lottery' ? 'mb-6' : 'mb-0')}>
        <span className='block font-benzin text-[32px] leading-none font-black uppercase tracking-tight drop-shadow-sm'>
          {prize}
        </span>
      </div>

      {variant === 'lottery' && price && (
        <Link href='/check-ticket' className='block w-full'>
          <button
            className={clsx(
              'w-full rounded-full py-4 px-6 transition-all active:scale-[0.98] shadow-lg shadow-black/5',
              buttonClass,
            )}
          >
            <span className='font-extrabold text-xs uppercase'>
              Играть • {price} сом
            </span>
          </button>
        </Link>
      )}
    </BaseCard>
  );
}

// Вспомогательная функция определения светлоты (осталась без изменений)
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
    'pink-100',
    'purple-200',
  ];
  if (lightColors.some((c) => colorClass.includes(c))) {
    if (
      colorClass.includes('-900') ||
      colorClass.includes('-800') ||
      colorClass.includes('-950') ||
      colorClass.includes('-700')
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
