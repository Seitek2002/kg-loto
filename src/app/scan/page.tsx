'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

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

  const handleUploadClick = () => {
    if (isAndroid) {
      // Если андроид — показываем модалку выбора
      setShowAndroidModal(true);
    } else {
      // Если iOS/PC — сразу открываем стандартный выбор (обычно это галерея на iOS)
      triggerFileInput('image/*');
    }
  };

  const triggerFileInput = (acceptType: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = acceptType;
      fileInputRef.current.click();
    }
    // Закрываем модалку, если она была открыта
    setShowAndroidModal(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Файл выбран:', file);
      // TODO: Здесь логика отправки файла на сервер или чтения QR кода из картинки
      // router.push('/scan/processing?file=...');

      // Сбрасываем инпут, чтобы можно было выбрать тот же файл снова
      event.target.value = '';
    }
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
          className='w-10 h-10 flex items-center justify-center text-white transition-transform active:scale-95
            bg-black/30 backdrop-blur-xl rounded-full border border-white/15 
            shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]'
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

      {/* 6. Модалка для Андроид (условный рендеринг) */}
      <AndroidUploadModal
        isOpen={showAndroidModal}
        onClose={() => setShowAndroidModal(false)}
        onSelectGallery={() => triggerFileInput('image/*')} // Только картинки
        onSelectFiles={() => triggerFileInput('*/*')} // Все файлы
      />
    </div>
  );
}
