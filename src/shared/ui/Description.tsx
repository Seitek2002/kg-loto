import { ReactNode } from 'react';
import clsx from 'clsx';

export const Description = ({
  children,
  className,
}: {
  children: string | ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={clsx(
        'text-xs lg:text-xl lg:max-w-[70%] text-[#6E6E6E] my-3',
        className,
      )}
    >
      {children}
    </p>
  );
};
