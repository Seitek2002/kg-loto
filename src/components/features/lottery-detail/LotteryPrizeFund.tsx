const mockFund = [
  { amount: '500 000', count: '1', special: true },
  { amount: '100 000', count: '2', special: false },
  { amount: '50 000', count: '5', special: false },
  { amount: '10 000', count: '10', special: false },
  { amount: '500', count: '100', special: false },
  { amount: '50', count: '20 000', special: false },
];

export const LotteryPrizeFund = () => {
  return (
    <section className='mb-12 md:mb-20'>
      <h2 className='text-base md:text-xl font-black font-benzin uppercase text-[#2D2D2D] mb-6 md:mb-8'>
        Призовой фонд
      </h2>

      {/* Обертка для мобильного скролла, если колонок будет слишком много */}
      <div className='w-full overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:overflow-visible'>
        <div className='bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-10 shadow-sm border border-gray-100 min-w-[600px] md:min-w-0'>
          {/* Заголовки таблицы */}
          <div className='flex items-center mb-6 md:mb-8 border-b border-gray-100 pb-4'>
            <div className='w-1/4 text-[10px] md:text-xs font-bold text-gray-400 uppercase font-rubik'>
              Сумма выигрыша
              <span className='block text-[8px] md:text-[10px] text-gray-300 normal-case mt-1'>
                в сомах
              </span>
            </div>
            {/* Рендерим суммы */}
            <div className='w-3/4 flex justify-between font-benzin font-black text-xs md:text-sm lg:text-base text-[#F5A623]'>
              {mockFund.map((item, idx) => (
                <div key={idx} className='flex-1 text-center'>
                  {item.amount}
                </div>
              ))}
            </div>
          </div>

          {/* Строка с количеством */}
          <div className='flex items-center'>
            <div className='w-1/4 text-[10px] md:text-xs font-bold text-gray-400 uppercase font-rubik'>
              Количество
              <span className='block text-[8px] md:text-[10px] text-gray-300 normal-case mt-1'>
                в тираже
              </span>
            </div>
            {/* Рендерим количество */}
            <div className='w-3/4 flex justify-between font-rubik font-bold text-sm md:text-base lg:text-lg text-[#2D2D2D]'>
              {mockFund.map((item, idx) => (
                <div
                  key={idx}
                  className='flex-1 text-center flex items-center justify-center gap-1'
                >
                  {item.count}
                  {/* Иконка авто, если special === true */}
                  {item.special && (
                    <span className='text-red-500 text-sm'>🚗</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
