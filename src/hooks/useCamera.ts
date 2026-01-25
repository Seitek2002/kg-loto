'use client';

import { useEffect, useRef, useState } from 'react';

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [hasFlash, setHasFlash] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        // Запрашиваем заднюю камеру (environment)
        const constraints = {
          video: { facingMode: 'environment' },
        };

        const mediaStream =
          await navigator.mediaDevices.getUserMedia(constraints);
        currentStream = mediaStream;
        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          // Важно для iOS, чтобы видео играло не на весь экран
          videoRef.current.setAttribute('playsinline', 'true');
          videoRef.current.play();
        }

        // Проверяем, есть ли фонарик на устройстве
        const track = mediaStream.getVideoTracks()[0];
        const capabilities = track.getCapabilities() as any; // any нужен, т.к. TS не всегда знает про torch

        if (capabilities.torch) {
          setHasFlash(true);
        }
      } catch (err) {
        console.error('Ошибка доступа к камере:', err);
        setError('Нет доступа к камере');
      }
    };

    startCamera();

    return () => {
      // Чистим ресурсы при уходе со страницы
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const toggleFlash = async () => {
    if (!stream) return;

    const track = stream.getVideoTracks()[0];
    const newMode = !isFlashOn;

    try {
      // Магия включения фонарика
      await track.applyConstraints({
        advanced: [{ torch: newMode } as any],
      });
      setIsFlashOn(newMode);
    } catch (err) {
      console.error('Не удалось переключить фонарик:', err);
    }
  };

  return { videoRef, toggleFlash, isFlashOn, hasFlash, error };
}
