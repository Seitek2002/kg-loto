import { ReactNode } from "react";

export const Title = ({ children }: { children: ReactNode }) => {
  return (
    <h2 className='text-base font-bold text-[#4B4B4B] font-benzin uppercase'>
      {children}
    </h2>
  );
};
