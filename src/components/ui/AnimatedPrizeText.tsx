'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useMemo } from 'react';

interface AnimatedPrizeTextProps {
  text: string;
  isActive?: boolean;
}

export const AnimatedPrizeText = ({
  text,
  isActive = true,
}: AnimatedPrizeTextProps) => {
  const parsed = useMemo(() => {
    const match = text.match(/^(.*?)((?:\d\s*)+)(.*)$/);

    if (match) {
      const rawNumberStr = match[2];
      // Убираем все пробелы, чтобы получить чистое число (1000000)
      const cleanNumber = parseInt(rawNumberStr.replace(/\s/g, ''), 10);

      // 🔥 Проверяем, деньги ли это
      // Ищем "сом" или "с" (с учетом пробелов и границ слова, регистронезависимо)
      const hasCurrency = /(сом|с)(?:\s|$|\.)/i.test(text);
      // Считаем всё, что больше 999, потенциально денежным выигрышем
      const isLargeNumber = cleanNumber >= 1000;

      // Если число валидное и проходит проверку на "денежность"
      if (
        !isNaN(cleanNumber) &&
        cleanNumber > 0 &&
        (hasCurrency || isLargeNumber)
      ) {
        return {
          prefix: match[1],
          number: cleanNumber,
          suffix: match[3],
        };
      }
    }

    // Если регулярка ничего не нашла ИЛИ это модель телефона (число маленькое и без валюты)
    return null;
  }, [text]);

  const count = useMotionValue(0);

  const rounded = useTransform(count, (latest) =>
    Math.round(latest).toLocaleString('ru-RU'),
  );

  useEffect(() => {
    if (parsed?.number && isActive) {
      count.set(0);
      const controls = animate(count, parsed.number, {
        duration: 2,
        ease: 'easeOut',
      });
      return controls.stop;
    }
  }, [parsed?.number, isActive, count]);

  if (!parsed || parsed.number === null) {
    return <span>{text}</span>;
  }

  return (
    <span className='inline-flex items-baseline'>
      {/* Префикс (например "Супер приз ") */}
      {parsed.prefix && <span>{parsed.prefix}</span>}

      {/* 🔥 МАГИЯ ЗДЕСЬ: Обертка, которая держит жесткую ширину */}
      <span className='relative inline-flex items-center justify-center'>
        {/* Невидимый скелет с финальным числом. Он распирает контейнер на нужную ширину */}
        <span className='opacity-0 pointer-events-none select-none tabular-nums'>
          {parsed.number.toLocaleString('ru-RU')}
        </span>

        {/* Анимированные цифры висят поверх и центрируются внутри жесткого контейнера */}
        <motion.span className='absolute inset-0 flex items-center justify-center tabular-nums'>
          {rounded}
        </motion.span>
      </span>

      {/* Суффикс (например " СОМ") */}
      {parsed.suffix && <span className='ml-2'>{parsed.suffix}</span>}
    </span>
  );
};
