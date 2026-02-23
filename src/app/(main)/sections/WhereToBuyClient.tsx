'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Title } from '@/components/ui/Title';
import { Description } from '@/components/ui/Description';
import { Copy, Loader2 } from 'lucide-react';
import { BranchItem } from '@/types/api';

const LeafletMap = dynamic(
  () => import('@/components/features/map/LeafletMap'),
  {
    loading: () => (
      <div className='w-full h-full flex items-center justify-center bg-[#E5E5E5] text-gray-400'>
        <Loader2 className='animate-spin' size={32} />
      </div>
    ),
    ssr: false,
  },
);

interface WhereToBuyClientProps {
  branches: BranchItem[];
}

// Компонент НЕ асинхронный, он просто получает готовые данные через пропсы
export const WhereToBuyClient = ({ branches }: WhereToBuyClientProps) => {
  const mapBranches = useMemo(() => {
    return branches
      .map((b) => ({
        id: String(b.id),
        name: b.name,
        address: b.address,
        lat: parseFloat(b.lat),
        lng: parseFloat(b.lng),
      }))
      .filter((b) => !isNaN(b.lat) && !isNaN(b.lng));
  }, [branches]);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const activeId =
    selectedId || (mapBranches.length > 0 ? mapBranches[0].id : null);

  const activeBranch = mapBranches.find((b) => b.id === activeId);

  const handleCopyAddress = () => {
    if (activeBranch) {
      navigator.clipboard.writeText(activeBranch.address);
      // toast('Адрес скопирован');
    }
  };

  if (mapBranches.length === 0) return null;

  return (
    <section className='my-20 relative' id='map'>
      <div className='mb-8 max-w-2xl'>
        <Title>ГДЕ ПРИОБРЕСТИ БИЛЕТЫ</Title>
        <Description>
          Если не нашли ответа на свой вопрос, просто спросите у нас в привычном
          мессенджере.
        </Description>
      </div>

      <div className='relative w-full h-100 lg:h-125 rounded-[40px] overflow-hidden shadow-sm border border-gray-100'>
        <LeafletMap
          branches={mapBranches}
          activeId={activeId}
          onMarkerClick={setSelectedId}
        />

        {activeBranch && (
          <div className='absolute bottom-6 left-4 right-4 lg:left-1/2 lg:right-auto lg:-translate-x-1/2 z-[400]'>
            <div className='bg-white/90 backdrop-blur-md px-6 py-4 rounded-3xl shadow-xl border border-white/50 flex flex-col items-center text-center lg:flex-row lg:text-left gap-2 lg:gap-4 max-w-xl mx-auto'>
              <span className='text-gray-400 text-[10px] lg:text-xs font-bold font-benzin uppercase tracking-wide whitespace-nowrap'>
                Лотереи {activeBranch.name} по адресу:
              </span>

              <div
                onClick={handleCopyAddress}
                className='flex items-center gap-2 cursor-pointer group'
              >
                <span className='text-[#2D2D2D] text-xs lg:text-sm font-black font-benzin uppercase leading-tight group-hover:text-[#FFD600] transition-colors'>
                  {activeBranch.address}
                </span>
                <Copy
                  size={14}
                  className='text-gray-400 group-hover:text-[#FFD600] transition-colors'
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
