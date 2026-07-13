"use client";

import { useState } from "react";

import { Pencil, Settings, User as UserIcon } from "lucide-react";

import { EditAvatarModal } from "./EditAvatarModal";
import { EditNameModal } from "./EditNameModal";

type ActiveModal = "avatar" | "name" | null;

export const ProfileQuickEditMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const openModal = (modal: ActiveModal) => {
    setIsMenuOpen(false);
    setActiveModal(modal);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen((prev) => !prev)}
        className="flex items-center justify-center w-10 h-10 rounded-full text-[#4B4B4B] hover:bg-gray-200 active:scale-95 transition-all cursor-pointer"
        aria-label="Настройки профиля"
      >
        <Settings size={22} />
      </button>

      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 shadow-xl rounded-2xl z-50 overflow-hidden py-2">
            <button
              onClick={() => openModal("avatar")}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-[14px] font-medium text-[#4B4B4B] hover:bg-[#F9F9F9] transition-colors cursor-pointer"
            >
              <UserIcon size={18} className="text-gray-400" />
              Изменить аватарку
            </button>
            <button
              onClick={() => openModal("name")}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-[14px] font-medium text-[#4B4B4B] hover:bg-[#F9F9F9] transition-colors cursor-pointer"
            >
              <Pencil size={18} className="text-gray-400" />
              Изменить имя
            </button>
          </div>
        </>
      )}

      <EditAvatarModal
        isOpen={activeModal === "avatar"}
        onClose={() => setActiveModal(null)}
      />
      <EditNameModal
        isOpen={activeModal === "name"}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
};
