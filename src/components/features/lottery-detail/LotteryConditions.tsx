import { Description } from '@/components/ui/Description';
import { Title } from '@/components/ui/Title';
import { clsx } from 'clsx';
import { getTranslations } from 'next-intl/server';
import { LotteryTerm } from '@/types/api';

export const LotteryConditions = async ({
  terms,
}: {
  terms: LotteryTerm[];
}) => {
  if (!terms || terms.length === 0) return null;
  const t = await getTranslations('lottery');

  const ROWS = Math.ceil(terms.length / 2);
  const gridRowsClasses: Record<number, string> = {
    1: 'lg:grid-rows-1',
    2: 'lg:grid-rows-2',
    3: 'lg:grid-rows-3',
    4: 'lg:grid-rows-4',
    5: 'lg:grid-rows-5',
    6: 'lg:grid-rows-6',
    7: 'lg:grid-rows-7',
    8: 'lg:grid-rows-8',
    9: 'lg:grid-rows-9',
    10: 'lg:grid-rows-10',
  };
  const gridRowsClass = gridRowsClasses[ROWS] || 'lg:grid-rows-4';

  return (
    <section className='mb-12 md:mb-20'>
      <div className='mb-6 md:mb-8'>
        <Title>{t('conditions')}</Title>
        <Description>{t('conditions_desc')}</Description>
      </div>

      <div className='bg-white rounded-[24px] md:rounded-[40px] shadow-sm border border-gray-100 p-6 md:p-10'>
        <div
          className={clsx(
            'grid grid-cols-1 lg:grid-cols-2 lg:grid-flow-col',
            gridRowsClass,
          )}
        >
          {terms.map((term, index) => {
            const isLastItemMobile = index === terms.length - 1;
            const isLastColumnDesktop = Math.floor(index / ROWS) === 1;
            const isLastRowInColumnDesktop =
              index === ROWS - 1 || index === terms.length - 1;

            return (
              <div
                key={term.id}
                className={clsx(
                  'flex gap-4 p-4 md:p-6 lg:p-8',
                  !isLastItemMobile &&
                    'border-b border-dashed border-gray-200 lg:border-b-0',
                  !isLastRowInColumnDesktop &&
                    'lg:border-b lg:border-dashed lg:border-gray-200',
                  !isLastColumnDesktop &&
                    'lg:border-r lg:border-dashed lg:border-gray-200',
                )}
              >
                <span className='text-sm md:text-base font-bold text-gray-400 font-rubik shrink-0'>
                  {index + 1}.
                </span>
                {/* 🔥 Достаем текст из объекта */}
                <p className='text-xs md:text-xl text-[#4B4B4B] font-rubik leading-relaxed font-medium'>
                  {term.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
