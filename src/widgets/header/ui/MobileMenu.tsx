"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart, Wallet } from "lucide-react";

import { useAuthStore } from "@/entities/user/model/authStore";

import { getRelativeUrl } from "@/shared/lib/utils";

// Тип вынесем сюда, чтобы не ругался TypeScript. Потом перенесем в types/api.ts
interface MenuItem {
  id: number | string;
  title: string;
  link: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthClick: (flow: "login" | "register") => void;
  menuItems: MenuItem[];
}

export const MobileMenu = ({
  isOpen,
  onClose,
  onAuthClick,
  menuItems,
}: MobileMenuProps) => {
  const t = useTranslations("header");
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-x-0 top-16 bottom-0 z-100 bg-black/40 backdrop-blur-sm flex flex-col pb-24 overflow-y-auto"
        >
          <div className="m-4 bg-white rounded-3xl p-5 shadow-2xl flex flex-col gap-4 font-rubik">
            {user && (
              <Link
                href="/wallet"
                onClick={onClose}
                className="flex items-center justify-between bg-[#F9F9F9] border border-gray-100 p-4 rounded-2xl mb-2 hover:bg-gray-100 active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-2 text-[#4B4B4B]">
                  <Wallet size={20} strokeWidth={2} />
                  <span className="font-bold text-[13px] uppercase">
                    Баланс
                  </span>
                </div>
                <div className="text-[18px] font-black text-[#F58220]">
                  {user.balance || "0"} <span className="underline">с</span>
                </div>
              </Link>
            )}

            <div className="flex flex-col">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  href={getRelativeUrl(item.link)}
                  onClick={onClose}
                  className="py-4 text-[13px] font-bold text-[#4B4B4B] uppercase border-b border-gray-100 hover:text-[#F5A623] transition-colors"
                >
                  {item.title}
                </Link>
              ))}

              {user && (
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="py-4 flex items-center justify-between text-[13px] font-bold text-[#4B4B4B] uppercase border-b border-gray-100 hover:text-[#F5A623] transition-colors"
                >
                  Мои билеты
                  <ShoppingCart size={18} strokeWidth={2} />
                </Link>
              )}
            </div>

            <div className="flex gap-3 mt-4 pt-2">
              {user ? (
                <>
                  <button
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className="flex-1 bg-[#4A4A4A] text-white py-4 rounded-full font-black text-[10px] uppercase tracking-wider active:scale-95 transition-transform"
                  >
                    Выйти
                  </button>
                  <Link
                    href="/profile"
                    onClick={onClose}
                    className="flex-1 bg-[#FFD600] text-[#4B4B4B] py-4 rounded-full font-black text-[10px] uppercase tracking-wider active:scale-95 transition-transform shadow-[0_4px_14px_rgba(255,214,0,0.4)] flex items-center justify-center"
                  >
                    Профиль
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onAuthClick("register")}
                    className="flex-1 bg-[#4A4A4A] text-white py-4 rounded-full font-black text-[10px] uppercase tracking-wider active:scale-95 transition-transform"
                  >
                    Регистрация
                  </button>
                  <button
                    onClick={() => onAuthClick("login")}
                    className="flex-1 bg-[#FFD600] text-[#4B4B4B] py-4 rounded-full font-black text-[10px] uppercase tracking-wider active:scale-95 transition-transform shadow-[0_4px_14px_rgba(255,214,0,0.4)]"
                  >
                    Войти
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
