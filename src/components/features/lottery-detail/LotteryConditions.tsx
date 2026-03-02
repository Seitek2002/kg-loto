'use client';

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
        {/* 🔥 Сетка: 1 колонка на моб, 3 колонки на ПК (lg) */}
        <div className='grid grid-cols-1 lg:grid-cols-2'>
          {mockConditions.map((text, index) => {
            const COLUMNS = 2;
            const isLastItemMobile = index === mockConditions.length - 1;

            // Вычисляем, находится ли элемент в последнем ряду на ПК
            const isLastRowDesktop =
              Math.ceil((index + 1) / COLUMNS) ===
              Math.ceil(mockConditions.length / COLUMNS);

            // Вычисляем, является ли элемент последним в своей колонке (справа)
            const isLastColumnDesktop = (index + 1) % COLUMNS === 0;

            return (
              <div
                key={index}
                className={clsx(
                  'flex gap-4 p-4 md:p-6 lg:p-8',
                  // Пунктирные бордеры:
                  // На мобилках: бордер снизу у всех, кроме последнего
                  !isLastItemMobile &&
                    'border-b border-dashed border-gray-200 lg:border-b-0',

                  // На ПК (lg): бордер снизу у всех, кроме элементов последнего ряда
                  !isLastRowDesktop &&
                    'lg:border-b lg:border-dashed lg:border-gray-200',

                  // На ПК (lg): бордер справа у всех, кроме последней (3-ей) колонки
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
