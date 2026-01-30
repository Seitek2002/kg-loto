import { create } from 'zustand';

// Типы оставляем как есть
export type TicketStatus = 'winning' | 'losing' | 'pending' | 'archive';

export interface UserTicket {
  id: string;
  lotteryId: number;
  status: TicketStatus;
  ticketNumber: string;
  purchaseDate: string;
}

// Моковые данные (как было)
const MOCK_USER_TICKETS: UserTicket[] = [
  {
    id: '1',
    lotteryId: 2,
    status: 'winning',
    ticketNumber: '9988',
    purchaseDate: '20.01.2026',
  },
  {
    id: '2',
    lotteryId: 1,
    status: 'pending',
    ticketNumber: '7777',
    purchaseDate: '22.01.2026',
  },
  {
    id: '3',
    lotteryId: 4,
    status: 'losing',
    ticketNumber: '0000',
    purchaseDate: '15.01.2026',
  },
];

interface TicketsStore {
  tickets: UserTicket[];
  filter: TicketStatus | 'all';
  setFilter: (filter: TicketStatus | 'all') => void;
  // УДАЛИЛИ getFilteredTickets
}

export const useTicketsStore = create<TicketsStore>((set) => ({
  tickets: MOCK_USER_TICKETS,
  filter: 'all',
  setFilter: (filter) => set({ filter }),
}));
