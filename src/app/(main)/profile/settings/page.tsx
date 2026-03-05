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

  // 🔥 Находим индекс активного таба, чтобы знать, куда двигать ползунок
  const activeIndex = TABS.findIndex((t) => t.id === activeTab);
  const ActiveComponent = TABS[activeIndex !== -1 ? activeIndex : 0].Component;

  return (
    <div className='min-h-screen bg-[#F5F5F5] pt-4 md:pt-6 pb-24 font-rubik'>
      <div className='max-w-[1045px] mx-auto px-4 sm:px-6 lg:px-8'>
        <ProfileHeader />

        <div className='mt-4 sm:mt-10 overflow-hidden'>
          {/* ======================================= */}
          {/* 🔥 ДЕСКТОПНАЯ ВЕРСИЯ (С плавающим ползунком) */}
          {/* ======================================= */}
          <div className='hidden lg:flex w-full items-start'>
            {/* Сайдбар */}
            <div className='w-[320px] shrink-0 relative z-10'>
              <div className='relative flex flex-col'>
                {/* 🔥 ТОТ САМЫЙ ПЛАВАЮЩИЙ ПОЛЗУНОК */}
                {/* Он позиционируется абсолютно и ездит вверх-вниз благодаря translateY */}
                <div
                  className='absolute left-0 w-full h-[64px] bg-white rounded-l-[32px] transition-transform duration-300 ease-in-out pointer-events-none z-0'
                  style={{ transform: `translateY(${activeIndex * 100}%)` }}
                >
                  {/* Верхний уголок */}
                  <div className='absolute top-[-24px] right-0 w-[24px] h-[24px] bg-transparent rounded-br-[24px] shadow-[12px_12px_0_0_#ffffff]' />
                  {/* Нижний уголок */}
                  <div className='absolute bottom-[-24px] right-0 w-[24px] h-[24px] bg-transparent rounded-tr-[24px] shadow-[12px_-12px_0_0_#ffffff]' />
                </div>

                {/* САМИ КНОПКИ ТАБОВ */}
                {/* Они прозрачные и лежат поверх ползунка (z-10) */}
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      // 🔥 Фиксируем высоту кнопки (h-[64px]), чтобы ползунок ездил идеально ровно
                      className={clsx(
                        'relative z-10 w-full h-[64px] text-left px-8 text-[14px] font-benzin uppercase transition-colors tracking-wide',
                        isActive
                          ? 'text-[#2D2D2D] font-bold'
                          : 'text-[#6E6E6E] hover:text-[#2D2D2D]',
                      )}
                    >
                      {tab.title}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Контентная часть */}
            <div className='flex-1 bg-white rounded-[40px] rounded-tl-none min-h-[600px] p-10 relative z-0 shadow-sm'>
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
