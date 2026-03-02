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

      {/* ========================================================= */}
      {/* 📱 МОБИЛЬНАЯ ВЕРСИЯ (Показывается до 768px)               */}
      {/* ========================================================= */}
      <div className='md:hidden bg-white rounded-[24px] shadow-sm border border-gray-100 p-5 sm:p-6 mt-4'>
        {/* Заголовки колонок */}
        <div className='grid grid-cols-2 gap-4 mb-5 border-b border-gray-100 pb-4'>
          <div className='text-center text-[11px] sm:text-xs font-medium text-[#4B4B4B] font-rubik leading-snug'>
            Сумма
            <br />
            выигрыша
          </div>
          <div className='text-center text-[11px] sm:text-xs font-medium text-[#4B4B4B] font-rubik leading-snug'>
            Количество
            <br />
            победителей
          </div>
        </div>

        {/* Данные (Ряды таблицы) */}
        <div className='flex flex-col gap-4 sm:gap-5'>
          {mockFund.map((item, idx) => (
            <div key={idx} className='grid grid-cols-2 gap-4 items-center'>
              <span className='text-center font-black text-[#F5A623] text-xl sm:text-[22px] whitespace-nowrap leading-none'>
                {item.amount}
              </span>
              <span className='text-center font-bold text-[#2D2D2D] text-xl sm:text-[22px] whitespace-nowrap leading-none'>
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 💻 ПК ВЕРСИЯ (Показывается от 768px и выше)               */}
      {/* ========================================================= */}
      <div
        className={clsx(
          'hidden md:block w-full overflow-x-auto pb-4 mt-4 bg-white shadow-sm rounded-[32px] border border-gray-100',
          // Стили кастомного скроллбара
          '[&::-webkit-scrollbar]:h-1.5',
          '[&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-50',
          '[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200',
          'hover:[&::-webkit-scrollbar-thumb]:bg-gray-300',
        )}
      >
        <div className='p-10 w-full min-w-0'>
          <div className='flex justify-between w-full items-center'>
            {/* Заголовки слева */}
            <div className='flex flex-col gap-4 justify-center shrink-0'>
              <div className='text-base font-medium text-[#4B4B4B] font-rubik'>
                Сумма выигрыша
              </div>
              <div className='text-base font-medium text-[#4B4B4B] font-rubik'>
                Количество
              </div>
            </div>

            {/* Вертикальный разделитель */}
            <div className='w-px h-[80px] bg-[#6E6E6E] mx-[22px]'></div>

            {/* Колонки с цифрами справа */}
            <div className='flex gap-[73px] flex-1'>
              {mockFund.map((item, idx) => (
                <div
                  key={idx}
                  className='flex flex-col items-center flex-1 gap-4 text-sm lg:text-[34px]'
                >
                  <span className='font-black text-[#F5A623] whitespace-nowrap'>
                    {item.amount}
                  </span>
                  <span className='font-bold text-[#2D2D2D] whitespace-nowrap'>
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
