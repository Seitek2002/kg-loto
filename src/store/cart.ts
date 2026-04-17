import { create } from 'zustand';

export interface CartItem {
  id: string; // Это ticketId
  price: number;
  type: 'super' | 'other';
  // 🔥 ДОБАВЛЯЕМ ДАННЫЕ ДЛЯ КОРЗИНЫ И ПОКУПКИ:
  ticketNumber: string;
  combination: number[];
  lotteryId: string;
  drawId: string;
  name: string; // Название лотереи или тиража
}

interface CartStore {
  items: CartItem[];
  toggleItem: (item: CartItem) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],

  toggleItem: (item) =>
    set((state) => {
      const exists = state.items.find((i) => i.id === item.id);
      if (exists) {
        return { items: state.items.filter((i) => i.id !== item.id) };
      }
      return { items: [...state.items, item] };
    }),

  clearCart: () => set({ items: [] }),
}));
