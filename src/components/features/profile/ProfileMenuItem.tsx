import Link from 'next/link';
import { ChevronRight, LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface ProfileMenuItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isDestructive?: boolean; // Для красной кнопки "Выйти"
}

export const ProfileMenuItem = ({
  icon: Icon,
  label,
  href,
  isDestructive,
}: ProfileMenuItemProps) => {
  return (
    <Link href={href} className='block w-full'>
      <div className='flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors first:rounded-t-3xl last:rounded-b-3xl border-b border-gray-100 last:border-none'>
        <div className='flex items-center gap-4'>
          {/* Иконка */}
          <div
            className={clsx(isDestructive ? 'text-red-500' : 'text-gray-400')}
          >
            <Icon size={24} strokeWidth={1.5} />
          </div>

          {/* Текст */}
          <span
            className={clsx(
              'text-sm font-bold font-rubik',
              isDestructive ? 'text-red-500' : 'text-[#2D2D2D]',
            )}
          >
            {label}
          </span>
        </div>

        {/* Стрелочка */}
        <ChevronRight size={20} className='text-gray-300' />
      </div>
    </Link>
  );
};
