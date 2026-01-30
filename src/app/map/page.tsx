'use client';

import { useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ArrowLeft, Search, X, Copy, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

// 🔥 Динамический импорт карты (чтобы не падало на сервере)
const MapComponent = dynamic(
  () => import('@/components/features/map/LeafletMap'),
  {
    loading: () => (
      <div className='w-full h-full flex items-center justify-center bg-[#E5E5E5] text-gray-400'>
        <Loader2 className='animate-spin' size={32} />
      </div>
    ),
    ssr: false, // Отключаем Server Side Rendering для карты
  },
);

// Реальные координаты филиалов в Бишкеке
const branches = [
  {
    id: '1',
    name: 'Лотереи «Кыргыз Лото»',
    address: 'ул. Аалы Токомбаева, 53/2',
    lat: 42.8225,
    lng: 74.613, // Южные ворота
  },
  {
    id: '2',
    name: '«Кыргыз Лото» Центр',
    address: 'пр. Чуй, 120',
    lat: 42.8755,
    lng: 74.603, // Площадь
  },
  {
    id: '3',
    name: 'Филиал «Восток»',
    address: 'ул. 7 Апреля, 21',
    lat: 42.855,
    lng: 74.65, // Мадина/Восток
  },
  {
    id: '4',
    name: 'Точка продаж ЦУМ',
    address: 'пр. Чуй, 155',
    lat: 42.8765,
    lng: 74.614, // ЦУМ
  },
];

// --- ВНУТРЕННИЙ КОМПОНЕНТ С ЛОГИКОЙ ---
function MapContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Получаем активный ID из URL или берем первый филиал как дефолт (опционально)
  const targetBranchId = searchParams.get('branch');

  const [search, setSearch] = useState('');

  // Фильтрация
  const filteredBranches = useMemo(() => {
    return branches.filter(
      (b) =>
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.address.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  // Хендлер выбора филиала (меняет URL без перезагрузки)
  const handleSelectBranch = (id: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('branch', id);
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className='relative h-screen w-full bg-[#E5E5E5] overflow-hidden flex flex-col'>
      {/* 1. РЕАЛЬНАЯ КАРТА */}
      <div className='absolute inset-0 z-0'>
        <MapComponent
          branches={branches}
          activeId={targetBranchId}
          onMarkerClick={handleSelectBranch}
        />
        {/* Градиент снизу, чтобы список красиво накладывался */}
        <div className='absolute bottom-0 left-0 right-0 h-64 bg-linear-to-t from-white via-white/80 to-transparent pointer-events-none z-400' />
      </div>

      {/* 3. ХЕДЕР (Плавающий) */}
      <div className='absolute top-0 left-0 right-0 z-1000 pt-4 px-4 flex items-center justify-center pointer-events-none'>
        <button
          onClick={() => router.back()}
          className='absolute left-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md text-[#2D2D2D] active:scale-95 pointer-events-auto hover:bg-gray-50'
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className='text-xl font-black font-benzin uppercase text-[#2D2D2D] bg-white/80 backdrop-blur-md px-6 py-2 rounded-2xl shadow-sm'>
          КАРТЫ
        </h1>
      </div>

      {/* 4. КОНТЕНТ СНИЗУ */}
      <div className='mt-auto relative z-1000 flex flex-col gap-4 pb-8'>
        {/* Поиск */}
        <div className='px-4'>
          <div className='relative shadow-xl'>
            <input
              type='text'
              placeholder='Поиск адреса...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-full h-14 pl-5 pr-12 rounded-full bg-white text-sm font-bold text-gray-800 placeholder:text-gray-400 font-rubik outline-none border-2 border-transparent focus:border-[#FFD600] transition-colors'
            />
            {search ? (
              <button
                onClick={() => setSearch('')}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 p-1 hover:text-black'
              >
                <X size={20} />
              </button>
            ) : (
              <Search
                className='absolute right-5 top-1/2 -translate-y-1/2 text-gray-400'
                size={20}
              />
            )}
          </div>
        </div>

        {/* Список карточек */}
        <div className='px-4 max-h-[35vh] overflow-y-auto space-y-3 pb-safe scrollbar-hide'>
          {filteredBranches.map((branch) => {
            const isActive = branch.id === targetBranchId;
            return (
              <div
                key={branch.id}
                onClick={() => handleSelectBranch(branch.id)}
                className={clsx(
                  'bg-white p-4 rounded-3xl flex items-center justify-between shadow-sm border-2 transition-all cursor-pointer active:scale-[0.98]',
                  isActive
                    ? 'border-[#FFD600] ring-1 ring-[#FFD600] bg-yellow-50/50'
                    : 'border-transparent hover:border-gray-200',
                )}
              >
                <div>
                  <h3 className='text-xs font-black font-benzin uppercase text-[#2D2D2D] mb-1'>
                    {branch.name}
                  </h3>
                  <p className='text-xs text-gray-500 font-rubik'>
                    {branch.address}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Чтобы не срабатывал клик по карточке
                    navigator.clipboard.writeText(branch.address);
                  }}
                  className='w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#FFD600] hover:text-black transition-colors'
                >
                  <Copy size={18} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// --- ОСНОВНОЙ ЭКСПОРТ (ОБЕРТКА SUSPENSE) ---
export default function MapPage() {
  return (
    <Suspense
      fallback={
        <div className='w-full h-screen flex items-center justify-center bg-[#E5E5E5]'>
          <Loader2 className='animate-spin text-gray-400' size={48} />
        </div>
      }
    >
      <MapContent />
    </Suspense>
  );
}
