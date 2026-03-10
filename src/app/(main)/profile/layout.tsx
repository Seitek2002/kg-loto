import { ProfileHeader } from '@/components/features/profile/ProfileHeader';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-[#F5F5F5] pt-4 md:pt-6 pb-24 font-rubik'>
      <div className='max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8'>
        <ProfileHeader />

        {/* 🔥 Убрали отсюда белый контейнер. Теперь каждая страница сама решает, какой у нее фон */}
        {children}
      </div>
    </div>
  );
}
