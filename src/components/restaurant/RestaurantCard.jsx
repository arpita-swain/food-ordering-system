import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Bike, Clock, Sparkles } from 'lucide-react';
import { Rating } from '../common/Rating';
import { VegBadge } from '../food/VegBadge';
import { formatCurrency } from '../../utils/formatters';
import { useFavorites } from '../../context/FavoritesContext';

export const RestaurantCard = ({ restaurant }) => {
  const { isRestaurantFavorite, toggleFavoriteRestaurant } = useFavorites();
  const isFav = isRestaurantFavorite(restaurant.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavoriteRestaurant(restaurant.id, restaurant.name);
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
    >
      <Link to={`/restaurant/${restaurant.id}`} className="block relative">
        {/* Cover Image */}
        <div className="relative h-48 sm:h-52 w-full bg-slate-100 overflow-hidden">
          <img
            src={restaurant.coverImage}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Discount Offer Ribbon */}
          {restaurant.offer && (
            <div className="absolute bottom-3 left-3 bg-gradient-to-r from-orange-600 to-amber-500 text-white font-extrabold text-xs uppercase px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1 tracking-wide">
              <Sparkles className="w-3 h-3" />
              <span>{restaurant.offer}</span>
            </div>
          )}

          {/* Favorite Heart Button */}
          <button
            type="button"
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              isFav
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40'
                : 'bg-black/30 text-white hover:bg-black/50 hover:text-rose-400'
            }`}
            aria-label="Save to favorites"
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          </button>

          {/* Pure Veg Pill */}
          {restaurant.pureVeg && (
            <div className="absolute top-3 left-3 bg-emerald-600/90 backdrop-blur-md text-white font-semibold text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1">
              <VegBadge isVeg={true} size="sm" />
              <span>Pure Veg</span>
            </div>
          )}
        </div>

        {/* Content details */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                {restaurant.name}
              </h3>
              <Rating rating={restaurant.rating} count={restaurant.ratingCount} size="sm" />
            </div>

            <p className="text-xs sm:text-sm text-slate-500 line-clamp-1 mb-2">
              {restaurant.cuisines?.join(' • ')}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5 text-slate-700">
              <Bike className="w-3.5 h-3.5 text-orange-500" />
              <span>{restaurant.deliveryTime}</span>
              <span>•</span>
              <span>{restaurant.distance}</span>
            </div>

            <span className="font-semibold text-slate-800">
              {formatCurrency(restaurant.priceForTwo)} for two
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
