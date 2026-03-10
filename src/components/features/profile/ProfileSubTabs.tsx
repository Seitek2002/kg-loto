'use client';

import { clsx } from 'clsx';
import { ReactNode } from 'react';

interface ProfileSubTabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  rightElement?: ReactNode;
}

export const ProfileSubTabs = ({
  tabs,
  activeTab,
  onTabChange,
  rightElement,
}: ProfileSubTabsProps) => {
  return (
    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 border-b border-[#909090] pb-6.5'>
      <div className='flex items-center gap-4 sm:gap-8.5 overflow-x-auto scrollbar-hide'>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={clsx(
              'text-[12px] sm:text-base transition-colors whitespace-nowrap cursor-pointer',
              activeTab === tab
                ? 'text-[#4B4B4B] font-semibold'
                : 'text-[#4B4B4B]',
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Рендерим правую кнопку (если она передана в пропсы) */}
      {rightElement && <div>{rightElement}</div>}
    </div>
  );
};
