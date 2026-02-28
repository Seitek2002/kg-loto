import { SafeImage } from '@/components/ui/SafeImage';
import { MapPin } from 'lucide-react';
import Link from 'next/link';

// Моковые данные (потом заменишь на пропсы с сервера)
const mockHeroData = {
  title: 'МОМЕНТАЛЬНАЯ ЛОТЕРЕЯ "МЕН МИЛЛИОНЕР"',
  image: '/images/lottery/ticket-men-millioner.png',
  prizes: [
    { text: '3 x 1 000 000 c', highlight: true },
    { text: '3 x 100 000 c', highlight: false },
    { text: '3 x 50 000 c', highlight: false },
  ],
};

export const LotteryHero = () => {
  return (
    <section className='mb-12 md:mb-20'>
      {/* Хлебные крошки */}
      <nav className='flex items-center gap-2 text-[10px] md:text-xs text-gray-500 font-rubik mb-6 md:mb-10 uppercase'>
        <Link href='/' className='hover:text-[#2D2D2D] transition-colors'>
          Главная
        </Link>
        <span>/</span>
        <span className='text-gray-400'>Моментальные лотереи</span>
        <span className='hidden md:inline'>/</span>
        <span className='hidden md:inline text-gray-400'>Мен миллионер</span>
      </nav>

      <h1 className='text-lg md:text-2xl lg:text-3xl font-black font-benzin uppercase text-[#2D2D2D] mb-6 md:mb-8'>
        {mockHeroData.title}
      </h1>

      <div className='bg-white rounded-[24px] md:rounded-[40px] p-4 md:p-10 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 lg:gap-16'>
        {/* Картинка билета */}
        <div className='w-full md:w-1/2 lg:w-[45%] aspect-square relative shrink-0'>
          <SafeImage
            src={mockHeroData.image}
            alt='Билет'
            fill
            className='object-contain'
            fallbackText='Изображение билета'
          />
        </div>

        {/* Инфо о призах */}
        <div className='w-full md:w-1/2 flex flex-col justify-center'>
          <p className='text-sm md:text-base font-bold text-gray-400 font-rubik mb-4'>
            Главные призы:
          </p>
          <div className='flex flex-col gap-2 md:gap-4 mb-8 md:mb-12 font-black uppercase'>
            {mockHeroData.prizes.map((prize, idx) => (
              <div
                key={idx}
                className={`${prize.highlight ? 'text-3xl md:text-4xl lg:text-5xl text-[#F5A623]' : 'text-xl md:text-2xl lg:text-3xl text-[#2D2D2D]'}`}
              >
                {prize.text}
              </div>
            ))}
          </div>

          <Link
            href='/map'
            className='flex items-center justify-center gap-2 w-full sm:w-fit bg-[#FF7A00] hover:bg-[#E66E00] text-white px-8 py-4 md:py-5 rounded-full font-bold text-xs md:text-sm uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-orange-500/30'
          >
            Посмотреть карту продаж
            <MapPin size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};
