import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { clsx } from 'clsx';

interface LotteryCardProps {
  title: string;
  description: string;
  price: number;
  prize: string;
  gradientFrom?: string;
  gradientTo?: string;
  imageSrc?: string;
  time?: string;

  // 🔥 НОВЫЙ ПРОП: Явное управление темой текста
  // 'white' = белый текст (для темных фонов)
  // 'dark' = темный текст (для светлых фонов/желтого)
  theme?: 'white' | 'dark';
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
  theme, // Достаем тему
}: LotteryCardProps) {
  let isTextDark: boolean;

  if (theme) {
    // 1. Если тема передана явно — слушаемся её
    isTextDark = theme === 'dark';
  } else if (imageSrc) {
    // 2. Если есть картинка (и нет темы), по умолчанию текст белый (так как есть затемнение)
    isTextDark = false;
  } else {
    // 3. Если ничего не передано — пробуем угадать по градиенту
    isTextDark = isLightBackground(gradientFrom);
  }

  // Цвет основного текста
  const textColor = isTextDark ? 'text-gray-900' : 'text-white';
  const descriptionColor = isTextDark ? 'text-gray-700' : 'text-white/90';

  // Цвет бейджа (полупрозрачная подложка)
  const badgeBg = isTextDark
    ? 'bg-black/10 border-black/5'
    : 'bg-white/20 border-white/10';
  const badgeText = isTextDark ? 'text-gray-900' : 'text-white';

  // Цвет кнопки (инверсия для контраста)
  const buttonClass = isTextDark
    ? 'bg-gray-900 text-white hover:bg-gray-800' // На светлом фоне черная кнопка
    : 'bg-white text-gray-900 hover:bg-gray-50'; // На темном фоне белая кнопка

  return (
    <div
      className={clsx(
        'relative w-full rounded-4xl p-6 mb-4 flex flex-col justify-between shadow-xl overflow-hidden',
        // Если картинки нет, ставим градиент
        !imageSrc && `bg-linear-to-br ${gradientFrom} ${gradientTo}`,
      )}
      style={{ minHeight: '320px' }}
    >
      {/* ФОН: КАРТИНКА + ЗАТЕМНЕНИЕ */}
      {imageSrc && (
        <>
          <Image src={imageSrc} alt={title} fill className='object-cover z-0' />
          {/* Если текст белый, добавляем затемнение, чтобы он читался */}
          {!isTextDark && <div className='absolute inset-0 bg-black/40 z-0' />}
        </>
      )}

      {/* ВЕРХНИЙ БЕЙДЖ */}
      <div className='relative z-10 w-fit mb-4'>
        <div
          className={clsx(
            'flex items-center gap-1.5 backdrop-blur-md px-3 py-1.5 rounded-full border',
            badgeBg,
          )}
        >
          <Clock size={14} className={badgeText} strokeWidth={2.5} />
          <span className={clsx('font-bold text-sm tracking-wide', badgeText)}>
            {time}
          </span>
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

      {/* ЦЕНА */}
      <div className='relative z-10 mt-6 mb-6'>
        <span
          className={clsx(
            'block font-benzin text-[24px] leading-none font-semibold uppercase tracking-tight drop-shadow-sm',
            textColor,
          )}
        >
          {prize}
        </span>
      </div>

      {/* КНОПКА */}
      <Link href='/check-ticket' className='relative z-10 block w-full'>
        <button
          className={clsx(
            'rounded-full py-3 px-6 transition-all active:scale-[0.98] shadow-lg shadow-black/5',
            buttonClass,
          )}
        >
          <span className='font-extrabold text-xs uppercase'>
            Играть • {price} сом
          </span>
        </button>
      </Link>
    </div>
  );
}

// Вспомогательная функция (оставляем как запасной вариант)
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
