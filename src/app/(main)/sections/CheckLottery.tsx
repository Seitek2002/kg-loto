import { Description } from '@/components/ui/Description';
import { Title } from '@/components/ui/Title';

export const CheckLottery = () => {
  return (
    <section className='my-12'>
      <Title>ПРОВЕРКА ЛОТЕРЕИ</Title>
      <Description>
        Популярные лотереи привлекают внимание благодаря крупным джекпотам,
        частым тиражам и удобным условиям участия.
      </Description>

      {/* Форма */}
      <form className='flex flex-col gap-6'>
        <div className='flex flex-col gap-2'>
          <label
            htmlFor='draw-number'
            className='text-xs font-bold text-gray-900 font-rubik'
          >
            Номер тиража
          </label>
          <input
            id='draw-number'
            type='text'
            placeholder='YT-2637-23'
            className='w-full h-14 px-5 rounded-full bg-[#F5F5F5] text-sm text-gray-900 placeholder:text-gray-400 border-none outline-none focus:ring-2 focus:ring-gray-200 transition-all font-rubik'
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label
            htmlFor='ticket-number'
            className='text-xs font-bold text-gray-900 font-rubik'
          >
            Номер билета
          </label>
          <input
            id='ticket-number'
            type='text'
            placeholder='YT2357912'
            className='w-full h-14 px-5 rounded-full bg-[#F5F5F5] text-sm text-gray-900 placeholder:text-gray-400 border-none outline-none focus:ring-2 focus:ring-gray-200 transition-all font-rubik'
          />
        </div>

        {/* Кнопка */}
        <button
          type='button' // Пока ставим button, чтобы не перезагружал страницу
          className='mt-4 w-full h-11.5 bg-[#262626] text-white rounded-full font-bold text-xs uppercase tracking-wider hover:bg-black active:scale-[0.98] transition-all shadow-lg'
        >
          Проверить
        </button>
      </form>
    </section>
  );
};
