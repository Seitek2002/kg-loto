'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ShoppingCart } from 'lucide-react';
import { NumberedBall } from '@/components/ui/NumberedBall'; // 🔥 Импортируем наш компонент

const INITIAL_CART_ITEMS = [
  {
    id: '1',
    name: 'Суперджекпот 5 из 36',
    numbers: [1, 20, 32, 16, 8],
    price: 100,
    image:
      'https://images.unsplash.com/photo-1621360841013-c76831f1dbce?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Суперджекпот 5 из 36',
    numbers: [1, 20, 32, 16, 8],
    price: 100,
    image:
      'https://images.unsplash.com/photo-1621360841013-c76831f1dbce?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Суперджекпот 5 из 36',
    numbers: [1, 20, 32, 16, 8],
    price: 100,
    image:
      'https://images.unsplash.com/photo-1621360841013-c76831f1dbce?q=80&w=200&auto=format&fit=crop',
  },
];

export default function CartPage() {
  const [items, setItems] = useState(INITIAL_CART_ITEMS);

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalPrice = items.reduce((acc, item) => acc + item.price, 0);
  const totalTickets = items.length;

  return (
    <div className='min-h-screen bg-[#F5F5F5] font-rubik pb-32 md:pb-12 select-none'>
      <div className='max-w-[1045px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-10'>
        {/* Хлебные крошки и заголовок */}
        <div className='flex items-center justify-between mb-6 md:mb-8'>
          <div className='flex flex-wrap items-center gap-2 text-[13px] md:text-base text-[#4B4B4B] font-medium'>
            <Link href='/' className='hover:opacity-80 transition-opacity'>
              Главная
            </Link>
            <span className='text-gray-400'>/</span>
            <Link
              href='/lotteries'
              className='hover:opacity-80 transition-opacity'
            >
              Тиражные лотереи
            </Link>
            <span className='text-gray-400'>/</span>
            <span className='font-bold text-[#2D2D2D]'>Корзина</span>
          </div>

          <div className='hidden md:flex items-center gap-2 text-[#4B4B4B] font-bold text-lg'>
            Корзина <ShoppingCart size={24} />
          </div>
        </div>

        {/* Список билетов */}
        {items.length > 0 ? (
          <div className='flex flex-col gap-4 md:gap-5'>
            {items.map((item) => (
              <div
                key={item.id}
                className='bg-white rounded-[24px] p-4 md:p-6 flex flex-row items-center justify-between shadow-sm transition-all duration-300 hover:shadow-md'
              >
                {/* Левая часть */}
                <div className='flex items-center gap-4 md:gap-6 flex-1'>
                  <div className='relative w-[72px] h-[72px] md:w-[96px] md:h-[96px] rounded-[16px] md:rounded-[20px] overflow-hidden shrink-0'>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className='object-cover'
                    />
                  </div>

                  <div className='flex flex-col justify-center gap-1.5 md:gap-2'>
                    <h3 className='text-[14px] md:text-[18px] font-medium text-[#4B4B4B] leading-tight'>
                      {item.name}
                    </h3>

                    {/* 🔥 ИСПОЛЬЗУЕМ NUMBERED BALL */}
                    <div className='flex flex-wrap gap-1 md:gap-2 items-center'>
                      {item.numbers.map((num, i) => (
                        // Используем scale для уменьшения на мобилках без изменения самого компонента
                        <div
                          key={i}
                          className='transform scale-[0.85] origin-left md:scale-100'
                        >
                          <NumberedBall number={num} size={28} />
                        </div>
                      ))}
                    </div>

                    <div className='text-[16px] md:text-[20px] font-black text-[#2D2D2D] mt-1'>
                      {item.price} сом
                    </div>
                  </div>
                </div>

                {/* Правая часть */}
                <button
                  onClick={() => removeItem(item.id)}
                  className='w-[44px] h-[44px] md:w-[56px] md:h-[56px] bg-[#F5F5F5] rounded-full flex items-center justify-center text-[#A3A3A3] hover:bg-[#EBEBEB] hover:text-[#DC2626] active:scale-90 transition-all cursor-pointer shrink-0'
                  aria-label='Удалить билет'
                >
                  <Trash2 className='w-5 h-5 md:w-6 md:h-6' />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className='bg-white rounded-[24px] p-10 text-center shadow-sm'>
            <p className='text-[#4B4B4B] font-bold text-lg'>
              Ваша корзина пуста
            </p>
          </div>
        )}

        {/* Блок Итого и оплаты */}
        {items.length > 0 && (
          <div className='fixed bottom-[80px] left-4 right-4 md:static md:w-full bg-white rounded-[24px] p-5 md:p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:shadow-sm md:mt-8 flex items-center justify-between z-40 transition-transform'>
            <div className='flex flex-col'>
              <span className='text-[12px] md:text-[14px] text-[#8C8C8C] font-medium'>
                Итого:
              </span>
              <div className='text-[16px] md:text-[20px] font-black text-[#4B4B4B]'>
                {totalTickets} билета &nbsp;•&nbsp; {totalPrice}{' '}
                <span className='underline decoration-2 underline-offset-2'>
                  с
                </span>
              </div>
            </div>

            <button className='bg-[#FF7600] text-white px-8 md:px-12 py-3.5 md:py-4 rounded-full text-[14px] md:text-[16px] font-bold shadow-md hover:bg-[#E66A00] active:scale-95 transition-all cursor-pointer tracking-wide'>
              Оплатить
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
