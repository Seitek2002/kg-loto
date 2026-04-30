"use client";

import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

// Контроллер для плавного перемещения камеры
function MapController({ activeBranch }: { activeBranch?: Branch }) {
  const map = useMap();

  useEffect(() => {
    if (activeBranch) {
      map.flyTo([activeBranch.lat, activeBranch.lng], 15, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [activeBranch, map]);

  return null;
}

export default function LeafletMap({
  branches,
  activeId,
  onMarkerClick,
}: LeafletMapProps) {
  const activeBranch = branches.find((b) => b.id === activeId);

  const centerPosition: [number, number] = activeBranch
    ? [activeBranch.lat, activeBranch.lng]
    : [42.8746, 74.5698];

  return (
    <MapContainer
      center={centerPosition}
      zoom={13}
      scrollWheelZoom={true}
      className="w-full h-full z-0 outline-none"
      zoomControl={false}
    >
      {/* Карта в светлых тонах */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      <MapController activeBranch={activeBranch} />

      {branches.map((branch) => {
        const isActive = branch.id === activeId;

        // 🔥 Динамический маркер как на макете
        const customIcon = L.divIcon({
          className: "bg-transparent",
          // Используем translate для идеального центрирования хвостика прямо над точкой
          html: `
            <div class="relative flex flex-col items-center cursor-pointer transition-all duration-300" style="transform: translate(-50%, -100%);">
              <div class="px-4 py-2.5 rounded-xl lg:rounded-2xl font-bold text-[10px] sm:text-[11px] uppercase tracking-wide whitespace-nowrap shadow-md border-2 ${
                isActive
                  ? "bg-[#4B4B4B] text-white border-white scale-110 z-50 shadow-lg"
                  : "bg-[#4B4B4B]/95 text-white border-transparent hover:scale-105 z-10"
              }">
                ${branch.name}
              </div>
              <div class="w-3 h-3 rotate-45 -mt-2 ${
                isActive ? "bg-[#4B4B4B]" : "bg-[#4B4B4B]/95"
              }"></div>
            </div>
          `,
          iconSize: [0, 0], // Позволяем CSS самому рассчитать размер обертки
          iconAnchor: [0, 0],
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
