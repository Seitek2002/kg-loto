import Link from 'next/link';
import { Clock } from 'lucide-react';

interface LotteryCardProps {
  title: string;
  description: string;
  price: number;
  prize: string;
  gradientFrom?: string;
  gradientTo?: string;
  time?: string; // Добавил проп для времени (например, "14:56")
}

export function LotteryCard({
  title,
  description,
  price,
  prize,
  gradientFrom = 'from-blue-400',
  gradientTo = 'to-blue-600',
  time = '14:56', // Дефолтное время
}: LotteryCardProps) {
  return (
    <div
      className={`relative w-full rounded-4xl p-6 mb-4 flex flex-col justify-between bg-linear-to-br ${gradientFrom} ${gradientTo} shadow-xl`}
      style={{ minHeight: '320px' }} // Минимальная высота, чтобы карточка была "высокой", как на дизайне
    >
      {/* 1. Верхний бейдж с временем */}
      <div className='w-fit mb-4'>
        <div className='flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10'>
          <Clock size={14} className='text-white' strokeWidth={2.5} />
          <span className='text-white font-bold text-sm tracking-wide'>
            {time}
          </span>
        </div>
      </div>

      {/* 2. Контент: Заголовок и Описание */}
      <div className='mb-auto'>
        <h3 className='text-sm font-black text-white uppercase tracking-wide mb-3 font-benzin'>
          {title}
        </h3>
        <p className='text-xs text-white/90 leading-relaxed font-medium font-rubik'>
          {description}
        </p>
      </div>

      {/* 3. Огромная цена приза */}
      <div className='mt-6 mb-6'>
        <span className='block font-benzin text-[24px] leading-none font-black text-white uppercase tracking-tight drop-shadow-sm'>
          {prize}
        </span>
      </div>

      {/* 4. Белая кнопка */}
      <Link href='/check-ticket' className='block w-full'>
        <button className='bg-white hover:bg-gray-50 text-gray-900 rounded-full py-3 px-6 transition-all active:scale-[0.98] shadow-lg shadow-black/5'>
          <span className='font-extrabold text-xs uppercase'>
            Играть • {price} сом
          </span>
        </button>
      </Link>
    </div>
  );
}
