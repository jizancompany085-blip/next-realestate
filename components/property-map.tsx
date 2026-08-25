'use client';

import { useEffect, useRef } from 'react';
import type { Property } from '@/lib/types';
import { useLocale } from '@/components/locale-provider';
import { formatPrice } from '@/lib/i18n';

interface PropertyMapProps {
  properties: Property[];
  focusedPropertyId?: number | null;
  onMarkerClick?: (id: number) => void;
  center?: [number, number]; // [lng, lat]
  zoom?: number;
  height?: string;
}

export function PropertyMap({
  properties,
  focusedPropertyId,
  onMarkerClick,
  center = [46.6753, 24.7136],
  zoom = 10,
  height = '450px',
}: PropertyMapProps) {
  const { locale } = useLocale();
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<Map<number, any>>(new Map());

  // Helper to build pin HTML string
  const createPinHtml = (priceStr: string, isFocused: boolean) => {
    return `<div style="
      background: ${isFocused ? '#059669' : '#0f172a'};
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;
      box-shadow: ${isFocused ? '0 0 0 3px rgba(16, 185, 129, 0.4), 0 10px 15px -3px rgba(0, 0, 0, 0.4)' : '0 4px 6px -1px rgba(0,0,0,0.3)'};
      border: 2px solid ${isFocused ? '#10b981' : '#ffffff'};
      transform: translate(-50%, -50%) ${isFocused ? 'scale(1.15)' : 'scale(1)'};
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      display: flex;
      items-center: center;
      gap: 4px;
    ">
      ${isFocused ? '<span style="display:inline-block; width:8px; height:8px; background:#34d399; border-radius:50%; margin-right:4px; animation: pulse 1.5s infinite;"></span>' : ''}
      ${priceStr}
    </div>`;
  };

  // 1. Initialize map and markers
  useEffect(() => {
    if (!mapContainer.current) return;

    let leafletMap: any = null;

    const loadLeaflet = async () => {
      if ((window as any).L) return (window as any).L;

      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      return new Promise((resolve) => {
        if ((window as any).L) return resolve((window as any).L);
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => resolve((window as any).L);
        document.body.appendChild(script);
      });
    };

    loadLeaflet().then((L: any) => {
      if (!mapContainer.current) return;
      if (mapInstance.current) {
        mapInstance.current.remove();
        markersRef.current.clear();
      }

      leafletMap = L.map(mapContainer.current, {
        zoomControl: true,
      }).setView([center[1], center[0]], zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(leafletMap);

      markersRef.current.clear();

      properties.forEach((property) => {
        const title = locale === 'ar' ? property.titleAr : property.title;
        const priceStr = formatPrice(property.price, locale, property.purpose);
        const isFocused = property.id === focusedPropertyId;

        const customIcon = L.divIcon({
          className: 'custom-map-pin',
          html: createPinHtml(priceStr, isFocused),
          iconSize: [90, 32],
          iconAnchor: [45, 16],
        });

        const marker = L.marker([property.latitude, property.longitude], {
          icon: customIcon,
          zIndexOffset: isFocused ? 1000 : 0,
        }).addTo(leafletMap);

        const popupContent = `
          <div style="width: 220px; font-family: system-ui, sans-serif; padding: 2px;">
            <img src="${property.image}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 10px; margin-bottom: 8px;" />
            <h4 style="font-weight: 700; margin: 0 0 4px 0; font-size: 13px; color: #0f172a; line-height: 1.3;">${title}</h4>
            <p style="color: #059669; font-weight: 800; margin: 0; font-size: 13px;">${priceStr}</p>
            <a href="/properties/${property.id}" style="display: inline-block; margin-top: 8px; font-size: 11px; color: #2563eb; font-weight: 700; text-decoration: none;">
              ${locale === 'ar' ? 'عرض التفاصيل ←' : 'View Details →'}
            </a>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('click', () => {
          onMarkerClick?.(property.id);
        });

        markersRef.current.set(property.id, marker);
      });

      mapInstance.current = leafletMap;
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        markersRef.current.clear();
      }
    };
  }, [properties, center, zoom, locale]);

  // 2. Dynamically update pin styles & pan to focused property without rebuilding map
  useEffect(() => {
    if (!mapInstance.current || !(window as any).L) return;
    const L = (window as any).L;

    properties.forEach((property) => {
      const marker = markersRef.current.get(property.id);
      if (!marker) return;

      const isFocused = property.id === focusedPropertyId;
      const priceStr = formatPrice(property.price, locale, property.purpose);

      const updatedIcon = L.divIcon({
        className: 'custom-map-pin',
        html: createPinHtml(priceStr, isFocused),
        iconSize: [90, 32],
        iconAnchor: [45, 16],
      });

      marker.setIcon(updatedIcon);
      marker.setZIndexOffset(isFocused ? 1000 : 0);

      if (isFocused) {
        mapInstance.current.panTo([property.latitude, property.longitude], {
          animate: true,
          duration: 0.6,
        });
      }
    });
  }, [focusedPropertyId, properties, locale]);

  return (
    <div
      ref={mapContainer}
      className="w-full rounded-2xl overflow-hidden border border-border shadow-md z-0"
      style={{ height }}
    />
  );
}

