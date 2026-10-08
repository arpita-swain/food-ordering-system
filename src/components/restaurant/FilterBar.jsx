import React from 'react';
import { ArrowUpDown, Star, Sparkles, Clock, Check, X, ShieldCheck } from 'lucide-react';

export const FilterBar = ({ filters, onFilterChange, onReset }) => {
  const hasActiveFilters =
    filters.pureVeg ||
    filters.minRating > 0 ||
    filters.hasOffer ||
    filters.fastDelivery ||
    filters.sortBy !== 'recommended';

  return (
    <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-2 my-4">
      {/* Sort By Dropdown */}
      <div className="relative shrink-0">
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange('sortBy', e.target.value)}
          className="appearance-none pl-8 pr-8 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-full text-xs sm:text-sm font-semibold text-slate-700 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="recommended">Sort by: Recommended</option>
          <option value="rating">Rating: High to Low</option>
          <option value="deliveryTime">Delivery Time</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="distance">Distance: Nearest First</option>
        </select>
        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Pure Veg Pill */}
      <button
        type="button"
        onClick={() => onFilterChange('pureVeg', !filters.pureVeg)}
        className={`shrink-0 px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold border flex items-center gap-1.5 transition-all shadow-sm ${
          filters.pureVeg
            ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-1 ring-emerald-500'
            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
        }`}
      >
        <div className="w-3 h-3 rounded-sm border border-emerald-600 flex items-center justify-center p-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
        </div>
        <span>Pure Veg</span>
        {filters.pureVeg && <Check className="w-3.5 h-3.5 ml-0.5" />}
      </button>

      {/* Rating 4.0+ */}
      <button
        type="button"
        onClick={() => onFilterChange('minRating', filters.minRating === 4 ? 0 : 4)}
        className={`shrink-0 px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold border flex items-center gap-1.5 transition-all shadow-sm ${
          filters.minRating === 4
            ? 'bg-orange-50 border-orange-500 text-orange-700 ring-1 ring-orange-500'
            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
        }`}
      >
        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
        <span>Rating 4.0+</span>
        {filters.minRating === 4 && <Check className="w-3.5 h-3.5 ml-0.5" />}
      </button>

      {/* Fast Delivery (<30 min) */}
      <button
        type="button"
        onClick={() => onFilterChange('fastDelivery', !filters.fastDelivery)}
        className={`shrink-0 px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold border flex items-center gap-1.5 transition-all shadow-sm ${
          filters.fastDelivery
            ? 'bg-orange-50 border-orange-500 text-orange-700 ring-1 ring-orange-500'
            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
        }`}
      >
        <Clock className="w-3.5 h-3.5 text-orange-500" />
        <span>Fast Delivery (&lt;30m)</span>
        {filters.fastDelivery && <Check className="w-3.5 h-3.5 ml-0.5" />}
      </button>

      {/* Great Offers */}
      <button
        type="button"
        onClick={() => onFilterChange('hasOffer', !filters.hasOffer)}
        className={`shrink-0 px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold border flex items-center gap-1.5 transition-all shadow-sm ${
          filters.hasOffer
            ? 'bg-orange-50 border-orange-500 text-orange-700 ring-1 ring-orange-500'
            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>Great Offers</span>
        {filters.hasOffer && <Check className="w-3.5 h-3.5 ml-0.5" />}
      </button>

      {/* Reset Filters button */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onReset}
          className="shrink-0 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-full flex items-center gap-1 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          <span>Clear Filters</span>
        </button>
      )}
    </div>
  );
};
