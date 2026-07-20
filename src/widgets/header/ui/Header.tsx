"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { clsx } from "clsx";
import { Menu, ShoppingCart, Wallet, X } from "lucide-react";

import { AuthModal } from "@/features/auth/ui/AuthModal";
import { LanguageSwitcher } from "@/features/language-switcher/ui/LanguageSwitcher";

import { useCartStore } from "@/entities/cart/model/cartStore";
import { useBalance } from "@/entities/finance/api/financeApi";
import { useAuthStore } from "@/entities/user/model/authStore";

import { getRelativeUrl } from "@/shared/lib/utils";
import { MenuItem } from "@/shared/types/api";

import { MobileMenu } from "./MobileMenu";

interface HeaderProps {
  theme?: "light" | "dark";
  headerMenu?: MenuItem[];
  headerUpperMenu?: MenuItem[];
}

export const Header = ({
  theme = "light",
  headerMenu = [],
  headerUpperMenu = [],
}: HeaderProps) => {
  const { isAuthModalOpen, authFlow, openAuthModal, closeAuthModal, user } =
    useAuthStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const isDark = theme === "dark";
  const cartCount = useCartStore((state) => state.items.length);

  useBalance();

  const handleAuthClick = (flow: "login" | "register" = "login") => {
    setIsMobileMenuOpen(false);
    openAuthModal(flow);
  };

  // 🔥 1. Формируем инициал (первая буква имени или "U")
  const userInitial = user?.firstName?.charAt(0).toUpperCase() || "U";

  // 🔥 2. Достаем сырой аватар
  const rawAvatar = user?.avatar || user?.kglotteryProfile?.avatar;

  // 🔥 3. СТРОГАЯ ПРОВЕРКА: убеждаемся, что это реальная строка с ссылкой, а не "null"
  const hasValidAvatar =
    typeof rawAvatar === "string" &&
    rawAvatar !== "null" &&
    rawAvatar.trim() !== "";

  const navLinkClass = clsx(
    "text-sm font-medium uppercase transition-colors",
    isDark
      ? "text-[#4B4B4B]/70 hover:text-[#4B4B4B]"
      : "text-white/80 hover:text-white",
  );

  const router = useRouter();
  const pathname = usePathname();

  const handleCheckClick = () => {
    if (!user) {
      handleAuthClick("login");
      return;
    }

    if (pathname === "/") {
      const checkBlock = document.getElementById("check");
      if (checkBlock) {
        checkBlock.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push("/#check");
    }
  };

  return (
    <>
      <header className="relative z-50">
        {/* ВЕРХНЯЯ ПОЛОСКА */}
        <div className="hidden lg:flex bg-[#0B1F3B] justify-between text-white py-3 px-8 text-xs font-rubik">
          {headerUpperMenu.length >= 3 && (
            <>
              <Link
                href={getRelativeUrl(headerUpperMenu[2].link)}
                className="hover:underline"
              >
                {headerUpperMenu[2].title}
              </Link>
              <button
                onClick={handleCheckClick}
                className="cursor-pointer hover:underline"
              >
                {headerUpperMenu[0].title}
              </button>
              <Link
                href={`tel:${getRelativeUrl(headerUpperMenu[1].link)}`}
                className="cursor-pointer hover:underline"
              >
                {headerUpperMenu[1].title}
              </Link>
            </>
          )}
        </div>

        {/* ОСНОВНОЙ ХЕДЕР */}
        <div className="hidden lg:flex py-3 font-rubik w-full items-center justify-between px-8 bg-white shadow-sm relative z-20">
          <Link href="/" className="relative w-32 h-12">
            <Image
              src="/logo.png"
              alt="KGLOTO"
              fill
              className="object-contain"
            />
          </Link>

          <nav className="flex items-center gap-10">
            {headerMenu.map((item) => (
              <Link
                key={item.id}
                href={getRelativeUrl(item.link)}
                className={navLinkClass}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <LanguageSwitcher isDark={false} />

            {user ? (
              <div className="flex items-center gap-6">
                <Link
                  href="/cart"
                  className="flex items-center gap-2 text-[#4B4B4B] hover:text-[#FFD600] transition-colors cursor-pointer"
                >
                  <span className="text-[15px] font-medium">Мои билеты</span>
                  <div className="relative">
                    <ShoppingCart size={24} strokeWidth={2} />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-[#F58220] text-white text-[10px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </div>
                </Link>

                <Link
                  href="/wallet"
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <Wallet
                    size={24}
                    strokeWidth={2}
                    className="text-[#4B4B4B] group-hover:text-[#F58220] transition-colors"
                  />
                  <div className="text-[22px] font-black text-[#F58220] flex items-end gap-1">
                    {user.balance || "0"}{" "}
                    <span className="text-[16px] underline mb-0.5">с</span>
                  </div>
                </Link>

                <Link
                  href="/profile"
                  className="w-11 h-11 relative rounded-full overflow-hidden bg-[#CBA3D3] flex items-center justify-center shrink-0 shadow-sm"
                >
                  {/* 🔥 ИСПОЛЬЗУЕМ НОВУЮ ЛОГИКУ ПРОВЕРКИ */}
                  {hasValidAvatar && !avatarError ? (
                    <Image
                      src={rawAvatar}
                      alt="Аватар"
                      fill
                      sizes="44px"
                      className="object-cover size-full"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <span className="text-[#331C39] font-medium text-lg">
                      {userInitial}
                    </span>
                  )}
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4 pl-2">
                <button
                  onClick={() => handleAuthClick("register")}
                  className="px-6 py-2.5 rounded-full text-[10px] font-black uppercase bg-[#4B4B4B] text-white hover:bg-black"
                >
                  Регистрация
                </button>
                <button
                  onClick={() => handleAuthClick("login")}
                  className="bg-[#FFD600] text-[#4B4B4B] px-6 py-2.5 rounded-full text-[10px] font-black uppercase hover:bg-[#FFC000]"
                >
                  Войти
                </button>
              </div>
            )}
          </div>
        </div>

        {/* МОБИЛЬНЫЙ ХЕДЕР */}
        <div
          className={clsx(
            "flex lg:hidden items-center justify-between gap-2 px-4 py-3 z-50 relative",
            isMobileMenuOpen
              ? "bg-[#f9f9f9]"
              : isDark
                ? "bg-[#0B1F3B]"
                : "bg-[#f9f9f9]",
          )}
        >
          <Link
            href="/"
            className="relative w-20 sm:w-24 h-10 min-w-12 shrink"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Image
              src="/logo.png"
              alt="KGLOTO"
              fill
              className="object-contain object-left"
            />
          </Link>

          <div className="flex items-center gap-3 shrink-0">
            {/* Баланс. Раньше был доступен только внутри бургер-меню.
                Сумму не обрезаем и не сокращаем (shrink-0 + nowrap): показать
                «1 000 0…» вместо 1 000 000 хуже, чем не показать вовсе.
                Место под неё освобождает логотип — он сжимаемый (shrink),
                и на узких экранах отдаёт ширину цифрам. Иконки кошелька здесь
                нет намеренно: на 320px её 24px не помещаются вместе с корзиной,
                а оранжевая сумма с «с» и так читается как деньги. */}
            {user && (
              <Link
                href="/wallet"
                className="flex items-baseline gap-0.5 shrink-0 whitespace-nowrap"
              >
                <span className="text-[13px] font-black text-[#F58220] tabular-nums">
                  {user.balance || "0"}
                </span>
                <span className="text-[11px] font-black text-[#F58220] underline">
                  с
                </span>
              </Link>
            )}

            <LanguageSwitcher isDark={!isMobileMenuOpen} />

            {user && (
              <Link
                href="/cart"
                className={clsx(
                  "relative shrink-0",
                  isMobileMenuOpen || !isDark ? "text-[#4B4B4B]" : "text-white",
                )}
              >
                <ShoppingCart size={24} strokeWidth={2} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#F58220] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={clsx(
                "p-1 shrink-0",
                isMobileMenuOpen || !isDark ? "text-[#4B4B4B]" : "text-white",
              )}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          onAuthClick={handleAuthClick}
          menuItems={headerMenu}
        />
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialFlow={authFlow}
      />
    </>
  );
};
