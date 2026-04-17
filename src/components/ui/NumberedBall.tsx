import { clsx } from 'clsx';
import { useMemo } from 'react';

interface NumberedBallProps {
  /** Число, которое нужно отобразить */
  number: number;
  /** Диаметр круга в пикселях. По умолчанию 28px (как в карточках) */
  size?: number;
  /** Дополнительные классы для позиционирования */
  className?: string;
}

export const NumberedBall = ({
  number,
  size = 28,
  className,
}: NumberedBallProps) => {
  // Вычисляем размер шрифта как процент от размера круга для сохранения пропорций
  const fontSize = useMemo(() => `${size * 0.5}px`, [size]);

  return (
    <div
      className={clsx(
        // Базовые стили: круг, центрирование, шрифт
        'relative flex items-center justify-center rounded-full font-black text-white shrink-0 select-none overflow-hidden',
        // Точный фоновый цвет из Figma
        'bg-[#00C304]',
        // Точная внутренняя тень из Figma (X: 0, Y: 2, Blur: 4, Spread: 0, Color: #009A03)
        'shadow-[inset_0px_2px_4px_0px_#009A03]',
        className,
      )}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <span className='relative z-10' style={{ fontSize }}>
        {number}
      </span>
    </div>
  );
};
