import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Search, Check } from 'lucide-react';
import { useLocation } from '../../context/LocationContext';

export const LocationPickerMap = ({ onSelectAddress, initialLat, initialLng }) => {
  const { currentLocation, detectGpsLocation, isLocating } = useLocation();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const [coords, setCoords] = useState({
    lat: initialLat || currentLocation.lat || 21.9540,
    lng: initialLng || currentLocation.lng || 87.2720
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [resolvedAddress, setResolvedAddress] = useState(currentLocation.address || 'Station Road, Dantan, West Bengal');

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true
      }).setView([coords.lat, coords.lng], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      const pinIcon = L.divIcon({
        className: 'picker-pin-icon',
        html: `
          <div style="background-color: #f9532d; color: white; width: 44px; height: 44px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 20px rgba(249,83,45,0.5); border: 3px solid white;">
            <div style="transform: rotate(45deg); font-size: 20px;">📍</div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 44]
      });

      const marker = L.marker([coords.lat, coords.lng], {
        icon: pinIcon,
        draggable: true
      }).addTo(map);

      marker.on('dragend', (e) => {
        const newPos = e.target.getLatLng();
        setCoords({ lat: newPos.lat, lng: newPos.lng });
        simulateReverseGeocode(newPos.lat, newPos.lng);
      });

      map.on('click', (e) => {
        marker.setLatLng(e.latlng);
        setCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
        simulateReverseGeocode(e.latlng.lat, e.latlng.lng);
      });

      markerRef.current = marker;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const simulateReverseGeocode = (lat, lng) => {
    // Generate realistic address description based on coordinates
    const streetName = lat > 21.955 ? 'College Road Sector 3' : 'Main Bazar High Street';
    setResolvedAddress(`${streetName}, Dantan, West Bengal (Pin: 721426)`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Simulated location search
    const newLat = 21.9540 + (Math.random() - 0.5) * 0.02;
    const newLng = 87.2720 + (Math.random() - 0.5) * 0.02;
    setCoords({ lat: newLat, lng: newLng });
    setResolvedAddress(`${searchQuery}, Dantan, West Bengal`);

    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([newLat, newLng], 16);
      markerRef.current.setLatLng([newLat, newLng]);
    }
  };

  const handleConfirmLocation = () => {
    onSelectAddress({
      label: 'Pinned Location',
      address: resolvedAddress,
      city: 'Dantan',
      state: 'West Bengal',
      pincode: '721426',
      lat: coords.lat,
      lng: coords.lng
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search and GPS Bar */}
      <div className="flex gap-2">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search area, landmark or street..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </form>

        <button
          type="button"
          onClick={detectGpsLocation}
          disabled={isLocating}
          className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-semibold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-all shrink-0"
        >
          <Navigation className={`w-4 h-4 text-orange-500 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Locating...' : 'Use GPS'}</span>
        </button>
      </div>

      {/* Map display */}
      <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
        <div ref={mapContainerRef} className="w-full h-full" />
        <div className="absolute top-3 left-3 z-[400] bg-black/70 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-md font-medium">
          Drag pin or click map to reposition
        </div>
      </div>

      {/* Selected location summary */}
      <div className="p-3.5 bg-orange-50/60 rounded-2xl border border-orange-100 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
          <MapPin className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-bold text-orange-950 uppercase tracking-wider">
            Selected Delivery Address
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-800 mt-0.5 line-clamp-2">
            {resolvedAddress}
          </p>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Coordinates: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
          </div>
        </div>
      </div>

      {/* Confirm button */}
      <button
        type="button"
        onClick={handleConfirmLocation}
        className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 text-sm transition-all"
      >
        <Check className="w-4 h-4 stroke-[3]" />
        <span>Confirm Location</span>
      </button>
    </div>
  );
};
