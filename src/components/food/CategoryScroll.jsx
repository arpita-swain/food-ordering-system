import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CategoryScroll = ({ categories = [], selectedCategory, onSelectCategory }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group my-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
            Inspiration for your first order
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Explore curated flavors and trending cravings
          </p>
        </div>

        {/* Scroll navigation arrows */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 active:scale-95 transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 active:scale-95 transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex items-center gap-5 sm:gap-7 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* "All" category pill */}
        <motion.button
          whileHover={{ y: -4, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectCategory('All')}
          className="flex flex-col items-center shrink-0 cursor-pointer text-center group/item focus:outline-none"
        >
          <div
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 transition-all ${
              selectedCategory === 'All'
                ? 'ring-4 ring-orange-500 ring-offset-2 shadow-lg shadow-orange-500/30'
                : 'hover:ring-2 hover:ring-slate-300'
            }`}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-3xl shadow-inner font-extrabold">
              ✨
            </div>
          </div>
          <span
            className={`mt-2 text-xs sm:text-sm font-semibold transition-colors ${
              selectedCategory === 'All' ? 'text-orange-600 font-bold' : 'text-slate-700 group-hover/item:text-orange-500'
            }`}
          >
            All Items
          </span>
        </motion.button>

        {categories.map((cat) => {
          const isSelected = selectedCategory?.toLowerCase() === cat.name.toLowerCase();

          return (
            <motion.button
              key={cat.id}
              whileHover={{ y: -4, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectCategory(cat.name)}
              className="flex flex-col items-center shrink-0 cursor-pointer text-center group/item focus:outline-none"
            >
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full p-0.5 transition-all overflow-hidden ${
                  isSelected
                    ? 'ring-4 ring-orange-500 ring-offset-2 shadow-lg shadow-orange-500/30'
                    : 'hover:ring-2 hover:ring-orange-300'
                }`}
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 shadow-sm relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover/item:bg-transparent transition-colors" />
                </div>
              </div>
              <span
                className={`mt-2 text-xs sm:text-sm font-semibold transition-colors ${
                  isSelected ? 'text-orange-600 font-bold' : 'text-slate-700 group-hover/item:text-orange-500'
                }`}
              >
                {cat.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
