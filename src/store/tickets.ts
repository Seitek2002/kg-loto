import { create } from 'zustand';

export type TicketStatus = 'winning' | 'losing' | 'pending' | 'archive';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  prize: string;
  price: number;
  status: TicketStatus;
  // Визуал
  gradientFrom: string;
  gradientTo: string;
  imageSrc?: string;
  theme: 'dark' | 'white';
}

const MOCK_TICKETS: Ticket[] = [
  {
    id: '1',
    title: 'НАЗВАНИЕ ЛОТЕРЕИ',
    description: 'Популярные лотереи привлекают внимание...',
    prize: '1 000 000 KGS',
    price: 100,
    status: 'winning', // Выигрышный
    gradientFrom: 'from-yellow-200',
    gradientTo: 'to-orange-300',
    theme: 'dark',
  },
  {
    id: '2',
    title: 'LUCKY DROP',
    description: 'Тысячи игроков ежедневно выбирают...',
    prize: 'IPHONE 16 PRO',
    price: 200,
    status: 'pending', // Не проверен
    gradientFrom: 'from-blue-200',
    gradientTo: 'to-indigo-300',
    theme: 'dark',
  },
  {
    id: '3',
    title: 'КЫРГЫЗ ЛОТО',
    description: 'Шанс выиграть автомобиль каждый месяц.',
    prize: 'TESLA MODEL Y',
    price: 500,
    status: 'losing', // Проигрышный
    imageSrc:
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop',
    theme: 'white',
    gradientFrom: '',
    gradientTo: '',
  },
];

interface TicketsStore {
  tickets: Ticket[];
  filter: TicketStatus | 'all';
  setFilter: (filter: TicketStatus | 'all') => void;
  getFilteredTickets: () => Ticket[];
}

export const useTicketsStore = create<TicketsStore>((set, get) => ({
  tickets: MOCK_TICKETS,
  filter: 'all',

  setFilter: (filter) => set({ filter }),

  getFilteredTickets: () => {
    const { tickets, filter } = get();
    if (filter === 'all') return tickets;
    return tickets.filter((t) => t.status === filter);
  },
}));
