import React, { useState } from 'react';
import { Plus, Minus, Heart } from 'lucide-react';
import { VegBadge } from './VegBadge';
import { Rating } from '../common/Rating';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { CustomizationModal } from './CustomizationModal';

export const FoodCard = ({ food, restaurant }) => {
  const { items, addItem, updateQuantity } = useCart();
  const { isFoodFavorite, toggleFavoriteFood } = useFavorites();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Find if this food item is currently in cart
  const cartItemIndex = items.findIndex((i) => i.foodId === food.id);
  const cartItem = cartItemIndex > -1 ? items[cartItemIndex] : null;
  const isFavorite = isFoodFavorite(food.id);

  const handleAddClick = () => {
    // If food has customization options, open modal; otherwise quick add
    if (food.customizations?.sizes?.length > 1 || food.customizations?.extras?.length > 0) {
      setIsModalOpen(true);
    } else {
      addItem(food, { quantity: 1 }, restaurant);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex justify-between gap-4 group">
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <VegBadge isVeg={food.isVeg} />
              {food.isBestseller && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-amber-100 text-amber-800 border border-amber-200">
                  ★ Bestseller
                </span>
              )}
              {food.isRecommended && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-100">
                  Chef Choice
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
              {food.name}
            </h3>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-base font-extrabold text-slate-900">
                {formatCurrency(food.price)}
              </span>
              <Rating rating={food.rating} count={food.ratingCount} size="sm" />
            </div>

            <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
              {food.description}
            </p>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => toggleFavoriteFood(food.id, food.name)}
              className={`p-1.5 rounded-full transition-colors ${
                isFavorite
                  ? 'text-rose-500 bg-rose-50'
                  : 'text-slate-400 hover:text-rose-500 hover:bg-slate-50'
              }`}
              title="Add to wishlist"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <span className="text-[11px] text-slate-400">
              {food.customizations?.sizes?.length > 1 || food.customizations?.extras?.length > 0
                ? 'Customisable'
                : 'Direct Order'}
            </span>
          </div>
        </div>

        {/* Food Image and Add button */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-2xl overflow-hidden bg-slate-100 shadow-inner flex flex-col justify-end">
          <img
            src={food.image}
            alt={food.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Add / Stepper Button */}
          <div className="relative z-10 w-full px-2 pb-2">
            {cartItem ? (
              <div className="flex items-center justify-between bg-white text-orange-600 font-bold rounded-xl shadow-lg border border-orange-200 px-2 py-1 text-xs">
                <button
                  onClick={() => updateQuantity(cartItemIndex, cartItem.quantity - 1)}
                  className="p-1 hover:bg-orange-50 rounded"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-extrabold text-slate-800">{cartItem.quantity}</span>
                <button
                  onClick={() => updateQuantity(cartItemIndex, cartItem.quantity + 1)}
                  className="p-1 hover:bg-orange-50 rounded"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddClick}
                className="w-full py-1.5 bg-white hover:bg-orange-50 text-orange-600 font-bold rounded-xl shadow-lg border border-orange-200 text-xs sm:text-sm active:scale-95 transition-all text-center tracking-wide uppercase"
              >
                + ADD
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Customization modal */}
      <CustomizationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        food={food}
        restaurant={restaurant}
        onAddToCart={addItem}
      />
    </>
  );
};
