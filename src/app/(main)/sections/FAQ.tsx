'use client';

import { Description } from '@/components/ui/Description';
import { FAQItem } from '@/components/ui/FAQItem';
import { Title } from '@/components/ui/Title';
import { QAItem } from '@/types/api'; // Импорт типа

interface FAQProps {
  questions: QAItem[];
}

export const FAQ = ({ questions }: FAQProps) => {

  if (!questions || questions.length === 0) return null;

  return (
    <section className='my-12' id='faq'>
      {/* Заголовки */}
      <div className='mb-8'>
        <Title>
          ОТВЕТЫ НА ЧАСТЫЕ <br /> ВОПРОСЫ
        </Title>
        <Description>
          Если не нашли ответа на свой вопрос, просто спросите у нас в привычном
          мессенджере.
        </Description>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 items-start'>
        {questions.map((item) => (
          <FAQItem
            key={item.id}
            question={item.question}
            answer={item.answer}
          />
        ))}
      </div>
    </section>
  );
};