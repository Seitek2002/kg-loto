'use client';

import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

export function useOs() {
  const isAndroid = useSyncExternalStore(
    emptySubscribe,
    () => {
      const userAgent =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        navigator.userAgent || navigator.vendor || (window as any).opera;
      return /android/i.test(userAgent);
    },
    () => false,
  );

  return { isAndroid };
}
