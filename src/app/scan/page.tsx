'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import jsQR from 'jsqr'; // 🔥 Импортируем сканер

import { ScanControls } from './sections/ScanControls';
import { ScannerOverlay } from './sections/ScannerOverlay';
import { AndroidUploadModal } from './sections/AndroidUploadModal';
import { useOs } from '@/hooks/useOs';
import { useCamera } from '@/hooks/useCamera';

export default function ScanPage() {
  const router = useRouter();
  const { isAndroid } = useOs();
  const { videoRef, toggleFlash, isFlashOn, error } = useCamera();

  const [showAndroidModal, setShowAndroidModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🔥 1. ЛОГИКА ЖИВОГО СКАНИРОВАНИЯ С КАМЕРЫ
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { willReadFrequently: true });
    let animationFrameId: number;

    const tick = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA && context) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;

        // Рисуем текущий кадр из видео на скрытый canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Получаем пиксели
        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height,
        );

        // Ищем QR-код
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        // Если нашли — останавливаем сканирование и переходим на проверку
        if (code && code.data) {
          console.log('QR Найден с камеры:', code.data);
          router.push(`/scan/manual?ticket=${encodeURIComponent(code.data)}`);
          return;
        }
      }

      // Продолжаем цикл
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [videoRef, router]);

  const handleUploadClick = () => {
    if (isAndroid) {
      setShowAndroidModal(true);
    } else {
      triggerFileInput('image/*');
    }
  };

  const triggerFileInput = (acceptType: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = acceptType;
      fileInputRef.current.click();
    }
    setShowAndroidModal(false);
  };

  // 🔥 2. ЛОГИКА СКАНИРОВАНИЯ ЗАГРУЖЕННОГО ФАЙЛА
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code && code.data) {
        console.log('QR Найден на фото:', code.data);
        router.push(`/scan/manual?ticket=${encodeURIComponent(code.data)}`);
      } else {
        alert('QR код не найден на изображении. Попробуйте другое фото.');
      }
      URL.revokeObjectURL(imageUrl); // Очищаем память
    };

    img.src = imageUrl;
    event.target.value = ''; // Сбрасываем инпут
  };

  return (
    <div className='relative h-screen w-full bg-black overflow-hidden'>
      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileChange}
        className='hidden'
      />

      <div className='absolute inset-0 z-0'>
        {error ? (
          <div className='flex items-center justify-center h-full bg-gray-900 text-white p-6 text-center'>
            <p>Пожалуйста, разрешите доступ к камере для сканирования.</p>
          </div>
        ) : (
          <video
            ref={videoRef}
            className='w-full h-full object-cover'
            autoPlay
            playsInline
            muted
          />
        )}
      </div>

      <div className='absolute top-4 left-4 z-20'>
        <button
          onClick={() => router.back()}
          className='w-10 h-10 flex items-center justify-center text-white transition-transform active:scale-95 bg-black/30 backdrop-blur-xl rounded-full border border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]'
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <ScannerOverlay />

      <ScanControls
        onManualClick={() => router.push('/scan/manual')}
        onUploadClick={handleUploadClick}
        onFlashlightClick={toggleFlash}
        isFlashOn={isFlashOn}
      />

      <AndroidUploadModal
        isOpen={showAndroidModal}
        onClose={() => setShowAndroidModal(false)}
        onSelectGallery={() => triggerFileInput('image/*')}
        onSelectFiles={() => triggerFileInput('*/*')}
      />
    </div>
  );
}
