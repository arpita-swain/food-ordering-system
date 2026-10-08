import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartWarningModal = () => {
  const {
    conflictModal,
    confirmRestaurantSwitch,
    cancelRestaurantSwitch,
    restaurant: currentRestaurant
  } = useCart();

  if (!conflictModal.isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Replace cart items?
          </h3>

          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Your cart contains items from{' '}
            <span className="font-bold text-slate-800">
              {currentRestaurant?.name || 'another restaurant'}
            </span>
            . Do you want to discard them and add items from{' '}
            <span className="font-bold text-orange-600">
              {conflictModal.pendingRestaurant?.name}
            </span>
            ?
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={cancelRestaurantSwitch}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 active:scale-95 transition-all"
            >
              No, Keep Cart
            </button>
            <button
              type="button"
              onClick={confirmRestaurantSwitch}
              className="flex-1 py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-orange-600/30 flex items-center justify-center gap-1.5 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span>Discard & Add</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
