"use client";

import { useEffect, useMemo, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";

import { authApi } from "@/entities/user/api/authApi";
import { useAuthStore } from "@/entities/user/model/authStore";

import { Input } from "@/shared/ui/Input";

interface FormData {
  lastName: string;
  firstName: string;
  middleName: string;
  birthDate: string;
  inn: string;
  email: string;
  phone: string;
}

const getInitials = (firstName?: string, lastName?: string) => {
  if (!firstName && !lastName) return "U";
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
};

export const AccountForm = () => {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [passportFront, setPassportFront] = useState<string | null>(null);
  const [passportBack, setPassportBack] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState(false);

  const initialData: FormData = useMemo(() => {
    const formattedPhone =
      typeof user?.phone === "string"
        ? user.phone
        : user?.phone
          ? `${user.phone.dialCode || ""} ${user.phone.number || ""}`.trim()
          : "";

    return {
      lastName: user?.lastName || "",
      firstName: user?.firstName || "",
      middleName: user?.middleName || "",
      birthDate: user?.birthDate || "",
      inn: user?.inn || "",
      email: user?.email || "",
      phone: formattedPhone,
    };
  }, [user]);

  const [formData, setFormData] = useState<FormData>(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const updateMutation = useMutation({
    mutationFn: async (dataToUpdate: Partial<FormData>) => {
      return authApi.updateProfile({
        lastName: dataToUpdate.lastName,
        firstName: dataToUpdate.firstName,
        middleName: dataToUpdate.middleName,
        birthDate: dataToUpdate.birthDate,
        email: dataToUpdate.email,
      });
    },
    onSuccess: async () => {
      await fetchUser();
      setAvatarPreview(null);
      setPassportFront(null);
      setPassportBack(null);
    },
    onError: (err) => console.error("Ошибка обновления профиля", err),
  });

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: (url: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const isDataChanged =
    JSON.stringify(formData) !== JSON.stringify(initialData);
  const hasImagesChanged =
    avatarPreview !== null || passportFront !== null || passportBack !== null;
  const hasChanges = isDataChanged || hasImagesChanged;

  const handleReset = () => {
    setFormData(initialData);
    setAvatarPreview(null);
    setPassportFront(null);
    setPassportBack(null);
  };

  const handleSave = () => updateMutation.mutate(formData);

  if (!user)
    return (
      <div className="animate-pulse h-96 bg-gray-100 rounded-3xl w-full"></div>
    );

  const initials = getInitials(user.firstName, user.lastName);
  const serverAvatar = user.avatar;

  return (
    <div className="flex flex-col gap-8">
      {/* Аватар */}
      <div className="flex items-center gap-6">
        <div className="relative flex items-center justify-center w-17.5 h-17.5 rounded-full overflow-hidden border border-gray-200 bg-[#FFD600] text-[#4B4B4B] text-xl font-black font-benzin tracking-wider shadow-sm shrink-0">
          {(avatarPreview || serverAvatar) && !avatarError ? (
            <Image
              src={avatarPreview || serverAvatar!}
              alt="Аватар"
              fill
              sizes="70px"
              className="object-cover"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        <div className="flex items-center gap-2 text-[14px] font-medium">
          <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              setAvatarError(false);
              handleImageUpload(e, setAvatarPreview);
            }}
          />
          <label
            htmlFor="avatar-upload"
            className="bg-[#4B4B4B] cursor-pointer text-white rounded-full px-5 py-2.5 active:scale-95 transition-transform inline-block"
          >
            Изменить фото
          </label>
          <button
            onClick={() => setAvatarPreview(null)}
            className="bg-white cursor-pointer border border-[#4B4B4B] text-[#4B4B4B] rounded-full px-5 py-2.5 hover:bg-gray-50 active:scale-95 transition-all"
          >
            Удалить
          </button>
        </div>
      </div>

      {/* Основные данные (ИСПОЛЬЗУЕМ НАШ INPUT) */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-bold text-[#4B4B4B] pl-1">
            Фамилия
          </label>
          <Input
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-bold text-[#4B4B4B] pl-1">
            Имя
          </label>
          <Input
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-bold text-[#4B4B4B] pl-1">
            Отчество
          </label>
          <Input
            value={formData.middleName}
            onChange={(e) =>
              setFormData({ ...formData, middleName: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-bold text-[#4B4B4B] pl-1">
            Дата рождения
          </label>
          <Input
            value={formData.birthDate}
            placeholder="YYYY-MM-DD"
            onChange={(e) =>
              setFormData({ ...formData, birthDate: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-bold text-[#4B4B4B] pl-1">
            ИНН
          </label>
          <Input
            value={formData.inn}
            disabled={true}
            onChange={(e) => setFormData({ ...formData, inn: e.target.value })}
          />
        </div>
      </div>

      {/* Контакты */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-bold text-[#4B4B4B] pl-1">
            Email
          </label>
          <Input
            type="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-bold text-[#4B4B4B] pl-1">
            Телефон
          </label>
          <Input
            type="tel"
            disabled={true}
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        </div>
      </div>

      {hasChanges && (
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <button
            onClick={handleReset}
            disabled={updateMutation.isPending}
            className="flex-1 border border-[#4B4B4B] text-[#4B4B4B] font-bold uppercase py-4 rounded-full hover:bg-gray-50 transition-colors active:scale-95 text-[14px] disabled:opacity-50"
          >
            Сбросить изменения
          </button>
          <button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="flex-1 flex justify-center items-center bg-[#FFD600] text-[#4B4B4B] font-bold uppercase py-4 rounded-full hover:bg-[#ffe033] shadow-md transition-all active:scale-95 text-[14px] disabled:opacity-70"
          >
            {updateMutation.isPending ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Изменить"
            )}
          </button>
        </div>
      )}

      <div className="flex flex-col items-center gap-3 mt-4 text-[16px] font-bold uppercase">
        <button className="text-[#DC2626] hover:underline transition-all cursor-pointer">
          Удалить аккаунт
        </button>
        <button
          onClick={handleLogout}
          className="text-[#4B4B4B] hover:underline transition-all cursor-pointer"
        >
          Выйти
        </button>
      </div>
    </div>
  );
};
