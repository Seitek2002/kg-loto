import { Description } from '@/components/ui/Description';
import { Title } from '@/components/ui/Title';
import { clsx } from 'clsx';

const mockFund = [
  { amount: '500 000', count: '1' },
  { amount: '100 000', count: '2' },
  { amount: '50 000', count: '5' },
  { amount: '10 000', count: '10' },
  { amount: '500', count: '100' },
  { amount: '50', count: '20 000' },
];

export const LotteryPrizeFund = () => {
  return (
    <section className='mb-12 md:mb-20'>
      <Title>Призовой фонд</Title>
      <Description>{''}</Description>

      {/* Обертка для мобильного скролла */}
      <div className='w-full overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:overflow-visible'>
        <div className='bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-10 shadow-sm border border-gray-100 min-w-[600px] md:min-w-0'>
          <div className='flex justify-between w-full items-center'>
            <div className='flex flex-col gap-4 justify-center shrink-0'>
              <div className='text-[10px] md:text-base font-medium text-[#4B4B4B] font-rubik'>
                Сумма выигрыша
              </div>
              <div className='text-[10px] md:text-base font-medium text-[#4B4B4B] font-rubik'>
                Количество
              </div>
            </div>

            <div className='w-px h-[80px] bg-[#6E6E6E] mx-[22px]'></div>

            <div className='flex w-full'>
              {mockFund.map((item, idx) => (
                <div
                  key={idx}
                  className={clsx(
                    'flex flex-col items-center flex-1 gap-4 text-xs md:text-sm lg:text-[34px]',
                  )}
                >
                  <div className='font-black text-[#F5A623]'>
                    {item.amount}
                  </div>

                  <div className='font-rubik font-bold text-[#2D2D2D]'>
                    {item.count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
