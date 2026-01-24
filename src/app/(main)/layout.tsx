import { BottomNav } from '@/components/features/navigation/BottomNav';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='relative min-h-screen bg-gray-50'>
      {/* Основной контейнер. 
        pb-20 (80px) нужен, чтобы контент не заезжал под фиксированный BottomNav (высотой 64px)
      */}
      <main className='pb-20 mx-auto max-w-md bg-white min-h-screen shadow-sm'>
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
