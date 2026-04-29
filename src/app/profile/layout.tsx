import { ReactNode } from "react";

import { ProfileHeader } from "@/widgets/profile-header";

import { getServerUser } from "@/entities/user/api/server";

export default async function ProfileLayout({
  children,
}: {
  children: ReactNode;
}) {
  // 🔥 Фетчим профиль на стороне сервера
  const user = await getServerUser();

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-4 md:pt-6 pb-24 font-rubik">
      <div className="max-w-380 mx-auto px-4 sm:px-6 lg:px-8">
        <ProfileHeader initialUser={user} />

        {children}
      </div>
    </div>
  );
}
