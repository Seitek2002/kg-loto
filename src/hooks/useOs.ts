'use client';

import { useEffect, useState } from 'react';

export function useOs() {
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Простая проверка User Agent
    const userAgent =
      navigator.userAgent || navigator.vendor || (window as any).opera;
    if (/android/i.test(userAgent)) {
      setIsAndroid(true);
    }
  }, []);

  return { isAndroid };
}
