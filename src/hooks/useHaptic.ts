'use client';

export const useHaptic = () => {
  const vibrate = () => {
    if (typeof window !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  return { vibrate };
};
