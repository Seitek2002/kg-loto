'use client';

import { useEffect, useState } from 'react';
import { generateGlassMap } from '@/lib/glass-generator';

import './style.css';

export function LiquidFilterDef() {
  const [mapUrl, setMapUrl] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      const url = generateGlassMap(450, 80, 25);
      setMapUrl(url);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  if (!mapUrl) return null;

  return (
    <svg
      style={{
        position: 'absolute',
        width: 0,
        height: 0,
        zIndex: -1,
        pointerEvents: 'none',
      }}
    >
      <defs>
        <filter
          id='liquid-glass'
          x='-20%'
          y='-20%'
          width='140%'
          height='140%'
          colorInterpolationFilters='sRGB'
        >
          {/* 1. ЗАГРУЖАЕМ СГЕНЕРИРОВАННУЮ КАРТУ */}
          <feImage
            href={mapUrl}
            x='0'
            y='0'
            width='100%'
            height='100%'
            preserveAspectRatio='none'
            result='displacement-map'
          />

          {/* Немного блюрим карту, чтобы убрать пикселизацию canvas */}
          <feGaussianBlur
            in='displacement-map'
            stdDeviation='1.5'
            result='smooth-map'
          />

          {/* 2. РЕФРАКЦИЯ (ИСКАЖЕНИЕ) */}
          <feDisplacementMap
            in='SourceGraphic'
            in2='smooth-map'
            scale='30'
            xChannelSelector='R'
            yChannelSelector='G'
            result='refracted'
          />

          {/* 3. СПЕКУЛЯРНЫЙ БЛИК (СВЕТ) */}
          {/* Используем альфа-канал нашей карты как карту высот */}
          <feSpecularLighting
            in='smooth-map'
            surfaceScale='5'
            specularConstant='1.2'
            specularExponent='30'
            lightingColor='#ffffff'
            result='specular'
          >
            {/* Источник света сверху-слева */}
            <fePointLight x='100' y='-100' z='200' />
          </feSpecularLighting>

          {/* Смешиваем блик с искаженным изображением */}
          {/* Режим "screen" или "lighten" для блика */}
          <feComposite
            in='specular'
            in2='refracted'
            operator='arithmetic'
            k1='0'
            k2='1'
            k3='1'
            k4='0'
          />
        </filter>
      </defs>
    </svg>
  );
}
