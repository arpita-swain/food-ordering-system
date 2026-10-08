import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export const LiveTrackingMap = ({
  restaurantLocation = { lat: 21.9542, lng: 87.2721, name: 'Spice Garden Royal' },
  customerLocation = { lat: 21.9640, lng: 87.2790, name: 'Delivery Destination' },
  riderLocation = { lat: 21.9585, lng: 87.2755, name: 'Rajesh (Rider)' },
  status = 'Out for Delivery'
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const riderMarkerRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Check if map is already initialized
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: false
      }).setView([riderLocation.lat, riderLocation.lng], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // Custom SVG Icons
      const restaurantIcon = L.divIcon({
        className: 'custom-rest-icon',
        html: `
          <div style="background-color: #f9532d; color: white; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(249,83,45,0.4); border: 2.5px solid white;">
            <span style="font-size: 18px;">🏪</span>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19]
      });

      const customerIcon = L.divIcon({
        className: 'custom-customer-icon',
        html: `
          <div style="background-color: #10b981; color: white; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(16,185,129,0.4); border: 2.5px solid white;">
            <span style="font-size: 18px;">🏠</span>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19]
      });

      const riderIcon = L.divIcon({
        className: 'custom-rider-icon',
        html: `
          <div style="background-color: #0f172a; color: white; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 18px rgba(15,23,42,0.5); border: 3px solid #ffcc00; animation: bounce 1.5s infinite alternate;">
            <span style="font-size: 22px;">🛵</span>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      // Add Restaurant Marker
      L.marker([restaurantLocation.lat, restaurantLocation.lng], { icon: restaurantIcon })
        .addTo(map)
        .bindPopup(`<b>${restaurantLocation.name}</b><br>Pickup Point`);

      // Add Customer Marker
      L.marker([customerLocation.lat, customerLocation.lng], { icon: customerIcon })
        .addTo(map)
        .bindPopup(`<b>${customerLocation.name}</b><br>Your Delivery Location`);

      // Add Rider Marker
      const riderMarker = L.marker([riderLocation.lat, riderLocation.lng], { icon: riderIcon })
        .addTo(map)
        .bindPopup(`<b>${riderLocation.name}</b><br>Moving: ${status}`);
      riderMarkerRef.current = riderMarker;

      // Draw Route Polyline
      const routePoints = [
        [restaurantLocation.lat, restaurantLocation.lng],
        [riderLocation.lat, riderLocation.lng],
        [customerLocation.lat, customerLocation.lng]
      ];

      L.polyline(routePoints, {
        color: '#f9532d',
        weight: 4,
        opacity: 0.8,
        dashArray: '8, 8',
        lineCap: 'round'
      }).addTo(map);

      // Fit bounds nicely
      const bounds = L.latLngBounds(routePoints);
      map.fitBounds(bounds, { padding: [40, 40] });

      mapInstanceRef.current = map;
    } else {
      // Update rider position smoothly
      if (riderMarkerRef.current) {
        riderMarkerRef.current.setLatLng([riderLocation.lat, riderLocation.lng]);
      }
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [riderLocation.lat, riderLocation.lng, status]);

  return (
    <div className="relative w-full h-72 sm:h-96 rounded-3xl overflow-hidden shadow-lg border border-slate-200">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Live tracking overlay pill */}
      <div className="absolute top-4 left-4 z-[400] bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border border-slate-200 flex items-center gap-2 text-xs font-bold text-slate-800">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
        <span>Live GPS Connected</span>
      </div>

      <div className="absolute bottom-4 right-4 z-[400] bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-lg">
        Leaflet & OpenStreetMap Live Tiles
      </div>
    </div>
  );
};
