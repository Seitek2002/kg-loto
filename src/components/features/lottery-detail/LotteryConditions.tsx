import { Description } from '@/components/ui/Description';
import { Title } from '@/components/ui/Title';
import clsx from 'clsx';

const mockConditions = [
  'В лотерее могут участвовать лица старше 18 лет.',
  'Билет действителен только при наличии неповрежденного штрих-кода.',
  'Выплата выигрышей осуществляется при предъявлении паспорта.',
  'Организатор имеет право запрашивать дополнительные данные.',
  'Срок обращения за выигрышем составляет 30 дней.',
  'Поврежденные билеты к участию не принимаются.',
  'Налог на выигрыш оплачивается победителем самостоятельно.',
  'Приобретая билет, вы соглашаетесь с условиями оферты.',
];

export const LotteryConditions = () => {
  // Вычисляем количество строк (например, для 8 элементов в 2 колонки это будет 4 строки)
  const ROWS = Math.ceil(mockConditions.length / 2);

  // Хак для Tailwind: он не умеет собирать классы из переменных "на лету",
  // поэтому заранее пишем маппер для самых частых вариантов.
  const gridRowsClasses: Record<number, string> = {
    1: 'lg:grid-rows-1',
    2: 'lg:grid-rows-2',
    3: 'lg:grid-rows-3',
    4: 'lg:grid-rows-4',
    5: 'lg:grid-rows-5',
    6: 'lg:grid-rows-6',
  };
  const gridRowsClass = gridRowsClasses[ROWS] || 'lg:grid-rows-4';

  return (
    <section className='mb-12 md:mb-20'>
      <div className='mb-6 md:mb-8'>
        <Title>Условия участия</Title>
        <Description>
          Приобретая лотерейный билет, вы автоматически соглашаетесь с правилами
          проведения лотереи. Пожалуйста, внимательно ознакомьтесь с основными
          условиями.
        </Description>
      </div>

      {/* Белая плашка-контейнер */}
      <div className='bg-white rounded-[24px] md:rounded-[40px] shadow-sm border border-gray-100 p-6 md:p-10'>
        {/* 🔥 Добавили lg:grid-flow-col и наш динамический класс строк */}
        <div
          className={clsx(
            'grid grid-cols-1 lg:grid-cols-2 lg:grid-flow-col',
            gridRowsClass,
          )}
        >
          {mockConditions.map((text, index) => {
            const isLastItemMobile = index === mockConditions.length - 1;

            // Логика бордеров теперь адаптирована под вертикальное (сверху-вниз) заполнение:
            // Первая колонка — это элементы с индексами от 0 до (ROWS - 1). Вторая — остальные.
            const isLastColumnDesktop = Math.floor(index / ROWS) === 1;

            // Элемент находится в самом низу своей колонки, если его индекс = (ROWS - 1) или это вообще последний элемент массива
            const isLastRowInColumnDesktop =
              index === ROWS - 1 || index === mockConditions.length - 1;

            return (
              <div
                key={index}
                className={clsx(
                  'flex gap-4 p-4 md:p-6 lg:p-8',

                  // Пунктирные бордеры:
                  // На мобилках: бордер снизу у всех, кроме самого последнего элемента
                  !isLastItemMobile &&
                    'border-b border-dashed border-gray-200 lg:border-b-0',

                  // На ПК (lg): бордер снизу у всех, кроме элементов в самом низу колонки
                  !isLastRowInColumnDesktop &&
                    'lg:border-b lg:border-dashed lg:border-gray-200',

                  // На ПК (lg): бордер справа у всех элементов 1-й колонки
                  !isLastColumnDesktop &&
                    'lg:border-r lg:border-dashed lg:border-gray-200',
                )}
              >
                {/* Номер пункта */}
                <span className='text-sm md:text-base font-bold text-gray-400 font-rubik shrink-0'>
                  {index + 1}.
                </span>
                {/* Текст пункта */}
                <p className='text-xs md:text-xl text-[#4B4B4B] font-rubik leading-relaxed font-medium'>
                  {text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
