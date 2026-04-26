'use client';

import { useMounted } from '@/hooks/useMounted';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NumberedBall } from '@/components/ui/NumberedBall'; // 🔥 Подключили наш крутой компонент

// Временные моковые данные
const MOCK_MODAL_DATA = {
  title: 'Суперджекпот 5 из 36',
  drawNumber: '№005034',
  date: '3 апреля 2026',
  publishTime: '11:34',
  combinations: [1, 20, 32, 16, 8],
  totalTickets: '1232',
  totalWinAmount: '67 658',
  superPrize: '4 567 126',
  results: [
    {
      id: 1,
      category: '1',
      guessed: '5',
      count: '45',
      win: '-',
      totalWin: '-',
    },
    {
      id: 2,
      category: '2',
      guessed: '3',
      count: '123',
      win: '-',
      totalWin: '-',
    },
    { id: 3, category: '3', guessed: '2', count: '0', win: '-', totalWin: '-' },
    {
      id: 4,
      category: '4',
      guessed: '3',
      count: '0',
      win: '56 000 c',
      totalWin: '56 000 c',
    },
    {
      id: 5,
      category: '5',
      guessed: '1',
      count: '5',
      win: '12 000 c',
      totalWin: '12 000 c',
    },
    {
      id: 6,
      category: '6',
      guessed: '5',
      count: '7',
      win: '245 c',
      totalWin: '245 c',
    },
    {
      id: 7,
      category: '7',
      guessed: '3',
      count: '43',
      win: '50 c',
      totalWin: '50 c',
    },
  ],
};

interface DrawDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  drawId: string | null; // 🔥 ИСПРАВЛЕНО: Теперь принимаем строку, так как с API приходит UUID
}

