import { ReactNode } from 'react';
import clsx from 'clsx';

export const Title = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <h2
      className={clsx(
        'text-base lg:text-2xl font-bold text-[#4B4B4B] font-benzin uppercase',
        className,
      )}
    >
      {children}
    </h2>
  );
};
