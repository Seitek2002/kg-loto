'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Search, X, Copy } from 'lucide-react';
import { clsx } from 'clsx';

const branches = [
  {
    id: '1',
    name: 'Лотереи «Кыргыз Лото»',
    address: 'ул. Аалы Токомбаева, 53/2',
    coords: { top: '30%', left: '40%' },
  },
  {
    id: '2',
    name: '«Кыргыз Лото» Центр',
    address: 'пр. Чуй, 120',
    coords: { top: '50%', left: '60%' },
  },
  {
    id: '3',
    name: 'Филиал «Восток»',
    address: 'ул. 7 Апреля, 21',
    coords: { top: '60%', left: '30%' },
  },
  {
    id: '4',
    name: 'Точка продаж ЦУМ',
    address: 'пр. Чуй, 155',
    coords: { top: '40%', left: '70%' },
  },
];

export default function MapPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetBranchId = searchParams.get('branch');

  const [search, setSearch] = useState('');

  // Фильтрация (для вида)
  const filteredBranches = branches.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.address.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className='relative h-screen w-full bg-[#E5E5E5] overflow-hidden flex flex-col'>
      {/* 1. ФОН-КАРТА (ИМИТАЦИЯ) */}
      {/* В реальном проекте здесь будет <MapComponent /> */}
      <div className='absolute inset-0 z-0 opacity-60'>
        {/* Просто паттерн, похожий на карту */}
        <div className="w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Map_of_Bishkek.png')] bg-cover bg-center grayscale contrast-50 opacity-50" />
      </div>

      {/* 2. МАРКЕРЫ НА КАРТЕ */}
      {branches.map((branch) => {
        const isActive = branch.id === targetBranchId;
        return (
          <div
            key={branch.id}
            className={clsx(
              'absolute px-4 py-2 rounded-full font-bold text-[10px] font-benzin uppercase tracking-wide transition-all shadow-lg transform -translate-x-1/2 -translate-y-1/2 cursor-pointer',
              isActive
                ? 'bg-[#FFD600] text-black z-20 scale-110 border-2 border-white'
                : 'bg-[#1F1F1F] text-white z-10',
            )}
            style={{ top: branch.coords.top, left: branch.coords.left }}
          >
            {isActive ? branch.name : '«Кыргыз Лото»'}
            {/* Треугольничек снизу */}
            <div
              className={clsx(
                'absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45',
                isActive ? 'bg-[#FFD600]' : 'bg-[#1F1F1F]',
              )}
            />
          </div>
        );
      })}

      {/* 3. ХЕДЕР (Плавающий) */}
      <div className='absolute top-0 left-0 right-0 z-30 pt-4 px-4 flex items-center justify-center pointer-events-none'>
        <button
          onClick={() => router.back()}
          className='absolute left-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md text-[#2D2D2D] active:scale-95 pointer-events-auto'
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className='text-xl font-black font-benzin uppercase text-[#2D2D2D] bg-white/50 backdrop-blur-sm px-4 py-1 rounded-xl'>
          КАРТЫ
        </h1>
      </div>

      {/* 4. КОНТЕНТ СНИЗУ (Поиск + Список) */}
      <div className='mt-auto relative z-30 flex flex-col gap-4 pb-8'>
        {/* Поиск (Плавающий) */}
        <div className='px-4'>
          <div className='relative shadow-xl'>
            <input
              type='text'
              placeholder='Поиск адреса...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-full h-14 pl-5 pr-12 rounded-full bg-white text-sm font-bold text-gray-800 placeholder:text-gray-400 font-rubik outline-none'
            />
            {search ? (
              <button
                onClick={() => setSearch('')}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400'
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

        {/* Список карточек (Горизонтальный скролл если их много, или вертикальный стек) */}
        {/* На скрине это вертикальный список, уходящий вниз */}
        <div className='px-4 max-h-[40vh] overflow-y-auto space-y-3 pb-safe scrollbar-hide'>
          {filteredBranches.map((branch) => (
            <div
              key={branch.id}
              className={clsx(
                'bg-white p-4 rounded-3xl flex items-center justify-between shadow-sm border transition-colors',
                branch.id === targetBranchId
                  ? 'border-[#FFD600] ring-1 ring-[#FFD600]'
                  : 'border-white',
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
              <button className='w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors'>
                <Copy size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
