import { create } from 'zustand';

export interface CartItem {
  id: number;
  price: number;
  type: 'super' | 'other';
}

interface CartStore {
  items: CartItem[];
  toggleItem: (item: CartItem) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],

  // Добавляем или удаляем билет (в зависимости от того, есть ли он уже в корзине)
  toggleItem: (item) =>
    set((state) => {
      const exists = state.items.find((i) => i.id === item.id);
      if (exists) {
        return { items: state.items.filter((i) => i.id !== item.id) }; // Удаляем
      }
      return { items: [...state.items, item] }; // Добавляем
    }),

  clearCart: () => set({ items: [] }),
}));
