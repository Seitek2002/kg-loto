import { Clock } from 'lucide-react';
import { clsx } from 'clsx';
import { BaseCard } from '@/components/ui/BaseCard';

type CardStatus = 'winning' | 'losing' | 'pending' | 'archive';

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
  ticketStatus?: CardStatus;
  
  // 🔥 Используем этот проп для изменения вида кнопки
  variant?: 'lottery' | 'prize'; 
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
  ticketStatus,
  variant = 'lottery', // По дефолту обычный режим
}: LotteryCardProps) {

  // ... (Логика темы остается той же) ...
  let finalTheme: 'dark' | 'white';
  if (theme) {
    finalTheme = theme;
  } else if (imageSrc) {
    finalTheme = 'white';
  } else {
    finalTheme = isLightBackground(gradientFrom) ? 'dark' : 'white';
  }
  
  const isDark = finalTheme === 'dark';
  const descriptionColor = isDark ? 'text-gray-700' : 'text-white/90';
  const buttonClass = isDark
    ? 'bg-gray-900 text-white hover:bg-gray-800'
    : 'bg-white text-gray-900 hover:bg-gray-50';

  // Логика бейджа (оставляем как есть)
  const getStatusConfig = (status: CardStatus) => {
    switch (status) {
      case 'winning': return { text: 'выигрышный', dot: 'bg-green-500', textCol: 'text-green-600' };
      case 'losing': return { text: 'проигрышный', dot: 'bg-red-500', textCol: 'text-red-500' };
      case 'pending': return { text: 'не проверен', dot: 'bg-blue-400', textCol: 'text-blue-500' };
      case 'archive': return { text: 'архив', dot: 'bg-gray-400', textCol: 'text-gray-500' };
      default: return { text: '', dot: '', textCol: '' };
    }
  };

  const badgeWrapperClass = 'flex items-center gap-2 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20';

  // 🔥 ЛОГИКА ТЕКСТА КНОПКИ
  const getButtonContent = () => {
    if (variant === 'prize') {
      // Если это приз, и он выигрышный -> "ЗАБРАТЬ"
      if (ticketStatus === 'winning') return 'ЗАБРАТЬ ВЫИГРЫШ';
      if (ticketStatus === 'pending') return 'ОЖИДАЕТ ТИРАЖА';
      if (ticketStatus === 'losing') return 'К СОЖАЛЕНИЮ, МИМО';
      return 'ПОДРОБНЕЕ';
    }
    // Если это просто лотерея -> "ИГРАТЬ"
    return `Играть • ${price} сом`;
  };

  return (
    <BaseCard
      gradientFrom={gradientFrom}
      gradientTo={gradientTo}
      imageSrc={imageSrc}
      theme={finalTheme}
      className='mb-0'
    >
      {/* ВЕРХНИЙ БЕЙДЖ */}
      <div className='w-fit mb-4'>
        {ticketStatus ? (
          <div className={badgeWrapperClass}>
            <div className={clsx('w-2 h-2 rounded-full', getStatusConfig(ticketStatus).dot)} />
            <span className={clsx('text-[10px] font-bold uppercase font-benzin', getStatusConfig(ticketStatus).textCol)}>
              {getStatusConfig(ticketStatus).text}
            </span>
          </div>
        ) : (
          <div className={badgeWrapperClass}>
            <Clock size={14} className='text-gray-900' strokeWidth={2.5} />
            <span className='font-bold text-sm tracking-wide text-gray-900'>{time}</span>
          </div>
        )}
      </div>

      <div className='mb-auto'>
        <h3 className='text-sm font-black uppercase tracking-wide mb-3 font-benzin opacity-100'>
          {title}
        </h3>
        <p className={clsx('text-xs leading-relaxed font-medium font-rubik', descriptionColor)}>
          {description}
        </p>
      </div>

      <div className={clsx('mt-6 mb-6')}>
        <span className='block font-benzin text-[32px] leading-none font-black uppercase tracking-tight drop-shadow-sm'>
          {prize}
        </span>
      </div>

      {/* КНОПКА */}
      <button className={clsx('w-full rounded-full py-4 px-6 transition-all shadow-lg', buttonClass)}>
        <span className='font-extrabold text-xs uppercase'>
          {getButtonContent()}
        </span>
      </button>
    </BaseCard>
  );
}

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