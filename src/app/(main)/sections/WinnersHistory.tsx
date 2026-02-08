'use client';

// import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
// import { Star } from 'lucide-react';
import { Title } from '@/components/ui/Title';
import { Description } from '@/components/ui/Description';
import { useWinners } from '@/hooks/useWinners'; // Наш новый простой хук
import { WinnerCard } from '@/components/ui/WinnerCard';
import 'swiper/css';

export const WinnersHistory = () => {
  const { data: allWinners, isLoading } = useWinners();

  const winners = allWinners?.slice(0, 6) || [];

  if (isLoading) return null;

  return (
    <section className='my-12 relative overflow-hidden'>
      <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8'>
        <div className='max-w-2xl'>
          <Title>ИСТОРИЯ ПОБЕДИТЕЛЕЙ</Title>
          <Description>
            Популярные лотереи привлекают внимание благодаря крупным джекпотам,
            частым тиражам и удобным условиям участия.
          </Description>
        </div>

        <Link
          href='/winners'
          className='hidden lg:inline-flex items-center justify-center px-6 py-3 bg-white border border-gray-200 rounded-full text-xs font-bold font-benzin uppercase text-[#2D2D2D] hover:bg-gray-50 transition-colors shadow-sm'
        >
          Все победители
        </Link>
      </div>

      <Swiper
        spaceBetween={8}
        slidesPerView={2.1}
        breakpoints={{
          1280: { slidesPerView: 4 },
        }}
        className='overflow-visible!'
      >
        {winners.map((winner) => (
          <SwiperSlide key={winner.id}>
            {/* <div className='relative w-full h-53.25 lg:h-115.5 rounded-4xl overflow-hidden bg-gray-100'>
              <Image
                src={winner.image || '/placeholder-winner.jpg'}
                alt={winner.name}
                fill
                className='object-cover'
              />

              <div className='absolute top-3 left-3 bg-white rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm z-10'>
                <Star size={10} className='fill-[#6F51FF] text-[#6F51FF]' />{' '}
                <span className='text-[10px] font-black font-benzin uppercase text-[#6F51FF] tracking-wide'>
                  {winner.lotteryBadge}
                </span>
              </div>

              <div className='absolute bottom-4 left-4 right-4 bg-white/30 backdrop-blur-md border border-white/20 rounded-3xl p-4 flex flex-col items-center text-center shadow-sm'>
                <div className='flex flex-col mb-2'>
                  <h3 className='text-xs font-black text-[#2D2D2D] font-benzin uppercase mb-0.5'>
                    {winner.name}
                  </h3>
                  <p className='text-xs text-[#4B4B4B] font-rubik font-medium'>
                    {winner.city}
                  </p>
                </div>
                <span className='text-sm lg:text-base font-black text-black font-benzin tracking-tight leading-tight'>
                  {winner.prize}
                </span>
              </div>
            </div> */}
            <WinnerCard key={winner.id} winner={winner} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className='mt-8 lg:hidden'>
        <Link
          href='/winners'
          className='flex w-full items-center justify-center py-4 bg-white rounded-full text-xs font-bold font-benzin uppercase text-[#2D2D2D] shadow-md active:scale-95 transition-transform'
        >
          Все победители
        </Link>
      </div>
    </section>
  );
};