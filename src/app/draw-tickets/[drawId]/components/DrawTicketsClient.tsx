'use client';

import { useState } from 'react';
import { TicketsHero } from './TicketsHero'; // Путь к твоему компоненту ниже

interface DrawTicketsClientProps {
  lotteryId: string; // 🔥 Добавили прокидывание ID
  ticketsTab: React.ReactNode;
  rulesTab: React.ReactNode;
  archiveTab: React.ReactNode;
}

export const DrawTicketsClient = ({
  lotteryId,
  ticketsTab,
  rulesTab,
  archiveTab,
}: DrawTicketsClientProps) => {
  const [activeTab, setActiveTab] = useState('tickets');

  return (
    <>
      {/* 🔥 Передаем lotteryId в баннер */}
      <TicketsHero
        lotteryId={lotteryId}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Условный рендеринг готовых серверных блоков */}
      {activeTab === 'tickets' && ticketsTab}
      {activeTab === 'rules' && rulesTab}
      {activeTab === 'archive' && archiveTab}
    </>
  );
};
