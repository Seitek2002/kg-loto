'use client';

import { useState } from 'react';
import { TicketsHero } from './TicketsHero';

interface DrawTicketsClientProps {
  ticketsTab: React.ReactNode;
  rulesTab: React.ReactNode;
  archiveTab: React.ReactNode;
}

export const DrawTicketsClient = ({
  ticketsTab,
  rulesTab,
  archiveTab,
}: DrawTicketsClientProps) => {
  const [activeTab, setActiveTab] = useState('tickets');

  return (
    <>
      {/* Передаем стейт в баннер, чтобы он подсвечивал нужную кнопку */}
      <TicketsHero activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Условный рендеринг готовых серверных блоков */}
      {activeTab === 'tickets' && ticketsTab}
      {activeTab === 'rules' && rulesTab}
      {activeTab === 'archive' && archiveTab}
    </>
  );
};
