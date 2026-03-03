import { Description } from '@/components/ui/Description';
import { Title } from '@/components/ui/Title';
import { clsx } from 'clsx';
// 🔥 Импортируем серверную функцию переводов
import { getTranslations } from 'next-intl/server';

export const LotteryConditions = async ({ rules }: { rules: string[] }) => {
  // 🔥 Если правил нет с бэкенда — просто скрываем весь блок
  if (!rules || rules.length === 0) return null;

  const t = await getTranslations('lottery');

  // Вычисляем количество строк на основе пришедших данных
  const ROWS = Math.ceil(rules.length / 2);

  // Маппер для Tailwind (расширил до 10 на всякий случай)
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

      {/* Белая плашка-контейнер */}
      <div className='bg-white rounded-[24px] md:rounded-[40px] shadow-sm border border-gray-100 p-6 md:p-10'>
        <div
          className={clsx(
            'grid grid-cols-1 lg:grid-cols-2 lg:grid-flow-col',
            gridRowsClass,
          )}
        >
          {rules.map((text, index) => {
            const isLastItemMobile = index === rules.length - 1;

            // Логика бордеров адаптирована под вертикальное (сверху-вниз) заполнение:
            // Первая колонка — это элементы с индексами от 0 до (ROWS - 1). Вторая — остальные.
            const isLastColumnDesktop = Math.floor(index / ROWS) === 1;

            // Элемент находится в самом низу своей колонки, если его индекс = (ROWS - 1) или это вообще последний элемент массива
            const isLastRowInColumnDesktop =
              index === ROWS - 1 || index === rules.length - 1;

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
