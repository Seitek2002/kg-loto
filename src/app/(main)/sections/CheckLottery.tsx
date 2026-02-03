import { Description } from '@/components/ui/Description';
import { Title } from '@/components/ui/Title';

export const CheckLottery = () => {
  return (
    <section className='my-12 lg:my-25'>
      <Title>ПРОВЕРКА ЛОТЕРЕИ</Title>
      <Description>
        Популярные лотереи привлекают внимание благодаря крупным джекпотам,
        частым тиражам и удобным условиям участия.
      </Description>

      {/* Форма */}
      <form className='flex flex-col lg:flex-row gap-6 lg:items-end lg:mt-10'>
        <div className='flex flex-col gap-2 lg:w-1/3'>
          <label
            htmlFor='draw-number'
            className='text-xs lg:text-xl font-bold text-gray-900 font-rubik'
          >
            Номер тиража
          </label>
          <input
            id='draw-number'
            type='text'
            placeholder='YT-2637-23'
            className='w-full lg:text-xl py-7 px-10 rounded-full lg:rounded-r-none bg-[#fff] text-sm text-gray-900 placeholder:text-gray-400 border-none outline-none focus:ring-2 focus:ring-gray-200 transition-all font-rubik'
          />
        </div>

        <div className='flex flex-col gap-2 lg:w-1/3'>
          <label
            htmlFor='ticket-number'
            className='text-xs lg:text-xl font-bold text-gray-900 font-rubik'
          >
            Номер билета
          </label>
          <input
            id='ticket-number'
            type='text'
            placeholder='YT2357912'
            className='w-full lg:text-xl py-7 px-10 rounded-full lg:rounded-none bg-[#fff] text-sm text-gray-900 placeholder:text-gray-400 border-none outline-none focus:ring-2 focus:ring-gray-200 transition-all font-rubik'
          />
        </div>

        {/* Кнопка */}
        <button
          type='button' // Пока ставим button, чтобы не перезагружал страницу
          className='mt-4 lg:rounded-l-none lg:mt-0 lg:text-xl w-full lg:w-1/3 h-11.5 lg:h-auto lg:py-7 bg-[#262626] text-white rounded-full font-bold text-xs uppercase tracking-wider hover:bg-black active:scale-[0.98] transition-all shadow-lg'
        >
          Проверить
        </button>
      </form>
    </section>
  );
};
