"use client";

import { useEffect } from "react";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { clsx } from "clsx";
import { Headphones, Settings, Ticket, Trophy } from "lucide-react";

import { useAuthStore } from "@/entities/user/model/authStore";
import { User } from "@/entities/user/model/types";

interface ProfileHeaderProps {
  initialUser: User | null;
}

const getInitials = (firstName?: string, lastName?: string) => {
  if (!firstName && !lastName) return "U";
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
};

export const ProfileHeader = ({ initialUser }: ProfileHeaderProps) => {
  const pathname = usePathname();
  const t = useTranslations("profile_header");

  const { user: storeUser, setUser } = useAuthStore();

  // 🔥 Синхронизируем серверные данные с клиентским Zustand стором
  useEffect(() => {
    if (initialUser && !storeUser) {
      setUser(initialUser);
    }
  }, [initialUser, storeUser, setUser]);

  // Используем storeUser, если он обновился на клиенте, иначе фоллбек на серверный
  const currentUser = storeUser || initialUser;

  const TABS = [
    { name: t("tabs.my_tickets"), href: "/profile", icon: Ticket },
    { name: t("tabs.my_prizes"), href: "/profile/prizes", icon: Trophy },
    { name: t("tabs.support"), href: "/profile/support", icon: Headphones },
    { name: t("tabs.settings"), href: "/profile/settings", icon: Settings },
  ];

  const fullName = currentUser
    ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() ||
      "Пользователь"
    : "Загрузка...";

  const displayContact =
    currentUser?.email ||
    (typeof currentUser?.phone === "string"
      ? currentUser.phone
      : currentUser?.phone
        ? `${currentUser.phone.dialCode} ${currentUser.phone.number}`
        : "");

  const avatarUrl = currentUser?.avatar || null;
  const initials = getInitials(currentUser?.firstName, currentUser?.lastName);

  return (
    <div className="flex flex-col items-center max-w-261.25 mb-4 mx-auto">
      <div className="w-full flex justify-start mb-6 text-base text-[#4B4B4B]">
        <Link href="/" className="hover:opacity-80">
          {t("breadcrumbs.home")}
        </Link>
        <span className="mx-2 md:mx-6">/</span>
        <span className="text-[#4B4B4B] font-semibold">
          {t("breadcrumbs.profile")}
        </span>
      </div>

      <div className="flex flex-col items-center mb-10">
        <div className="relative flex items-center justify-center w-15 h-15 sm:w-30 sm:h-30 rounded-full overflow-hidden mb-6 border border-gray-200 bg-[#FFD600] text-[#4B4B4B] text-2xl sm:text-3xl font-benzin tracking-wider shadow-sm">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={fullName}
              fill
              sizes="120px"
              className="object-cover"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        <h1 className="text-xl sm:text-[28px] font-semibold text-[#4B4B4B] mb-3 leading-5">
          {fullName}
        </h1>
        <p className="text-xs sm:text-base text-[#A3A3A3] font-medium">
          {displayContact}
        </p>
      </div>

      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex justify-start sm:justify-between items-center">
          {TABS.map((tab) => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon;

            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={clsx(
                  "flex items-center gap-2 px-6 py-3 rounded-full font-benzin uppercase transition-all whitespace-nowrap active:scale-95",
                  isActive
                    ? "bg-[#4B4B4B] text-white shadow-md"
                    : "bg-transparent text-[#4B4B4B] hover:bg-gray-200 hover:text-[#4B4B4B]",
                )}
              >
                <Icon
                  size={24}
                  className={clsx(isActive ? "text-white" : "text-[#4B4B4B]")}
                />
                <span className="font-extralight text-[10px] sm:text-base">
                  {tab.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
