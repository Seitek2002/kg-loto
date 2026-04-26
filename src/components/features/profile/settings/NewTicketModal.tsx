'use client';

import { useMounted } from '@/hooks/useMounted';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown, Paperclip, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { useCreateTicket } from '@/hooks/useSupport';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewTicketModal = ({ isOpen, onClose }: NewTicketModalProps) => {
  const mounted = useMounted();

  const { mutate: createTicket, isPending } = useCreateTicket();

  const handleSubmit = () => {
    if (!isFormValid) return;

    const formData = new FormData();

    // Получаем читаемый текст темы из select
    const selectElement = document.querySelector('select');
    const subjectText =
      selectElement?.options[selectElement.selectedIndex].text || subject;

    // Обязательные поля
    formData.append('subject', subjectText);
    formData.append('description', message);

    // 🔥 Поля из документации с правильным snake_case и ожидаемыми значениями
    formData.append('ticket_type', 'question'); // или 'problem'
    formData.append('channel', 'website_chat'); // Бэкенд ждет именно 'site', а не 'web' или 'website'

    if (file) {
      formData.append('file', file);
    }

    createTicket(formData, {
      onSuccess: () => {
        onClose(); // Закрываем окно при успехе
      },
      onError: (err) => {
        console.error('Ошибка создания тикета', err);
      },
    });
  };

  // Стейты для формы
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      // Очищаем форму при закрытии
      setTimeout(() => {
        setSubject('');
        setMessage('');
        setFile(null);
      }, 300);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  if (!isOpen || !mounted) return null;

  // Кнопка активна, если выбрана тема и введен текст (минимум 10 символов)
  const isFormValid = subject !== '' && message.trim().length >= 10;

  const modalContent = (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center p-4'>
      {/* Overlay */}
      <div
        className='absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity'
        onClick={handleBackdropClick}
      />

      {/* Modal Container */}
      <div className='relative w-full max-w-[500px] bg-white rounded-3xl lg:rounded-4xl p-6 lg:p-8 shadow-2xl z-10'>
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className='absolute top-5 right-5 lg:top-6 lg:right-6 text-gray-400 hover:text-[#4B4B4B] transition-colors'
        >
          <X size={24} strokeWidth={2} />
        </button>

        {/* Заголовок */}
        <h2 className='text-[20px] lg:text-[24px] font-black text-[#4B4B4B] uppercase mb-6 lg:mb-8 text-center lg:text-left'>
          Новое обращение
        </h2>

        {/* Поле: Тема сообщения */}
        <div className='flex flex-col gap-2 mb-4'>
          <label className='text-[13px] lg:text-[14px] font-bold text-[#4B4B4B]'>
            Тема сообщения
          </label>
          <div className='relative'>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={clsx(
                'w-full appearance-none bg-[#F5F5F7] rounded-xl px-4 py-3.5 text-[14px] outline-none border transition-colors cursor-pointer',
                subject === ''
                  ? 'text-gray-400 border-transparent'
                  : 'text-[#4B4B4B] border-transparent focus:border-[#FFD600]',
              )}
            >
              <option value='' disabled>
                Выберите тему
              </option>
              <option value='tech'>Техническая ошибка</option>
              <option value='finance'>Вопросы по оплате/выводу</option>
              <option value='game'>Вопросы по правилам игры</option>
              <option value='other'>Другое</option>
            </select>
            <ChevronDown
              className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none'
              size={20}
            />
          </div>
        </div>

        {/* Поле: Текст сообщения */}
        <div className='flex flex-col gap-2 mb-5'>
          <label className='text-[13px] lg:text-[14px] font-bold text-[#4B4B4B]'>
            Текст сообщения
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            placeholder='Опишите вашу проблему максимально подробно...'
            className='w-full bg-[#F5F5F7] rounded-xl px-4 py-3.5 text-[14px] text-[#4B4B4B] outline-none border border-transparent focus:border-[#FFD600] transition-colors resize-none placeholder:text-gray-400'
          />
        </div>

        {/* Кнопка: Прикрепить файл */}
        <div className='mb-8'>
          <label className='flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-[#E5E5E5] bg-white text-[#4B4B4B] cursor-pointer hover:bg-gray-50 transition-colors'>
            <Paperclip size={18} />
            <span className='text-[13px] lg:text-[14px] font-medium'>
              {file ? file.name : 'Прикрепить файл'}
            </span>
            <input
              type='file'
              className='hidden'
              onChange={handleFileChange}
              accept='image/*,.pdf,.doc,.docx'
            />
          </label>
        </div>

        {/* Кнопка: Создать */}
        <button
          onClick={handleSubmit}
          disabled={!isFormValid || isPending}
          className={clsx(
            'w-full py-4 flex items-center justify-center gap-2 rounded-full font-black text-[13px] uppercase tracking-wider transition-all duration-300',
            isFormValid && !isPending
              ? 'bg-[#FFD600] text-[#4B4B4B] hover:bg-[#F5C200] active:scale-95 shadow-[0_4px_14px_rgba(255,214,0,0.4)]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed',
          )}
        >
          {isPending ? <Loader2 className='w-5 h-5 animate-spin' /> : 'Создать'}
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
