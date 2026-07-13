"use client";

import { useState } from "react";

import Link from "next/link";

import { clsx } from "clsx";
import { ChevronDown, LucideIcon } from "lucide-react";

interface ProfileTab {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface ProfileTabsMobileDropdownProps {
  tabs: ProfileTab[];
  activeHref: string;
}

export const ProfileTabsMobileDropdown = ({
  tabs,
  activeHref,
}: ProfileTabsMobileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const activeTab = tabs.find((tab) => tab.href === activeHref) ?? tabs[0];
  const ActiveIcon = activeTab.icon;

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-2 bg-[#4B4B4B] text-white rounded-full pl-6 pr-5 py-3 font-benzin uppercase text-[13px] cursor-pointer active:scale-95 transition-transform"
      >
        <span className="flex items-center gap-2">
          <ActiveIcon size={18} />
          {activeTab.name}
        </span>
        <ChevronDown
          size={18}
          className={clsx(
            "transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-100 shadow-xl rounded-2xl z-50 overflow-hidden py-2">
            {tabs.map((tab) => {
              const isActive = tab.href === activeHref;
              const Icon = tab.icon;

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  onClick={() => setIsOpen(false)}
                  className={clsx(
                    "flex items-center gap-3 px-5 py-3 font-benzin uppercase text-[13px] transition-colors",
                    isActive
                      ? "bg-[#F5F5F5] text-[#4B4B4B]"
                      : "text-[#4B4B4B] hover:bg-[#F9F9F9]",
                  )}
                >
                  <Icon
                    size={18}
                    className={isActive ? "text-[#4B4B4B]" : "text-gray-400"}
                  />
                  {tab.name}
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
