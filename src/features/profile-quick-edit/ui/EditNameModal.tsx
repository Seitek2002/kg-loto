"use client";

import { useEffect, useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { authApi } from "@/entities/user/api/authApi";
import { useAuthStore } from "@/entities/user/model/authStore";

import { Input } from "@/shared/ui/Input";
import { Modal } from "@/shared/ui/Modal";

interface EditNameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditNameModal = ({ isOpen, onClose }: EditNameModalProps) => {
  const user = useAuthStore((state) => state.user);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [error, setError] = useState<string | null>(null);

  // Подтягиваем актуальные значения при каждом открытии модалки
  useEffect(() => {
    if (isOpen) {
      setFirstName(user?.firstName || "");
      setLastName(user?.lastName || "");
      setError(null);
    }
  }, [isOpen, user?.firstName, user?.lastName]);

  const mutation = useMutation({
    mutationFn: () => authApi.updateProfile({ firstName, lastName }),
    onSuccess: async () => {
      await fetchUser();
      onClose();
    },
    onError: (err) => {
      const detail = (err as { response?: { data?: { detail?: unknown } } })
        ?.response?.data?.detail;
      setError(
        typeof detail === "string"
          ? detail
          : "Не удалось сохранить имя. Попробуйте ещё раз.",
      );
    },
  });

  const isValid = firstName.trim() !== "" && lastName.trim() !== "";

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="p-8">
      <h2 className="text-2xl font-black font-benzin uppercase text-[#4B4B4B] mb-6 pr-8">
        Изменить имя
      </h2>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-[#4B4B4B] pl-1">
            Имя
          </label>
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-[#4B4B4B] pl-1">
            Фамилия
          </label>
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <p className="text-[#FF4D4F] text-sm font-medium mt-4">{error}</p>
      )}

      <button
        onClick={() => mutation.mutate()}
        disabled={!isValid || mutation.isPending}
        className="w-full mt-6 flex justify-center items-center bg-[#FFD600] text-[#4B4B4B] font-bold uppercase py-4 rounded-full hover:bg-[#ffe033] shadow-md transition-all active:scale-95 text-[14px] disabled:opacity-60"
      >
        {mutation.isPending ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          "Сохранить"
        )}
      </button>
    </Modal>
  );
};
