import { SafeImage } from '@/components/ui/SafeImage';
import { Title } from '@/components/ui/Title';

const mockSteps = [
  {
    id: 1,
    image: '/images/lottery/step-1.png',
    text: '1. Сотрите защитный слой на игровом поле.',
  },
  {
    id: 2,
    image: '/images/lottery/step-2.png',
    text: '2. Найдите 3 одинаковые суммы или символы.',
  },
  {
    id: 3,
    image: '/images/lottery/step-3.png',
    text: '3. Выигрыш равен одной из трех совпавших сумм.',
  },
];

export const LotteryHowToPlay = () => {
  return (
    <section className='mb-12 md:mb-20'>
      <div className="mb-10">
        <Title>Как играть</Title>
      </div>

      {/* Сетка: 1 колонка на мобилках, 3 колонки на ПК */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 bg-white shadow-sm border border-gray-100 p-4 rounded-[24px] md:rounded-[32px]'>
        {mockSteps.map((step) => (
          <div key={step.id} className='flex flex-col gap-4 max-w-[430px]'>
            {/* Карточка с картинкой (квадратные пропорции) */}
            <div className='w-full relative overflow-hidden'>
              <SafeImage
                src={step.image}
                alt={`Шаг ${step.id}`}
                width={430}
                height={430}
                sizes='(max-width: 768px) 100vw, 50vw'
                className='object-contain p-4 rounded-[10px] max-w-full'
                fallbackText={`Изображение шага ${step.id}`}
              />
            </div>
            {/* Текст шага */}
            <p className='text-xs md:text-xl font-medium text-[#4b4b4b] leading-relaxed px-4 mr-20'>
              {step.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
