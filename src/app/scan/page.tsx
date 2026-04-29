"use client";

import { useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import jsQR from "jsqr";
import { ArrowLeft } from "lucide-react";

import { AndroidUploadModal } from "@/widgets/scanner/ui/AndroidUploadModal";
import { ScanControls } from "@/widgets/scanner/ui/ScanControls";
import { ScannerOverlay } from "@/widgets/scanner/ui/ScannerOverlay";

import { useCamera } from "@/shared/lib/hooks/useCamera";
import { useOs } from "@/shared/lib/hooks/useOs";

export default function ScanPage() {
  const router = useRouter();
  const { isAndroid } = useOs();
  const { videoRef, toggleFlash, isFlashOn, error } = useCamera();

  const [showAndroidModal, setShowAndroidModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Живой скан через requestAnimationFrame
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    let animationId: number;

    const scan = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA && context) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height,
        );
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code?.data) {
          router.push(`/scan/manual?ticket=${encodeURIComponent(code.data)}`);
          return; // Выходим из цикла при успехе
        }
      }
      animationId = requestAnimationFrame(scan);
    };

    animationId = requestAnimationFrame(scan);
    return () => cancelAnimationFrame(animationId);
  }, [videoRef, router]);

  const handleUploadClick = () => {
    if (isAndroid) setShowAndroidModal(true);
    else triggerFileInput("image/*");
  };

  const triggerFileInput = (acceptType: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = acceptType;
      fileInputRef.current.click();
    }
    setShowAndroidModal(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const code = jsQR(
        ctx.getImageData(0, 0, canvas.width, canvas.height).data,
        canvas.width,
        canvas.height,
      );

      if (code?.data) {
        router.push(`/scan/manual?ticket=${encodeURIComponent(code.data)}`);
      } else {
        alert("QR-код не распознан. Попробуйте другое фото.");
      }
    };
    img.src = URL.createObjectURL(file);
  };

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Video Stream */}
      <div className="absolute inset-0 z-0">
        {error ? (
          <div className="flex items-center justify-center h-full bg-gray-900 text-white p-10 text-center">
            <p className="font-rubik opacity-60">{error}</p>
          </div>
        ) : (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          />
        )}
      </div>

      {/* Кнопка Назад */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => router.back()}
          className="w-12 h-12 flex items-center justify-center text-white bg-black/20 backdrop-blur-xl rounded-full border border-white/10 shadow-lg active:scale-90 transition-all"
        >
          <ArrowLeft size={28} />
        </button>
      </div>

      <ScannerOverlay />

      <ScanControls
        onManualClick={() => router.push("/scan/manual")}
        onUploadClick={handleUploadClick}
        onFlashlightClick={toggleFlash}
        isFlashOn={isFlashOn}
      />

      <AndroidUploadModal
        isOpen={showAndroidModal}
        onClose={() => setShowAndroidModal(false)}
        onSelectGallery={() => triggerFileInput("image/*")}
        onSelectFiles={() => triggerFileInput("*/*")}
      />
    </div>
  );
}
