import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

interface GoogleMapProps {
  latitude: number;
  longitude: number;
  projectName: string;
  locationDescription?: string;
  zoom?: number;
  height?: string;
}

declare global {
  interface Window {
    google: any;
  }
}

export default function GoogleMap({
  latitude,
  longitude,
  projectName,
  locationDescription,
  zoom = 15,
  height = '450px',
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Google Maps API is loaded
    const checkGoogleMaps = setInterval(() => {
      if (window.google && window.google.maps) {
        setIsLoaded(true);
        clearInterval(checkGoogleMaps);
      }
    }, 100);

    // Timeout after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(checkGoogleMaps);
      if (!window.google || !window.google.maps) {
        setError('Failed to load Google Maps');
      }
    }, 10000);

    return () => {
      clearInterval(checkGoogleMaps);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !latitude || !longitude) return;

    try {
      const position = { lat: latitude, lng: longitude };

      // Premium map styling - clean, minimal, no clutter
      const mapStyles = [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
        {
          featureType: 'transit',
          elementType: 'labels.icon',
          stylers: [{ visibility: 'off' }],
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{ color: '#f5f5f5' }],
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#c9e6f2' }],
        },
        {
          featureType: 'landscape',
          elementType: 'geometry',
          stylers: [{ color: '#f8fafc' }],
        },
      ];

      // Initialize map
      const map = new window.google.maps.Map(mapRef.current, {
        center: position,
        zoom: zoom,
        styles: mapStyles,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        gestureHandling: 'cooperative',
      });

      // Custom marker icon - luxury blue accent
      const markerIcon = {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: '#1E3A8A',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3,
      };

      // Add marker for the project
      const marker = new window.google.maps.Marker({
        position: position,
        map: map,
        title: projectName,
        icon: markerIcon,
        animation: window.google.maps.Animation.DROP,
      });

      // Add subtle circle highlight around project
      const circle = new window.google.maps.Circle({
        strokeColor: '#1E3A8A',
        strokeOpacity: 0.3,
        strokeWeight: 2,
        fillColor: '#1E3A8A',
        fillOpacity: 0.1,
        map: map,
        center: position,
        radius: 300, // 300 meters radius
      });

      // Info window with premium styling
      const infoContent = `
        <div style="padding: 12px; font-family: 'Inter', sans-serif; max-width: 250px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 500; color: #0F172A;">
            ${projectName}
          </h3>
          ${
            locationDescription
              ? `<p style="margin: 0; font-size: 14px; color: #475569; line-height: 1.5;">
              ${locationDescription}
            </p>`
              : ''
          }
        </div>
      `;

      const infoWindow = new window.google.maps.InfoWindow({
        content: infoContent,
      });

      // Show info window on marker click
      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      // Auto-open info window on load
      setTimeout(() => {
        infoWindow.open(map, marker);
      }, 500);
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map');
    }
  }, [isLoaded, latitude, longitude, projectName, locationDescription, zoom]);

  if (error) {
    return (
      <div
        className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden shadow-sm border border-slate-200 flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center p-8">
          <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-normal">{error}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden shadow-sm border border-slate-200 flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center p-8">
          <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-3 animate-pulse" />
          <p className="text-slate-500 text-sm font-normal">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className="w-full rounded-lg overflow-hidden shadow-sm border border-slate-200"
      style={{ height }}
    />
  );
}
