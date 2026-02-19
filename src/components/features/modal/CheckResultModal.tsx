'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Description } from '@/components/ui/Description';
import { Modal } from '@/components/ui/Modal';
import { Title } from '@/components/ui/Title';
import { LotteryCard } from '../lottery/LotteryCard';

interface CheckResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  isWin: boolean;
  ticketNumber: string;
}

const CheckResultModal = ({
  isOpen,
  onClose,
  isWin,
  ticketNumber,
}: CheckResultModalProps) => {
  const router = useRouter();

  const [step, setStep] = useState<'initial' | 'qr'>('initial');

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setStep('initial'), 300); // Задержка для плавной анимации закрытия
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className='max-w-105'>
      {/* ========================================= */}
      {/* 1. СОСТОЯНИЕ ПРОИГРЫША */}
      {/* ========================================= */}
      {!isWin && (
        <div className='text-center p-4 animate-in fade-in zoom-in duration-300'>
          <h2 className='text-3xl font-black font-benzin uppercase text-[#2D2D2D] mb-4 leading-tight'>
            ПОПРОБУЙТЕ ЕЩЕ РАЗ!
          </h2>
          <p className='text-sm text-gray-500 font-rubik mb-8 leading-relaxed px-2'>
            Популярные лотереи привлекают внимание благодаря крупным джекпотам,
            частым тиражам и удобным условиям участия.
          </p>
          <button
            onClick={onClose}
            className='w-full py-4 bg-white border-2 border-gray-100 text-[#2D2D2D] rounded-full font-benzin font-bold text-xs uppercase hover:bg-gray-50 transition-colors shadow-sm'
          >
            ОК
          </button>
        </div>
      )}

      {/* ========================================= */}
      {/* 2. СОСТОЯНИЕ ВЫИГРЫША (Начальный экран) */}
      {/* ========================================= */}
      {isWin && step === 'initial' && (
        <div className='animate-in fade-in slide-in-from-bottom-4 duration-300 p-4 pt-14'>
          <Title>ПОЗДРАВЛЯЕМ! ВЫ ВЫИГРАЛИ!</Title>
          <Description>
            Популярные лотереи привлекают внимание благодаря крупным джекпотам,
            частым тиражам и удобным условиям участия.
          </Description>

          <LotteryCard
            title='НАЗВАНИЕ ЛОТЕРЕИ'
            description={`Билет: ${ticketNumber}`}
            prize='1 000 000 KGS'
            price={0}
            time='20:00'
            theme='white'
            variant='prize'
            ticketStatus='winning'
            backgroundId='8'
            prizeFontId='benzin'
          />

          <div className='flex flex-col gap-3 mt-6'>
            <button
              onClick={() => router.push('/scan/withdraw')}
              className='w-full py-4 bg-white border border-gray-200 text-[#2D2D2D] rounded-full font-benzin font-bold text-[10px] uppercase hover:bg-gray-50 transition-colors shadow-sm'
            >
              Пополнить кошелек
            </button>
            <button
              onClick={() => setStep('qr')}
              className='w-full py-4 bg-white border border-gray-200 text-[#2D2D2D] rounded-full font-benzin font-bold text-[10px] uppercase hover:bg-gray-50 transition-colors shadow-sm'
            >
              Забрать бесплатные билеты
            </button>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* 3. СОСТОЯНИЕ ВЫИГРЫША (QR-КОД) */}
      {/* ========================================= */}
      {isWin && step === 'qr' && (
        <div className='animate-in fade-in slide-in-from-right-8 duration-300 p-4 pt-14'>
          <Title>ПОЗДРАВЛЯЕМ! ВЫ ВЫИГРАЛИ!</Title>
          <Description>
            Покажите QR-код промоутеру для получения бесплатных билетов
          </Description>

          <div className='w-full aspect-square bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-8 relative flex items-center justify-center'>
            {/* Используем qr.svg из public папки, который мы добавляли ранее для футера */}
            <Image
              src='/qr.svg'
              alt='QR Code'
              fill
              className='object-contain p-4'
            />
          </div>

          <div className='flex gap-3'>
            <button
              onClick={() => setStep('initial')}
              className='flex-1 py-4 bg-white border border-gray-200 text-[#2D2D2D] rounded-full font-benzin font-bold text-xs uppercase hover:bg-gray-50 transition-colors shadow-sm'
            >
              НАЗАД
            </button>
            <button
              onClick={onClose}
              className='flex-[1.5] py-4 bg-[#FFD600] text-[#2D2D2D] rounded-full font-benzin font-bold text-xs uppercase shadow-lg hover:bg-[#FFC000] active:scale-95 transition-all'
            >
              ОК
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default CheckResultModal;
