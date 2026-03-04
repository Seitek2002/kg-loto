import { SafeImage } from '@/components/ui/SafeImage';
import { Title } from '@/components/ui/Title';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export const LotteryHero = async ({ data }: { data: any }) => {
  const t = await getTranslations('lottery');

  // Собираем призы в массив, отбрасывая пустые
  const prizes = [data.mainPrize1, data.mainPrize2, data.mainPrize3]
    .filter(Boolean)
    .map((text, idx) => ({ text, highlight: idx === 0 })); // Первый выделяем цветом

  return (
    <section className='mb-12 md:mb-20'>
      <nav className='flex items-center gap-6 text-[10px] md:text-base text-[#4b4b4b] font-rubik mb-6 md:mb-19'>
        <Link href='/' className='transition-colors hover:text-[#2D2D2D]'>
          {t('breadcrumb_home')}
        </Link>
        <span>/</span>
        <span>{t('breadcrumb_instant')}</span>
        <span className='hidden md:inline'>/</span>
        <span className='hidden md:inline font-medium'>{data.title}</span>
      </nav>

      <div className='mb-10'>
        <Title>{data.heroTitle || data.title}</Title>
      </div>

      <div className='bg-white rounded-3xl items-stretch md:rounded-[40px] p-4 md:p-10 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 lg:gap-16'>
        <div className='w-full md:w-1/2 lg:w-[45%] aspect-square relative shrink-0'>
          <SafeImage
            src={data.imageLive || '/images/lottery/ticket-placeholder.png'}
            alt={data.title}
            fill
            className='object-contain rounded-[10px]'
            fallbackText={data.title}
          />
        </div>

        <div className='w-full md:w-1/2 flex flex-col justify-center'>
          {prizes.length > 0 && (
            <>
              <p className='text-sm md:text-lg lg:text-4xl font-bold text-[#4B4B4B] font-rubik mb-4'>
                {t('main_prizes')}
              </p>
              <div className='flex flex-col gap-2 md:gap-4 mb-8 md:mb-12 font-semibold uppercase'>
                {prizes.map((prize, idx) => (
                  <div
                    key={idx}
                    className={`${
                      prize.highlight
                        ? 'text-3xl md:text-4xl lg:text-7xl text-[#F5A623]'
                        : 'text-xl md:text-2xl lg:text-5xl text-[#4b4b4b]'
                    }`}
                  >
                    {prize.text}
                  </div>
                ))}
              </div>
            </>
          )}

          <div className='mt-auto'>
            <span className='text-[#4B4B4B] text-xs font-medium md:text-base'>
              {t('offline_only')}
            </span>

            <Link
              href='/map'
              className='flex mt-4 items-center justify-center gap-2 w-full sm:w-fit bg-[#FF7A00] hover:bg-[#E66E00] text-white px-8 py-4 md:py-5 rounded-full font-bold text-xs md:text-2xl tracking-wider transition-all active:scale-95 shadow-lg shadow-orange-500/30'
            >
              {t('view_map')}
              <MapPin size={24} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
