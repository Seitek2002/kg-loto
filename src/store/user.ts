import { create } from 'zustand';

export type WinType = 'money' | 'item' | null;

export interface UserTicket {
  id: string;
  title: string;
  ticketNumber: string;
  drawNumber: string;
  drawDate: string;
  price: number;

  status: 'winning' | 'losing' | 'pending';

  // Если выиграл
  winType?: WinType; // 'money' - деньги, 'item' - вещь
  winAmount?: string; // "5 000 KGS" или "iPhone 16 Pro"

  // Визуал
  gradientFrom: string;
  gradientTo: string;
  theme: 'dark' | 'white';
}

// МОКОВЫЕ ДАННЫЕ (Имитация купленных билетов)
const MOCK_MY_TICKETS: UserTicket[] = [
  {
    id: 't-101',
    title: 'Космический Старт',
    ticketNumber: '9988 1122 3344',
    drawNumber: 'No 00512',
    drawDate: '25.01.2026',
    price: 100,
    status: 'winning',
    winType: 'money',
    winAmount: '2 000 KGS',
    gradientFrom: 'from-blue-600',
    gradientTo: 'to-indigo-900',
    theme: 'white',
  },
  {
    id: 't-102',
    title: 'Техно-Бум',
    ticketNumber: '7777 8888 9999',
    drawNumber: 'No 00123',
    drawDate: '28.01.2026',
    price: 150,
    status: 'winning',
    winType: 'item',
    winAmount: 'iPhone 16 Pro',
    gradientFrom: 'from-gray-900',
    gradientTo: 'to-gray-700',
    theme: 'white',
  },
  {
    id: 't-104',
    title: 'Квартирный Вопрос',
    ticketNumber: '0000 1111 2222',
    drawNumber: 'No 00999',
    drawDate: '01.02.2026',
    price: 500,
    status: 'pending',
    gradientFrom: 'from-orange-400',
    gradientTo: 'to-red-500',
    theme: 'white',
  },
];

interface UserState {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  myTickets: UserTicket[];

  // Действия
  addTicket: (ticket: UserTicket) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: {
    name: 'Santana Lopez', // Можешь поменять на любое имя
    email: 'santanalopez@gmail.com',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
  },
  myTickets: MOCK_MY_TICKETS,

  addTicket: (ticket) =>
    set((state) => ({
      myTickets: [ticket, ...state.myTickets],
    })),
}));
