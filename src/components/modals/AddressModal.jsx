import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Home, Briefcase, Plus, Map } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LocationPickerMap } from '../map/LocationPickerMap';

export const AddressModal = ({ isOpen, onClose, onAddressAdded }) => {
  const { addAddress, user } = useAuth();
  const [showMap, setShowMap] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    house: '',
    street: '',
    landmark: '',
    city: 'Dantan',
    state: 'West Bengal',
    pincode: '721426',
    type: 'Home',
    lat: 21.9540,
    lng: 87.2720,
    isDefault: false
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.house || !formData.street) {
      alert('Please enter your house and street details');
      return;
    }
    const saved = await addAddress(formData);
    if (onAddressAdded) onAddressAdded(saved);
    onClose();
  };

  const handleMapPinSelected = (mapLoc) => {
    setFormData((prev) => ({
      ...prev,
      street: mapLoc.address,
      lat: mapLoc.lat,
      lng: mapLoc.lng
    }));
    setShowMap(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Add Delivery Address</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-5">
            {/* Map toggle banner */}
            <div className="flex items-center justify-between p-3.5 bg-orange-50/70 rounded-2xl border border-orange-100">
              <div className="flex items-center gap-3">
                <Map className="w-5 h-5 text-orange-600" />
                <div>
                  <div className="text-xs font-bold text-slate-800">Pinpoint on Live Map</div>
                  <div className="text-[11px] text-slate-500">Pick exact building using GPS</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMap(!showMap)}
                className="px-3 py-1.5 bg-white text-orange-600 font-bold rounded-xl border border-orange-200 text-xs shadow-sm hover:bg-orange-50 transition-colors"
              >
                {showMap ? 'Hide Map' : 'Select on Map'}
              </button>
            </div>

            {showMap && (
              <div className="pt-1 pb-3">
                <LocationPickerMap
                  initialLat={formData.lat}
                  initialLng={formData.lng}
                  onSelectAddress={handleMapPinSelected}
                />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type Selection */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                  Address Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Home', icon: Home },
                    { label: 'Work', icon: Briefcase },
                    { label: 'Other', icon: MapPin }
                  ].map(({ label, icon: Icon }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: label })}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                        formData.type === label
                          ? 'border-orange-500 bg-orange-50 text-orange-600 shadow-sm'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="E.g. Arpit Sinha"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Address specifics */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Flat, House no., Floor, Building *
                </label>
                <input
                  type="text"
                  required
                  value={formData.house}
                  onChange={(e) => setFormData({ ...formData, house: e.target.value })}
                  placeholder="E.g. Flat 4B, Sunrise Enclave"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Area, Street, Sector *
                </label>
                <input
                  type="text"
                  required
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  placeholder="E.g. Station Road, Near Post Office"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nearby Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={formData.landmark}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                  placeholder="E.g. Opposite State Bank"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">PIN</label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Set as default checkbox */}
              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500"
                />
                <span className="text-xs text-slate-600 font-medium">
                  Make this my default delivery address
                </span>
              </label>

              {/* Save CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 transition-all text-sm"
                >
                  Save Address & Proceed
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
