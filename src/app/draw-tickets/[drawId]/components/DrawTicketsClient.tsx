'use client';

import { useState } from 'react';
import { TicketsHero } from './TicketsHero';

interface DrawTicketsClientProps {
  lotteryId: string;
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
      <TicketsHero
        lotteryId={lotteryId}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'tickets' && ticketsTab}
      {activeTab === 'rules' && rulesTab}
      {activeTab === 'archive' && archiveTab}
    </>
  );
};
