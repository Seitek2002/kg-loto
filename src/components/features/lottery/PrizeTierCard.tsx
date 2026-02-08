import { clsx } from 'clsx';

interface PrizeTierCardProps {
  category: string;
  description?: string;
  amount: string;
  winnersCount: number;
  gradientFrom: string;
  gradientTo: string;
}

export const PrizeTierCard = ({
  category,
  description,
  amount,
  winnersCount,
  gradientFrom,
  gradientTo,
}: PrizeTierCardProps) => {
  return (
    <div
      className={clsx(
        'w-full md:h-full p-5 rounded-4xl flex items-center justify-between shadow-lg mb-4 bg-linear-to-r',
        gradientFrom,
        gradientTo,
      )}
    >
      <div className='flex flex-col text-white'>
        <span className='text-[10px] font-bold font-benzin uppercase opacity-90 mb-1'>
          {category}
        </span>
        {description && (
          <span className='text-[9px] font-medium font-rubik opacity-80 mb-2 max-w-37.5 leading-tight'>
            {description}
          </span>
        )}
        <span className='text-xl font-black font-benzin uppercase tracking-tight'>
          {amount}
        </span>
      </div>

      {/* Бейдж с победителями */}
      <div className='bg-white rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm'>
        {/* Иконку можно заменить на черную точку как в дизайне, или оставить иконку юзера */}
        <div className='w-1.5 h-1.5 rounded-full bg-black' />
        <span className='text-[10px] font-bold font-benzin uppercase text-black whitespace-nowrap'>
          {winnersCount} ПОБЕДИТЕЛЕЙ
        </span>
      </div>
    </div>
  );
};
