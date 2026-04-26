'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Trash2,
  Plus,
  ShoppingCart,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import { NumberedBall } from '@/components/ui/NumberedBall';
import { useCartStore } from '@/store/cart';
import { useMounted } from '@/hooks/useMounted';

import { usePurchaseTickets } from '@/entities/ticket/api';
import { useState } from 'react';

const getTicketPlural = (count: number) => {
  const lastDigit = count % 10;
  const lastTwo = count % 100;
  if (lastTwo >= 11 && lastTwo <= 19) return 'билетов';
  if (lastDigit === 1) return 'билет';
  if (lastDigit >= 2 && lastDigit <= 4) return 'билета';
  return 'билетов';
};

// Визуальный компонент быстрого добавления билета
const QuickAddTicketMock = ({
  number,
  price,
}: {
  number: number;
  price: number;
}) => {
  const numbers = Array.from({ length: 36 }, (_, i) => i + 1);
  const selectedMock = [1, 16, 26, 30];

  return (
    <div className='bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col relative mb-4'>
      <div className='absolute -left-2 top-[30px] w-4 h-4 bg-[#F5F5F5] rounded-full border-r border-gray-100' />
      <div className='absolute -right-2 top-[30px] w-4 h-4 bg-[#F5F5F5] rounded-full border-l border-gray-100' />

      <div className='flex justify-between items-center border-b border-dashed border-gray-300 pb-4 mb-4'>
        <span className='text-[#737373] font-medium text-sm'>
          Билет №{number}
        </span>
        <span className='font-bold text-[#4B4B4B] text-[16px]'>
          {price} <span className='underline'>с</span>
        </span>
      </div>

      <div className='grid grid-cols-6 gap-2 mb-6'>
        {numbers.map((num) => {
          const isSelected = selectedMock.includes(num);
          return (
            <div
              key={num}
              className={`flex items-center justify-center aspect-square rounded-md text-[13px] font-bold transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[#FF7600] text-white shadow-sm'
                  : 'bg-[#F9F9F9] text-[#4B4B4B] hover:bg-gray-200'
              }`}
            >
              {num}
            </div>
          );
        })}
      </div>

      <button className='w-full py-3.5 rounded-2xl font-bold text-sm bg-[#4B4B4B] text-white hover:bg-black transition-all active:scale-95 shadow-sm'>
        Добавить • {price} с
      </button>
    </div>
  );
};

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const toggleItem = useCartStore((state) => state.toggleItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const mounted = useMounted();
  const router = useRouter();
  const { mutate: purchaseTickets, isPending } = usePurchaseTickets();

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const removeItem = (item: any) => toggleItem(item);

  const totalPrice = items.reduce((acc, item) => acc + item.price, 0);
  const totalTickets = items.length;

  const superTicketsCount = items.filter((t) => t.type === 'super').length;
  const superTicketsSum = items
    .filter((t) => t.type === 'super')
    .reduce((acc, t) => acc + t.price, 0);
  const otherTicketsCount = items.filter((t) => t.type === 'other').length;
  const otherTicketsSum = items
    .filter((t) => t.type === 'other')
    .reduce((acc, t) => acc + t.price, 0);

  // 🔥 ФУНКЦИЯ ОПЛАТЫ
  const handleCheckout = () => {
    setErrorMessage(null);

    const orderId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `order-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const payload = {
      orderId: orderId,
      purchaseDatetime: new Date().toISOString(),
      items: items.map((item) => ({
        lotteryId: item.lotteryId,
        drawId: item.drawId,
        ticketId: item.id,
        price: String(item.price),
        currency: 'KGS',
      })),
    };

    purchaseTickets(payload, {
      onSuccess: () => {
        clearCart();
        setIsSuccessModalOpen(true);
      },
      onError: (error: any) => {
        const status = error?.response?.status;
        if (status === 402) {
          setErrorMessage(
            'Недостаточно средств на балансе. Пожалуйста, пополните кошелек.',
          );
        } else {
          setErrorMessage('Произошла ошибка при покупке. Попробуйте позже.');
        }
      },
    });
  };

  if (!mounted) return null;

  return (
    <div className='min-h-screen bg-[#F5F5F5] font-rubik pb-32 md:pb-16 select-none'>
      {/* МОДАЛКА УСПЕХА */}
      {isSuccessModalOpen && (
        <div className='fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200'>
          <div className='bg-white p-8 md:p-12 rounded-4xl shadow-2xl max-w-md w-full relative flex flex-col items-center animate-in zoom-in-95 duration-300'>
            {/* Кнопка закрытия модалки */}
            <button
              onClick={() => setIsSuccessModalOpen(false)}
              className='absolute top-6 right-6 text-gray-400 hover:text-[#4B4B4B] transition-colors'
            >
              <X size={24} />
            </button>

            <div className='w-20 h-20 bg-[#D1F5D3] rounded-full flex items-center justify-center mb-6 shadow-sm'>
              <CheckCircle2 className='w-10 h-10 text-[#1FAF38]' />
            </div>

            <h2 className='text-[24px] font-black text-[#4B4B4B] mb-3'>
              Покупка успешна!
            </h2>
            <p className='text-[#737373] text-[15px] mb-8 text-center leading-relaxed'>
              Ваши билеты успешно приобретены и добавлены в личный кабинет.
              Желаем удачи в розыгрыше!
            </p>

            <div className='flex flex-col gap-3 w-full'>
              <button
                onClick={() => router.push('/profile')}
                className='w-full bg-[#FF7600] text-white py-4 rounded-xl text-[16px] font-bold shadow-md hover:bg-[#E66A00] active:scale-95 transition-all'
              >
                Перейти в личный кабинет
              </button>
              <button
                onClick={() => setIsSuccessModalOpen(false)}
                className='w-full bg-[#F5F5F5] text-[#4B4B4B] py-4 rounded-xl text-[16px] font-bold hover:bg-[#EBEBEB] active:scale-95 transition-all'
              >
                Остаться в корзине
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-10'>
        {/* Хлебные крошки */}
        <div className='flex items-center justify-between mb-6 md:mb-8'>
          <div className='flex flex-wrap items-center gap-2 text-[12px] md:text-[14px] text-[#737373] font-medium'>
            <Link href='/' className='hover:text-[#4B4B4B] transition-colors'>
              Главная
            </Link>
            <span>/</span>
            <Link
              href='/draw-tickets'
              className='hover:text-[#4B4B4B] transition-colors'
            >
              Тиражные лотереи
            </Link>
            <span>/</span>
            <span className='font-bold text-[#4B4B4B]'>Корзина</span>
          </div>
          <div className='hidden md:flex items-center gap-2 text-[#4B4B4B] font-bold text-[16px]'>
            Корзина <ShoppingCart size={20} />
          </div>
        </div>

        {items.length > 0 ? (
          <div className='flex flex-col lg:flex-row gap-6 items-start'>
            {/* 1. ЛЕВАЯ КОЛОНКА */}
            <div className='hidden lg:flex w-[320px] flex-col shrink-0'>
              <QuickAddTicketMock number={1} price={150} />
              <QuickAddTicketMock number={2} price={150} />
            </div>

            {/* 2. ЦЕНТРАЛЬНАЯ КОЛОНКА */}
            <div className='flex-1 w-full flex flex-col gap-3 md:gap-4'>
              {items.map((item) => (
                <div
                  key={item.id}
                  className='bg-white rounded-[20px] p-4 md:p-5 flex flex-row items-center justify-between shadow-sm'
                >
                  <div className='flex items-center gap-4 flex-1'>
                    <div className='relative w-[80px] h-[80px] md:w-[96px] md:h-[96px] rounded-2xl overflow-hidden shrink-0 bg-green-600'>
                      <Image
                        src='https://images.unsplash.com/photo-1621360841013-c76831f1dbce?q=80&w=200&auto=format&fit=crop'
                        alt={item.name}
                        fill
                        className='object-cover opacity-80'
                      />
                    </div>

                    <div className='flex flex-col justify-center gap-1.5 md:gap-2'>
                      <h3 className='text-[14px] md:text-[16px] font-medium text-[#4B4B4B] leading-tight'>
                        {item.name}
                      </h3>
                      <div className='flex flex-wrap gap-1 items-center'>
                        {item.combination.map((num, i) => (
                          <NumberedBall key={i} number={num} size={28} />
                        ))}
                      </div>
                      <div className='text-[15px] md:text-[18px] font-black text-[#4B4B4B]'>
                        {item.price} сом
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item)}
                    className='w-[44px] h-[44px] md:w-[48px] md:h-[48px] border border-gray-200 rounded-full flex items-center justify-center text-[#A3A3A3] hover:bg-gray-50 hover:text-[#DC2626] transition-colors cursor-pointer shrink-0'
                  >
                    <Trash2 className='w-5 h-5' />
                  </button>
                </div>
              ))}

              <Link href='/draw-tickets' className='block w-full'>
                <button className='w-full py-4 rounded-2xl bg-[#4B4B4B] text-white flex items-center justify-center gap-2 font-bold text-[14px] hover:bg-[#333333] transition-colors active:scale-[0.98]'>
                  <Plus size={18} /> Добавить еще билет
                </button>
              </Link>
            </div>

            {/* 3. ПРАВАЯ КОЛОНКА (Десктоп оплата) */}
            <div className='hidden lg:flex w-[320px] flex-col bg-white rounded-3xl p-6 shadow-sm shrink-0 sticky top-24'>
              <h3 className='text-[18px] font-bold text-[#4B4B4B] mb-5'>
                Детали заказа
              </h3>

              <div className='flex flex-col gap-3 mb-6'>
                {superTicketsCount > 0 && (
                  <div className='flex justify-between items-center text-[14px]'>
                    <span className='text-[#737373]'>Суперджекпот</span>
                    <span className='text-[#4B4B4B] font-medium'>
                      {superTicketsCount} {getTicketPlural(superTicketsCount)} •{' '}
                      {superTicketsSum} с
                    </span>
                  </div>
                )}
                {otherTicketsCount > 0 && (
                  <div className='flex justify-between items-center text-[14px]'>
                    <span className='text-[#737373]'>Другой джекпот</span>
                    <span className='text-[#4B4B4B] font-medium'>
                      {otherTicketsCount} {getTicketPlural(otherTicketsCount)} •{' '}
                      {otherTicketsSum} с
                    </span>
                  </div>
                )}
              </div>

              <div className='border-t border-gray-100 pt-4 mb-6 flex justify-between items-center'>
                <span className='text-[#4B4B4B] font-medium'>Итого</span>
                <span className='text-[20px] font-black text-[#4B4B4B]'>
                  {totalPrice} <span className='underline'>с</span>
                </span>
              </div>

              {/* Вывод ошибки */}
              {errorMessage && (
                <div className='bg-red-50 text-red-500 p-3 rounded-xl flex items-start gap-2 text-sm font-medium mb-4'>
                  <AlertCircle size={16} className='shrink-0 mt-0.5' />
                  <p>{errorMessage}</p>
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={isPending}
                className='w-full bg-[#FF7600] text-white py-4 rounded-xl text-[16px] font-bold shadow-md hover:bg-[#E66A00] disabled:bg-[#ffb073] disabled:cursor-wait active:scale-95 transition-all flex items-center justify-center gap-2'
              >
                {isPending && <Loader2 size={18} className='animate-spin' />}
                {isPending ? 'Оплата...' : 'Купить'}
              </button>
            </div>
          </div>
        ) : (
          <div className='bg-white rounded-3xl p-10 text-center shadow-sm'>
            <p className='text-[#4B4B4B] font-bold text-lg mb-4'>
              Ваша корзина пуста
            </p>
            <Link
              href='/draw-tickets'
              className='text-[#FF7600] font-bold hover:underline'
            >
              Выбрать билеты
            </Link>
          </div>
        )}

        {/* МОБИЛЬНАЯ ПАНЕЛЬ ОПЛАТЫ */}
        {items.length > 0 && (
          <div className='lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-[24px] px-5 pb-8 pt-3 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] z-40'>
            <div className='w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4' />

            {/* Ошибка на мобилке */}
            {errorMessage && (
              <div className='bg-red-50 text-red-500 p-3 rounded-xl flex items-center gap-2 text-xs font-medium mb-4'>
                <AlertCircle size={14} className='shrink-0' />
                <p>{errorMessage}</p>
              </div>
            )}

            <div className='flex items-center justify-between mb-4'>
              <div className='flex flex-col'>
                <span className='text-[13px] text-[#737373] font-medium mb-1'>
                  Итого:
                </span>
                <span className='text-[16px] font-bold text-[#4B4B4B] leading-none'>
                  {totalTickets} {getTicketPlural(totalTickets)}
                </span>
              </div>
              <div className='text-[24px] font-black text-[#4B4B4B]'>
                {totalPrice}{' '}
                <span className='underline decoration-2 underline-offset-2 text-[18px]'>
                  с
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isPending}
              className='w-full bg-[#FF7600] text-white py-4 rounded-2xl text-[16px] font-bold shadow-md hover:bg-[#E66A00] disabled:bg-[#ffb073] disabled:cursor-wait active:scale-95 transition-all flex items-center justify-center gap-2'
            >
              {isPending && <Loader2 size={18} className='animate-spin' />}
              {isPending ? 'Обработка...' : 'Оплатить'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
