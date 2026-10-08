import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(() => {
    const saved = localStorage.getItem('foodiego_location');
    return saved
      ? JSON.parse(saved)
      : {
          label: 'Home',
          type: 'Home',
          address: 'Station Road, Dantan, West Bengal',
          city: 'Dantan',
          pincode: '721426',
          lat: 21.9540,
          lng: 87.2720
        };
  });

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    localStorage.setItem('foodiego_location', JSON.stringify(currentLocation));
  }, [currentLocation]);

  const setLocation = (loc) => {
    setCurrentLocation(loc);
    setIsLocationModalOpen(false);
    addToast(`Delivery location set to: ${loc.label || loc.address}`);
  };

  const detectGpsLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const detectedLoc = {
            label: 'Current GPS Location',
            type: 'Current',
            address: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)} (Dantan Metro Area)`,
            city: 'Dantan',
            pincode: '721426',
            lat,
            lng
          };
          setCurrentLocation(detectedLoc);
          setIsLocating(false);
          setIsLocationModalOpen(false);
          addToast('Live GPS location detected successfully!');
        },
        () => {
          // Fallback location
          const fallbackLoc = {
            label: 'Current Location',
            type: 'Current',
            address: 'Dantan Main Market, West Bengal',
            city: 'Dantan',
            pincode: '721426',
            lat: 21.9540,
            lng: 87.2720
          };
          setCurrentLocation(fallbackLoc);
          setIsLocating(false);
          setIsLocationModalOpen(false);
          addToast('Using nearby central hub (Dantan Central)', 'info');
        },
        { timeout: 7000 }
      );
    } else {
      setIsLocating(false);
      addToast('Geolocation not supported by browser', 'error');
    }
  };

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        setLocation,
        isLocationModalOpen,
        openLocationModal: () => setIsLocationModalOpen(true),
        closeLocationModal: () => setIsLocationModalOpen(false),
        detectGpsLocation,
        isLocating
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
