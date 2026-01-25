'use client';

import { PageHeader } from '@/components/ui/PageHeader';
import { useRouter } from 'next/navigation';

const banks = [
  { id: 'bakai', name: 'Bakai', logo: '/logos/bakai.png' }, // Нужны логотипы
  { id: 'o', name: 'O! Bank', logo: '/logos/o.png' },
  { id: 'mbank', name: 'Mbank', logo: '/logos/mbank.png' },
  { id: 'optima', name: 'Optima', logo: '/logos/optima.png' },
  { id: 'eldik', name: 'Eldik Bank', logo: '/logos/eldik.png' },
  { id: 'demir', name: 'Demir', logo: '/logos/demir.png' },
  { id: 'sber', name: 'Sber Bank', logo: '/logos/sber.png' },
  { id: 'tbank', name: 'T Bank', logo: '/logos/tbank.png' },
];

export default function WithdrawPage() {
  const router = useRouter();

  return (
    <div className='min-h-screen bg-[#F9F9F9] px-4 pt-2 pb-10'>
      <PageHeader title='' /> {/* Пустой заголовок, только стрелка */}
      <div className='mt-2 mb-8'>
        <h1 className='text-xl font-black font-benzin uppercase text-[#2D2D2D] mb-2'>
          ВЫБЕРИТЕ КОШЕЛЕК <br /> ПОПОЛНЕНИЯ!
        </h1>
        <p className='text-xs text-gray-400 font-rubik'>
          Деньги будут отправлены в течении 3 рабочих дней
        </p>
      </div>
      <div className='grid grid-cols-2 gap-4'>
        {banks.map((bank) => (
          <button
            key={bank.id}
            onClick={() => router.push(`/scan/withdraw/${bank.id}`)}
            className='bg-white rounded-3xl h-24 flex flex-col items-center justify-center gap-2 shadow-sm border border-transparent hover:border-yellow-400 hover:shadow-md transition-all'
          >
            {/* Заглушка для лого, если нет картинки */}
            <div className='w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-500'>
              {bank.name[0]}
            </div>
            <span className='text-xs font-bold font-rubik text-gray-700'>
              {bank.name}
            </span>
          </button>
        ))}
      </div>
      <button className='mt-8 w-full h-14 bg-[#FFD600] text-black rounded-full font-benzin font-bold text-sm uppercase tracking-wider shadow-lg'>
        Пополнить
      </button>
    </div>
  );
}
