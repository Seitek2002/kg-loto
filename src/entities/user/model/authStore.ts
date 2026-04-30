import Cookies from "js-cookie";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Phone {
  countryCode?: string;
  dialCode?: string;
  flag?: string;
  number?: string;
}

export interface User {
  id?: number | string;
  avatar?: string | null;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  birthDate?: string;
  inn?: string;
  passportFront?: string;
  passportBack?: string;
  email?: string;
  phone?: Phone | string;
  isAccountApproved?: boolean;
  isAccountActive?: boolean;
  balance?: number | string;
  kglotteryProfile?: any;
}

interface AuthState {
  isAuth: boolean;
  user: User | null;

  // 🔥 ГЛОБАЛЬНЫЙ СТЕЙТ ДЛЯ МОДАЛКИ
  isAuthModalOpen: boolean;
  authFlow: "login" | "register";

  setTokens: (access: string, refresh?: string) => void;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
  checkAuth: () => void;
  fetchUser: () => Promise<void>;

  // 🔥 ФУНКЦИИ ДЛЯ УПРАВЛЕНИЯ МОДАЛКОЙ
  openAuthModal: (flow?: "login" | "register") => void;
  closeAuthModal: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // --- Начальное состояние ---
      isAuth: false,
      user: null,

      // 🔥 По умолчанию модалка закрыта
      isAuthModalOpen: false,
      authFlow: "login",

      // --- Экшены ---
      setTokens: (access, refresh) => {
        Cookies.set("accessToken", access, { expires: 7 });
        if (refresh) Cookies.set("refreshToken", refresh, { expires: 30 });
        set({ isAuth: true });
      },

      setUser: (user) => set({ user, isAuth: true }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, ...updates }
            : ({ ...updates } as User),
        })),

      logout: () => {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        set({ isAuth: false, user: null });
      },

      checkAuth: () => {
        const token = Cookies.get("accessToken");
        set({ isAuth: !!token });
      },

      fetchUser: async () => {
        try {
          const { authApi } = await import("../api/authApi");
          const response = await authApi.getMe();
          const userData = response.data.data || response.data;
          set({ user: userData, isAuth: true });
        } catch (error) {
          console.error("Ошибка при обновлении профиля:", error);
        }
      },

      // 🔥 ЭКШЕНЫ ДЛЯ МОДАЛКИ
      openAuthModal: (flow = "login") =>
        set({ isAuthModalOpen: true, authFlow: flow }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),
    }),
    {
      name: "auth-storage",
      // 🔥 Игнорируем состояние модалки при сохранении в localStorage
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
