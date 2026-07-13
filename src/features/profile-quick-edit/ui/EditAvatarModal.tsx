"use client";

import { useState } from "react";

import Image from "next/image";

import { useMutation } from "@tanstack/react-query";
import { Loader2, Upload, User as UserIcon } from "lucide-react";

import { authApi } from "@/entities/user/api/authApi";
import { useAuthStore } from "@/entities/user/model/authStore";

import { Modal } from "@/shared/ui/Modal";

interface EditAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditAvatarModal = ({ isOpen, onClose }: EditAvatarModalProps) => {
  const user = useAuthStore((state) => state.user);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setFile(null);
      setPreview(null);
      setError(null);
    }, 200);
  };

  const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (!picked) return;
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
  };

  const mutation = useMutation({
    mutationFn: () => authApi.updateProfile({ avatar: file! }),
    onSuccess: async () => {
      await fetchUser();
      handleClose();
    },
    onError: (err) => {
      const detail = (err as { response?: { data?: { detail?: unknown } } })
        ?.response?.data?.detail;
      setError(
        typeof detail === "string"
          ? detail
          : "Не удалось сохранить фото. Попробуйте ещё раз.",
      );
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="p-8">
      <h2 className="text-2xl font-black font-benzin uppercase text-[#4B4B4B] mb-6 pr-8">
        Изменить аватарку
      </h2>

      <div className="flex flex-col items-center gap-5">
        <div className="relative flex items-center justify-center w-24 h-24 rounded-full overflow-hidden border border-gray-200 bg-[#FFD600] shrink-0">
          {preview || user?.avatar ? (
            <Image
              src={preview || user!.avatar!}
              alt="Аватар"
              fill
              sizes="96px"
              className="object-cover"
            />
          ) : (
            <UserIcon size={36} className="text-[#4B4B4B]" />
          )}
        </div>

        <input
          type="file"
          id="quick-avatar-upload"
          accept="image/*"
          className="hidden"
          onChange={handlePick}
        />
        <label
          htmlFor="quick-avatar-upload"
          className="flex items-center gap-2 bg-white border border-[#4B4B4B] text-[#4B4B4B] cursor-pointer rounded-full px-5 py-2.5 active:scale-95 transition-transform"
        >
          <Upload size={16} />
          Выбрать фото
        </label>
      </div>

      {error && (
        <p className="text-[#FF4D4F] text-sm font-medium mt-4 text-center">
          {error}
        </p>
      )}

      <button
        onClick={() => mutation.mutate()}
        disabled={!file || mutation.isPending}
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
