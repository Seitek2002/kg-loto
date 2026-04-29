"use client";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

export function useOs() {
  const isAndroid = useSyncExternalStore(
    emptySubscribe,
    () => {
      if (typeof navigator === "undefined") return false;
      // Используем unknown для безопасного приведения типов
      const userAgent =
        navigator.userAgent ||
        navigator.vendor ||
        (window as unknown as { opera?: string }).opera ||
        "";
      return /android/i.test(userAgent);
    },
    () => false,
  );
  return { isAndroid };
}
