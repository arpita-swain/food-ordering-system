import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart,
  Share2,
  Bike,
  Clock,
  MapPin,
  CheckCircle,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Search
} from 'lucide-react';
import { restaurantApi } from '../api/restaurantApi';
import { foodApi } from '../api/foodApi';
import { FoodCard } from '../components/food/FoodCard';
import { Rating } from '../components/common/Rating';
import { VegBadge } from '../components/food/VegBadge';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';
import { useToast } from '../context/ToastContext';

export const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [onlyVeg, setOnlyVeg] = useState(false);
  const [menuSearch, setMenuSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const { isRestaurantFavorite, toggleFavoriteRestaurant } = useFavorites();
  const { items, grandTotal, itemCount } = useCart();
  const { addToast } = useToast();

  useEffect(() => {
    const fetchRestaurantData = async () => {
      setLoading(true);
      try {
        const rest = await restaurantApi.getRestaurantById(id);
        const foods = await foodApi.getFoodItems({ restaurantId: id });
        setRestaurant(rest);
        setMenuItems(foods);
      } catch (err) {
        console.error('Failed to load restaurant details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurantData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="w-full h-72 bg-slate-200 animate-pulse rounded-3xl mb-8" />
        <div className="space-y-4 max-w-lg">
          <div className="h-8 bg-slate-200 rounded-md w-3/4 animate-pulse" />
          <div className="h-4 bg-slate-200 rounded-md w-1/2 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <div className="text-5xl mb-4">🏪</div>
        <h2 className="text-2xl font-bold text-slate-800">Restaurant Not Found</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">
          The restaurant you are looking for is currently unavailable or closed.
        </p>
        <Link
          to="/"
          className="px-6 py-2.5 bg-orange-500 text-white font-bold rounded-full shadow-lg"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  const isFav = isRestaurantFavorite(restaurant.id);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Restaurant link copied to clipboard! 📋');
    }
  };

  // Derive unique categories from menu items
  const menuCategories = Array.from(
    new Set([
      'All',
      'Recommended',
      'Bestsellers',
      ...menuItems.map((f) => f.category).filter(Boolean)
    ])
  );

  // Filter menu items
  const filteredFoods = menuItems.filter((item) => {
    if (onlyVeg && !item.isVeg) return false;
    if (selectedCategory === 'Recommended' && !item.isRecommended) return false;
    if (selectedCategory === 'Bestsellers' && !item.isBestseller) return false;
    if (
      selectedCategory !== 'All' &&
      selectedCategory !== 'Recommended' &&
      selectedCategory !== 'Bestsellers' &&
      item.category !== selectedCategory
    ) {
      return false;
    }
    if (menuSearch.trim()) {
      const q = menuSearch.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen pb-28">
      {/* Restaurant Header Banner */}
      <div className="relative h-64 sm:h-80 w-full bg-slate-900 overflow-hidden">
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Top Action Buttons (Back, Wishlist, Share) */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <button
            onClick={() => toggleFavoriteRestaurant(restaurant.id, restaurant.name)}
            className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              isFav
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                : 'bg-black/40 hover:bg-black/60 text-white'
            }`}
            aria-label="Add to favorites"
          >
            <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-colors"
            aria-label="Share restaurant"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Floating Restaurant Details Card */}
        <div className="absolute bottom-4 left-4 right-4 max-w-7xl mx-auto text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500 text-white flex items-center gap-1 shadow">
                <CheckCircle className="w-3 h-3" />
                <span>Open Now</span>
              </span>
              {restaurant.pureVeg && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-900/80 text-emerald-200 border border-emerald-500/50">
                  Pure Veg
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black drop-shadow-md">
              {restaurant.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300">
              {restaurant.cuisines?.join(' • ')}
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-300 pt-1">
              <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span className="truncate max-w-md">{restaurant.address}</span>
            </div>
          </div>

          {/* Quick Metrics Pill */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shrink-0">
            <div className="flex flex-col items-center px-2">
              <Rating rating={restaurant.rating} count={restaurant.ratingCount} size="md" />
              <span className="text-[10px] text-slate-300 mt-0.5">Rating</span>
            </div>
            <div className="w-[1px] h-8 bg-white/20" />
            <div className="flex flex-col items-center px-2">
              <span className="text-sm font-bold text-white flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-orange-400" />
                <span>{restaurant.deliveryTime}</span>
              </span>
              <span className="text-[10px] text-slate-300 mt-0.5">{restaurant.distance}</span>
            </div>
            <div className="w-[1px] h-8 bg-white/20" />
            <div className="flex flex-col items-center px-2">
              <span className="text-sm font-bold text-white">
                {formatCurrency(restaurant.priceForTwo)}
              </span>
              <span className="text-[10px] text-slate-300 mt-0.5">For Two</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Search & Menu filter controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          {/* Menu Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {menuCategories.map((category, idx) => (
              <button
                key={`cat-${category}-${idx}`}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold shrink-0 transition-all ${
                  selectedCategory === category
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Right Controls: Veg Filter & Dish Search */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Pure Veg Switch */}
            <button
              onClick={() => setOnlyVeg(!onlyVeg)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs sm:text-sm font-bold transition-all ${
                onlyVeg
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-1 ring-emerald-500'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <VegBadge isVeg={true} />
              <span>Veg Only</span>
            </button>

            {/* In-restaurant search */}
            <div className="relative">
              <input
                type="text"
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                placeholder="Search dish in menu..."
                className="pl-8 pr-3 py-2 bg-slate-100 border border-slate-200 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 w-40 sm:w-48"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              {selectedCategory === 'All' ? 'All Dishes' : selectedCategory} ({filteredFoods.length})
            </h2>
            {restaurant.offer && (
              <div className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{restaurant.offer}</span>
              </div>
            )}
          </div>

          {filteredFoods.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFoods.map((food, idx) => (
                <FoodCard key={`food-${food.id || idx}-${idx}`} food={food} restaurant={restaurant} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8">
              <div className="text-4xl mb-2">🍽️</div>
              <h3 className="text-base font-bold text-slate-800">No dishes match your filter</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Try switching off the "Veg Only" toggle or searching another keyword.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setOnlyVeg(false);
                  setMenuSearch('');
                }}
                className="px-4 py-2 bg-orange-500 text-white font-bold rounded-xl text-xs"
              >
                Reset Menu Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Mini Cart Drawer Bar */}
      {itemCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-lg mx-auto z-40">
          <Link
            to="/cart"
            className="flex items-center justify-between p-4 bg-slate-950 text-white rounded-3xl shadow-2xl border border-slate-800 hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black text-sm shadow-md shadow-orange-500/30">
                {itemCount}
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400">Total in Cart</div>
                <div className="text-base font-extrabold text-white">
                  {formatCurrency(grandTotal)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 font-bold text-sm bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-2xl shadow-md transition-colors">
              <span>View Cart</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};
