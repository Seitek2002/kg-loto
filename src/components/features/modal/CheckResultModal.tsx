'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
// 🔥 1. Добавили импорт типа Transition
import { motion, AnimatePresence, Transition } from 'framer-motion';
import confetti from 'canvas-confetti';

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

// 🔥 2. Явно указали тип Transition
const springTransition: Transition = {
  type: 'spring',
  damping: 20,
  stiffness: 300,
  mass: 0.8,
};

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
      setTimeout(() => setStep('initial'), 300);
    } else if (isOpen && isWin) {
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          zIndex: 9999,
          colors: ['#FFD600', '#262626', '#ffffff'],
        });
      }, 300);
    }
  }, [isOpen, isWin]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className='max-w-105 overflow-hidden'
    >
      <AnimatePresence mode='wait'>
        {/* 1. СОСТОЯНИЕ ПРОИГРЫША */}
        {!isWin && (
          <motion.div
            key='loss'
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={springTransition}
            className='text-center p-4'
          >
            <h2 className='text-3xl font-black font-benzin uppercase text-[#4B4B4B] mb-4 leading-tight'>
              ПОПРОБУЙТЕ <br /> ЕЩЕ РАЗ!
            </h2>
            <p className='text-sm text-gray-500 font-rubik mb-8 leading-relaxed px-2'>
              Популярные лотереи привлекают внимание благодаря крупным
              джекпотам, частым тиражам и удобным условиям участия.
            </p>
            <button
              onClick={onClose}
              className='w-full py-4 bg-white border-2 border-gray-100 text-[#4B4B4B] rounded-full font-benzin font-bold text-xs uppercase hover:bg-gray-50 active:scale-95 transition-all shadow-sm'
            >
              ОК
            </button>
          </motion.div>
        )}

        {/* 2. СОСТОЯНИЕ ВЫИГРЫША (Начальный экран) */}
        {isWin && step === 'initial' && (
          <motion.div
            key='win-initial'
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={springTransition}
            className='p-4 pt-8'
          >
            <Title>ПОЗДРАВЛЯЕМ! ВЫ ВЫИГРАЛИ!</Title>
            <Description>
              Популярные лотереи привлекают внимание благодаря крупным
              джекпотам, частым тиражам и удобным условиям участия.
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
                className='w-full py-4 bg-white border border-gray-200 text-[#4B4B4B] rounded-full font-benzin font-bold text-[10px] uppercase hover:bg-gray-50 active:scale-95 transition-all shadow-sm'
              >
                Пополнить кошелек
              </button>
              <button
                onClick={() => setStep('qr')}
                className='w-full py-4 bg-white border border-gray-200 text-[#4B4B4B] rounded-full font-benzin font-bold text-[10px] uppercase hover:bg-gray-50 active:scale-95 transition-all shadow-sm'
              >
                Забрать бесплатные билеты
              </button>
            </div>
          </motion.div>
        )}

        {/* 3. СОСТОЯНИЕ ВЫИГРЫША (QR-КОД) */}
        {isWin && step === 'qr' && (
          <motion.div
            key='win-qr'
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={springTransition}
            className='p-4 pt-8'
          >
            <Title>ПОЗДРАВЛЯЕМ! ВЫ ВЫИГРАЛИ!</Title>
            <Description>
              Покажите QR-код промоутеру для получения бесплатных билетов
            </Description>

            <div className='w-full aspect-square bg-white rounded-3xl p-4 shadow-[0_0_40px_rgba(255,214,0,0.3)] border border-gray-100 mb-8 relative flex items-center justify-center animate-pulse'>
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
                className='flex-1 py-4 bg-white border border-gray-200 text-[#4B4B4B] rounded-full font-benzin font-bold text-xs uppercase hover:bg-gray-50 active:scale-95 transition-all shadow-sm'
              >
                НАЗАД
              </button>
              <button
                onClick={onClose}
                className='flex-[1.5] py-4 bg-[#FFD600] text-[#4B4B4B] rounded-full font-benzin font-bold text-xs uppercase shadow-lg hover:bg-[#FFC000] active:scale-95 transition-all'
              >
                ОК
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default CheckResultModal;
