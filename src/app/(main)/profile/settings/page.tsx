'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';
import { ProfileHeader } from '@/components/features/profile/ProfileHeader';

import { AccountForm } from '@/components/features/profile/settings/AccountForm';
import { LanguageForm } from '@/components/features/profile/settings/LanguageForm';
import { FaqSettings } from '@/components/features/profile/settings/FaqSettings';

const TABS = [
  { id: 'account', title: 'Аккаунт', Component: AccountForm },
  { id: 'language', title: 'Язык', Component: LanguageForm },
  {
    id: 'terms',
    title: 'Условия использования',
    Component: () => (
      <div className='text-sm text-[#6E6E6E]'>Текст условий...</div>
    ),
  },
  { id: 'faq', title: 'FAQ', Component: FaqSettings },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const [openMobileTab, setOpenMobileTab] = useState<string | null>('account');

  // Находим индекс активного таба, чтобы знать, куда двигать ползунок
  const activeIndex = TABS.findIndex((t) => t.id === activeTab);
  const ActiveComponent = TABS[activeIndex !== -1 ? activeIndex : 0].Component;

  return (
    <div className='min-h-screen bg-[#F5F5F5] pt-4 md:pt-6 pb-24 font-rubik'>
      <div className='max-w-[1045px] mx-auto px-4 sm:px-6 lg:px-8'>
        <ProfileHeader />

        <div className='mt-4 sm:mt-10 overflow-y-hidden'>
          {/* ======================================= */}
          {/* 🔥 ДЕСКТОПНАЯ ВЕРСИЯ (С плавающим ползунком) */}
          {/* ======================================= */}
          <div className='hidden lg:flex w-full items-start'>
            {/* Сайдбар */}
            <div className='w-[386px] shrink-0 relative z-10'>
              <div className='relative flex flex-col'>
                {/* 🔥 ТОТ САМЫЙ ПЛАВАЮЩИЙ ПОЛЗУНОК */}
                <div
                  className='absolute left-0 w-full h-[64px] bg-white rounded-l-[32px] transition-transform duration-300 ease-in-out pointer-events-none z-0'
                  style={{ transform: `translateY(${activeIndex * 100}%)` }}
                >
                  {/* 🔥 Идеально плавный верхний уголок */}
                  <div className='absolute top-[-32px] right-0 w-[32px] h-[32px] bg-white'>
                    <div className='w-full h-full bg-[#F5F5F5] rounded-br-[32px]' />
                  </div>

                  {/* 🔥 Идеально плавный нижний уголок */}
                  <div className='absolute bottom-[-32px] right-0 w-[32px] h-[32px] bg-white'>
                    <div className='w-full h-full bg-[#F5F5F5] rounded-tr-[32px]' />
                  </div>
                </div>

                {/* САМИ КНОПКИ ТАБОВ */}
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={clsx(
                        'relative z-10 cursor-pointer w-full text-[#4B4B4B] h-[64px] text-left px-8 text-[18px] font-benzin uppercase transition-colors tracking-wide',
                        isActive ? 'font-extrabold' : 'font-medium',
                      )}
                    >
                      {tab.title}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Контентная часть */}
            <div
              className={clsx(
                'flex-1 bg-white rounded-[40px] min-h-[600px] p-10 relative z-0 shadow-sm transition-all duration-200',
                activeIndex == 0 && 'rounded-tl-none',
              )}
            >
              <ActiveComponent />
            </div>
          </div>

          {/* ======================================= */}
          {/* 🔥 МОБИЛЬНАЯ ВЕРСИЯ (Аккордеоны) */}
          {/* ======================================= */}
          <div className='flex flex-col gap-3 lg:hidden'>
            {TABS.map((tab) => {
              const isOpen = openMobileTab === tab.id;
              const MobileComponent = tab.Component;

              return (
                <div
                  key={tab.id}
                  className='bg-white rounded-[24px] p-5 shadow-sm'
                >
                  <button
                    onClick={() => setOpenMobileTab(isOpen ? null : tab.id)}
                    className='w-full flex justify-between items-center uppercase font-benzin text-[13px] font-bold text-[#4B4B4B]'
                  >
                    {tab.title}
                    <ChevronDown
                      size={20}
                      className={clsx(
                        'transition-transform duration-300 text-[#4B4B4B]',
                        isOpen && 'rotate-180',
                      )}
                    />
                  </button>

                  <div
                    className={clsx(
                      'grid transition-all duration-300 ease-in-out',
                      isOpen
                        ? 'grid-rows-[1fr] mt-6 opacity-100'
                        : 'grid-rows-[0fr] opacity-0',
                    )}
                  >
                    <div className='overflow-hidden'>
                      <MobileComponent />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
