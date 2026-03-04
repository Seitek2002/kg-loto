import { SafeImage } from '@/components/ui/SafeImage';
import { Title } from '@/components/ui/Title';
import { getTranslations } from 'next-intl/server';
import { LotteryRule } from '@/types/api';

export const LotteryHowToPlay = async ({ rules }: { rules: LotteryRule[] }) => {
  if (!rules || rules.length === 0) return null;
  const t = await getTranslations('lottery');

  return (
    <section className='mb-12 md:mb-20'>
      <div className='mb-10'>
        <Title>{t('how_to_play')}</Title>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 bg-white shadow-sm border border-gray-100 p-4 rounded-[24px] md:rounded-[32px]'>
        {rules.map((step) => (
          <div key={step.id} className='flex flex-col gap-4 max-w-[430px]'>
            {step.image && (
              <div className='w-full relative overflow-hidden'>
                <SafeImage
                  src={step.image}
                  alt={`Шаг`}
                  width={430}
                  height={430}
                  className='object-contain p-4 rounded-[10px] max-w-full'
                  fallbackText='Изображение шага'
                />
              </div>
            )}
            <p className='text-xs md:text-xl font-medium text-[#4b4b4b] leading-relaxed px-4 mr-20'>
              {step.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
