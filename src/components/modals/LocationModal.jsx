import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Navigation, Home, Briefcase, Plus, Check } from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';
import { LocationPickerMap } from '../map/LocationPickerMap';
import { AddressModal } from './AddressModal';

export const LocationModal = () => {
  const {
    isLocationModalOpen,
    closeLocationModal,
    currentLocation,
    setLocation,
    detectGpsLocation,
    isLocating
  } = useLocation();

  const { addresses } = useAuth();
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);

  if (!isLocationModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Select Delivery Location</h3>
              <p className="text-xs text-slate-400">Choose your address for accurate delivery time and menu</p>
            </div>
            <button
              onClick={closeLocationModal}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-5">
            {/* 1. Detect Live GPS Button */}
            <button
              type="button"
              onClick={detectGpsLocation}
              disabled={isLocating}
              className="w-full p-4 rounded-2xl border-2 border-dashed border-orange-300 hover:border-orange-500 bg-orange-50/50 hover:bg-orange-50 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                  <Navigation className={`w-5 h-5 ${isLocating ? 'animate-spin' : ''}`} />
                </div>
                <div className="text-left">
                  <div className="text-xs sm:text-sm font-bold text-slate-900">
                    Use Current GPS Location
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {isLocating ? 'Detecting coordinates...' : 'Pin your live location automatically'}
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-orange-600">Detect</span>
            </button>

            {/* Toggle Map View */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Pick using map
              </span>
              <button
                type="button"
                onClick={() => setShowMapPicker(!showMapPicker)}
                className="text-xs font-bold text-orange-600 hover:text-orange-700"
              >
                {showMapPicker ? 'Hide Map' : 'Open Live Map'}
              </button>
            </div>

            {showMapPicker && (
              <LocationPickerMap
                onSelectAddress={(loc) => {
                  setLocation(loc);
                  setShowMapPicker(false);
                }}
              />
            )}

            {/* 2. Saved Addresses List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Saved Addresses
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddAddressOpen(true)}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New</span>
                </button>
              </div>

              <div className="space-y-2">
                {addresses.map((addr, idx) => {
                  const isCurrent = currentLocation?.address === addr.street || currentLocation?.label === addr.type;
                  return (
                    <div
                      key={`loc-addr-${addr.id || idx}-${idx}`}
                      onClick={() =>
                        setLocation({
                          label: addr.type,
                          type: addr.type,
                          address: `${addr.house}, ${addr.street}, ${addr.city}`,
                          city: addr.city,
                          pincode: addr.pincode,
                          lat: addr.lat,
                          lng: addr.lng
                        })
                      }
                      className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                        isCurrent
                          ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                          {addr.type === 'Home' ? <Home className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{addr.type}</div>
                          <div className="text-xs text-slate-500 line-clamp-1">
                            {addr.house}, {addr.street}, {addr.city}
                          </div>
                        </div>
                      </div>

                      {isCurrent && <Check className="w-4 h-4 text-orange-600 stroke-[3]" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <AddressModal
        isOpen={isAddAddressOpen}
        onClose={() => setIsAddAddressOpen(false)}
      />
    </AnimatePresence>
  );
};
