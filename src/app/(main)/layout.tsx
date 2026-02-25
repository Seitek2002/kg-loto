// import { BottomNav } from '@/components/features/navigation/BottomNav';
import { Header } from '@/components/ui/Header';
import { Footer } from '../../widgets/Footer';
import dynamic from 'next/dynamic';

const BottomNav = dynamic(() =>
  import('../../components/features/navigation/BottomNav').then(
    (mod) => mod.BottomNav,
  ),
);

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='relative min-h-screen'>
      <Header theme='dark' />

      <main className='pb-20 mx-auto min-h-screen shadow-sm'>{children}</main>

      <BottomNav />
      <Footer />
    </div>
  );
}
