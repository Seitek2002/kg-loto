"use client";

import { useState } from "react";

import Image, { ImageProps } from "next/image";

import { Ticket } from "lucide-react";

interface SafeImageProps extends Omit<ImageProps, "src"> {
  src: string | null | undefined;
  fallbackText?: string;
}

export const SafeImage = ({
  src,
  fallbackText,
  alt,
  ...props
}: SafeImageProps) => {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gray-100 text-gray-400 rounded-2xl ${props.className || "w-full h-full"}`}
      >
        <Ticket size={48} strokeWidth={1} className="mb-2 opacity-50" />
        {fallbackText && (
          <span className="text-xs font-medium">{fallbackText}</span>
        )}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt || "Image"}
      onError={() => setError(true)}
      {...props}
    />
  );
};
