'use client';

import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// --- ТИПЫ ---
interface Branch {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

interface LeafletMapProps {
  branches: Branch[];
  activeId: string | null;
  onMarkerClick: (id: string) => void;
}

// --- КОНТРОЛЛЕР КАРТЫ (Чтобы двигать камеру при выборе из списка) ---
function MapController({ activeBranch }: { activeBranch?: Branch }) {
  const map = useMap();

  useEffect(() => {
    if (activeBranch) {
      // Плавный перелет к выбранной точке
      map.flyTo([activeBranch.lat, activeBranch.lng], 15, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [activeBranch, map]);

  return null;
}

// --- ОСНОВНОЙ КОМПОНЕНТ ---
export default function LeafletMap({
  branches,
  activeId,
  onMarkerClick,
}: LeafletMapProps) {
  const activeBranch = branches.find((b) => b.id === activeId);
  
  const centerPosition: [number, number] = activeBranch
    ? [activeBranch.lat, activeBranch.lng]
    : [42.8746, 74.5698]; // Центр Бишкека по дефолту

  return (
    <MapContainer
      center={centerPosition}
      zoom={13}
      scrollWheelZoom={true}
      className='w-full h-full z-0 outline-none'
      zoomControl={false} // Скрываем дефолтные кнопки зума (у нас свой дизайн)
    >
      {/* СТИЛЬ КАРТЫ (Серый, похожий на макет) */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url='https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
      />

      {/* ЛОГИКА ПЕРЕМЕЩЕНИЯ */}
      <MapController activeBranch={activeBranch} />

      {/* МАРКЕРЫ */}
      {branches.map((branch) => {
        const isActive = branch.id === activeId;

        // Создаем кастомную HTML иконку (как на твоем дизайне)
        const customIcon = L.divIcon({
          className: 'bg-transparent', // Убираем дефолтные стили leaflet
          html: `
            <div class="relative transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer transition-all duration-300 ${isActive ? 'z-50 scale-110' : 'z-10 hover:scale-105'}">
              <div class="px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-wide whitespace-nowrap shadow-lg border-2 ${
                isActive
                  ? 'bg-[#FFD600] text-black border-white'
                  : 'bg-[#1F1F1F] text-white border-transparent'
              }">
                ${isActive ? branch.name : '«Кыргыз Лото»'}
              </div>
              <div class="w-3 h-3 rotate-45 -mt-1.5 ${
                isActive ? 'bg-[#FFD600]' : 'bg-[#1F1F1F]'
              }"></div>
            </div>
          `,
          iconSize: [120, 40], // Примерный размер области клика
          iconAnchor: [60, 20], // Центрирование
        });

        return (
          <Marker
            key={branch.id}
            position={[branch.lat, branch.lng]}
            icon={customIcon}
            eventHandlers={{
              click: () => onMarkerClick(branch.id),
            }}
          />
        );
      })}
    </MapContainer>
  );
}
