import { BaseCard } from '@/components/ui/BaseCard';
import { QRCodeSVG } from 'qrcode.react';

interface QRPrizeCardProps {
  title: string;
  prizeName: string;
  qrValue: string;
}

export const QRPrizeCard = ({
  title,
  prizeName,
  qrValue,
}: QRPrizeCardProps) => {
  return (
    <BaseCard
      gradientFrom='from-[#a18cd1]'
      gradientTo='to-[#fbc2eb]'
      theme='white' // Текст белый
    >
      {/* Бейдж */}
      <div className='w-fit mb-4 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2'>
        <div className='w-2 h-2 rounded-full bg-green-400' />
        <span className='text-[10px] font-bold uppercase font-benzin text-white'>
          Выигрышный
        </span>
      </div>

      <h3 className='text-sm font-black font-benzin uppercase mb-2'>{title}</h3>
      <p className='text-xs text-white/80 font-rubik mb-6'>
        Покажите QR-код промоутеру для получения приза
      </p>

      <h2 className='text-2xl font-black font-benzin uppercase mb-8'>
        {prizeName}
      </h2>

      {/* QR Код по центру */}
      <div className='flex-1 flex items-center justify-center mb-8'>
        <div className='p-4 bg-white rounded-3xl shadow-lg'>
          <QRCodeSVG value={qrValue} size={160} />
        </div>
      </div>

      <button className='w-full py-4 bg-white text-black rounded-full font-benzin font-bold text-xs uppercase'>
        Где забрать?
      </button>
    </BaseCard>
  );
};
