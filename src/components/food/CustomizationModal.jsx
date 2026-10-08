import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Check } from 'lucide-react';
import { VegBadge } from './VegBadge';
import { formatCurrency } from '../../utils/formatters';

export const CustomizationModal = ({
  isOpen,
  onClose,
  food,
  restaurant,
  onAddToCart
}) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (food) {
      const defaultSize = food.customizations?.sizes?.[0] || { name: 'Regular', price: 0 };
      setSelectedSize(defaultSize);
      setSelectedExtras([]);
      setQuantity(1);
      setNote('');
    }
  }, [food]);

  if (!isOpen || !food) return null;

  const basePrice = food.price;
  const sizeExtra = selectedSize?.price || 0;
  const extrasCost = selectedExtras.reduce((sum, item) => sum + item.price, 0);
  const unitPrice = basePrice + sizeExtra + extrasCost;
  const totalPrice = unitPrice * quantity;

  const toggleExtra = (extra) => {
    setSelectedExtras((prev) => {
      const exists = prev.some((e) => e.name === extra.name);
      if (exists) {
        return prev.filter((e) => e.name !== extra.name);
      } else {
        return [...prev, extra];
      }
    });
  };

  const handleAdd = () => {
    onAddToCart(
      food,
      {
        size: selectedSize,
        extras: selectedExtras,
        quantity,
        note
      },
      restaurant
    );
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header with image */}
          <div className="relative h-44 sm:h-52 w-full bg-slate-100 shrink-0">
            <img
              src={food.image}
              alt={food.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute bottom-3 left-4 right-4 text-white">
              <div className="flex items-center gap-2 mb-1">
                <VegBadge isVeg={food.isVeg} />
                <span className="text-xs uppercase tracking-wider font-semibold text-orange-200">
                  {food.category}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold drop-shadow-sm">{food.name}</h3>
            </div>
          </div>

          {/* Scrollable options body */}
          <div className="p-5 overflow-y-auto space-y-6 flex-1 text-slate-700">
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {food.description}
            </p>

            {/* Choose Size */}
            {food.customizations?.sizes?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Choose Size
                </h4>
                <div className="space-y-2">
                  {food.customizations.sizes.map((sz, idx) => {
                    const isSelected = selectedSize?.name === sz.name;
                    return (
                      <label
                        key={idx}
                        onClick={() => setSelectedSize(sz)}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50/50 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-orange-500 bg-orange-500' : 'border-slate-400'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <span className={`text-sm ${isSelected ? 'font-semibold text-slate-900' : ''}`}>
                            {sz.name}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-slate-600">
                          {sz.price > 0 ? `+${formatCurrency(sz.price)}` : 'Included'}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add Extras */}
            {food.customizations?.extras?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Add Extras & Addons
                </h4>
                <div className="space-y-2">
                  {food.customizations.extras.map((extra, idx) => {
                    const isChecked = selectedExtras.some((e) => e.name === extra.name);
                    return (
                      <label
                        key={idx}
                        onClick={() => toggleExtra(extra)}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'border-orange-500 bg-orange-50/50 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                              isChecked ? 'border-orange-500 bg-orange-500 text-white' : 'border-slate-300'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className={`text-sm ${isChecked ? 'font-semibold text-slate-900' : ''}`}>
                            {extra.name}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-slate-600">
                          +{formatCurrency(extra.price)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Cooking note */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                Cooking Instructions (Optional)
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="E.g. Less spicy, keep chutney extra"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Footer with quantity and Add to Cart */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-4 shrink-0">
            {/* Quantity stepper */}
            <div className="flex items-center bg-white border border-slate-200 rounded-full p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
                disabled={quantity <= 1}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-bold text-slate-800">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-orange-600 hover:bg-orange-50 active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Submit button */}
            <button
              onClick={handleAdd}
              className="flex-1 flex items-center justify-between px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 transition-all text-sm"
            >
              <span>Add to Cart</span>
              <span>{formatCurrency(totalPrice)}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
