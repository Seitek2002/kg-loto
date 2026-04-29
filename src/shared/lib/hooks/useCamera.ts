"use client";
import { useEffect, useRef, useState } from "react";

interface ExtendedCapabilities extends MediaTrackCapabilities {
  torch?: boolean;
}

interface ExtendedConstraints extends MediaTrackConstraintSet {
  torch?: boolean;
}

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
        const constraints = { video: { facingMode: "environment" } };
        const mediaStream =
          await navigator.mediaDevices.getUserMedia(constraints);
        currentStream = mediaStream;
        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.setAttribute("playsinline", "true");
          videoRef.current.play();
        }

        const track = mediaStream.getVideoTracks()[0];
        const capabilities = track.getCapabilities() as ExtendedCapabilities;
        if (capabilities.torch) setHasFlash(true);
      } catch (err) {
        setError("Нет доступа к камере");
      }
    };

    startCamera();
    return () => {
      if (currentStream) currentStream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const toggleFlash = async () => {
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    const newMode = !isFlashOn;
    try {
      await track.applyConstraints({
        advanced: [{ torch: newMode } as ExtendedConstraints],
      });
      setIsFlashOn(newMode);
    } catch (err) {
      console.error("Ошибка фонарика:", err);
    }
  };

  return { videoRef, toggleFlash, isFlashOn, hasFlash, error };
}