export const DrawDetailsModal = ({
  isOpen,
  onClose,
  drawId,
}: DrawDetailsModalProps) => {
  const mounted = useMounted();

  // Блокируем скролл фона
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const data = MOCK_MODAL_DATA;

  // Содержимое модалки сохраняем в переменную
  const modalContent = (
    // Увеличил z-index до 9999 на всякий случай
    <div className='fixed inset-0 z-[9999] flex items-center justify-center p-4 lg:p-0'>
      {/* Темный фон (Overlay) */}
      <div
        className='absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity'
        onClick={onClose}
      />

      {/* Кнопка закрытия (Крестик) */}
      <button
        onClick={onClose}
        className='absolute top-4 right-4 lg:top-8 lg:right-8 text-white hover:text-gray-300 transition-colors z-[60]'
      >
        <svg
          className='w-8 h-8 lg:w-10 lg:h-10'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M6 18L18 6M6 6l12 12'
          />
        </svg>
      </button>

      {/* Контейнер модального окна */}
      <div className='relative w-full max-w-[800px] max-h-[90vh] overflow-y-auto bg-[#F5F5F7] rounded-3xl lg:rounded-4xl p-4 lg:p-8 shadow-2xl z-10 custom-scrollbar'>
        {/* Заголовок */}
        <h2 className='text-[20px] lg:text-[24px] font-black text-[#4B4B4B] mb-4 lg:mb-6'>
          {data.title}
        </h2>

        {/* Верхний блок: Итоги тиража и Комбинация (Сетка на ПК) */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4'>
          <div className='bg-white rounded-2xl lg:rounded-[20px] p-5 shadow-sm'>
            <h3 className='text-[#4B4B4B] text-[16px] lg:text-[18px] font-bold mb-4'>
              Итоги тиража {data.drawNumber}
            </h3>
            <div className='flex flex-col gap-2 text-[13px] lg:text-[14px]'>
              <div className='flex justify-between lg:justify-start lg:gap-2'>
                <span className='text-[#737373]'>Дата тиража:</span>
                <span className='text-[#4B4B4B] font-bold'>{data.date}</span>
              </div>
              <div className='flex justify-between lg:justify-start lg:gap-2'>
                <span className='text-[#737373]'>
                  Время публикации результатов:
                </span>
                <span className='text-[#4B4B4B] font-bold'>
                  {data.publishTime}
                </span>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-2xl lg:rounded-[20px] p-5 shadow-sm'>
            <h3 className='text-[#4B4B4B] text-[16px] lg:text-[18px] font-bold mb-4'>
              Выигрышная комбинация
            </h3>
            <div className='flex gap-2 flex-wrap'>
              {data.combinations.map((num, i) => (
                // 🔥 ЗАМЕНИЛИ НА NumberedBall
                // На десктопе size 44, на мобилках scale делает их визуально как 40px
                <div
                  key={i}
                  className='transform scale-[0.9] lg:scale-100 origin-left'
                >
                  <NumberedBall number={num} size={44} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Средний блок: Статистика и Кнопка */}
        <div className='bg-white rounded-2xl lg:rounded-[20px] p-5 shadow-sm mb-4 flex flex-col lg:flex-row lg:items-center justify-between gap-5'>
          <div className='flex flex-col gap-2 text-[13px] lg:text-[14px]'>
            <div className='flex justify-between lg:justify-start lg:gap-2'>
              <span className='text-[#737373]'>
                Число билетов, принявших участие в розыгрыше:
              </span>
              <span className='text-[#4B4B4B] font-bold'>
                {data.totalTickets}
              </span>
            </div>
            <div className='flex justify-between lg:justify-start lg:gap-2'>
              <span className='text-[#737373]'>Общая сумма выигрышей:</span>
              <span className='text-[#4B4B4B] font-bold'>
                {data.totalWinAmount} <span className='underline'>с</span>
              </span>
            </div>
            <div className='flex justify-between lg:justify-start lg:gap-2'>
              <span className='text-[#737373]'>Суперприз:</span>
              <span className='text-[#4B4B4B] font-bold'>
                {data.superPrize} <span className='underline'>с</span>
              </span>
            </div>
          </div>
          <button className='bg-[#4B4B4B] hover:bg-[#4B4B4B] text-white py-3 px-6 rounded-full text-[14px] font-bold transition-colors whitespace-nowrap self-start lg:self-center active:scale-95'>
            Купить билет
          </button>
        </div>

        {/* Нижний блок: Таблица Итогов розыгрыша */}
        <div className='bg-white rounded-2xl lg:rounded-[20px] p-5 shadow-sm'>
          <h3 className='text-[#4B4B4B] text-[18px] font-bold mb-4'>
            Итоги розыгрыша
          </h3>

          <div className='overflow-x-auto pb-2'>
            <table className='w-full text-center text-[13px] lg:text-[14px] min-w-[550px]'>
              <thead>
                <tr className='border-b border-gray-100'>
                  <th className='font-bold text-[#4B4B4B] py-3 text-left'>
                    Категория выигрышей
                  </th>
                  <th className='font-bold text-[#4B4B4B] py-3'>
                    Угаданных чисел
                  </th>
                  <th className='font-bold text-[#4B4B4B] py-3'>Комбинаций</th>
                  <th className='font-bold text-[#4B4B4B] py-3'>Выигрыш</th>
                  <th className='font-bold text-[#4B4B4B] py-3 text-right'>
                    Сумма выигрышей
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.results.map((row) => (
                  <tr
                    key={row.id}
                    className='border-b border-gray-50 last:border-0 hover:bg-gray-50/50'
                  >
                    <td className='py-3 text-[#4B4B4B] text-left'>
                      {row.category}
                    </td>
                    <td className='py-3 text-[#4B4B4B]'>{row.guessed}</td>
                    <td className='py-3 text-[#4B4B4B]'>{row.count}</td>
                    <td className='py-3 text-[#4B4B4B]'>{row.win}</td>
                    <td className='py-3 text-[#4B4B4B] text-right'>
                      {row.totalWin}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
      `,
        }}
      />
    </div>
  );

  // Возвращаем портал, который рендерит модалку прямо в body
  return createPortal(modalContent, document.body);
};
