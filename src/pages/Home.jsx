import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  MapPin,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Percent,
  Flame,
  Award,
  ChevronRight
} from 'lucide-react';
import { restaurantApi } from '../api/restaurantApi';
import { foodApi } from '../api/foodApi';
import { CategoryScroll } from '../components/food/CategoryScroll';
import { RestaurantCard } from '../components/restaurant/RestaurantCard';
import { FilterBar } from '../components/restaurant/FilterBar';
import { RestaurantSkeleton } from '../components/common/SkeletonCard';
import { EmptyState } from '../components/common/EmptyState';
import { useLocation } from '../context/LocationContext';
import { formatCurrency } from '../utils/formatters';

export const Home = () => {
  const { currentLocation, openLocationModal } = useLocation();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [recommendedFoods, setRecommendedFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroSearch, setHeroSearch] = useState('');

  // Filters state
  const [filters, setFilters] = useState({
    category: 'All',
    sortBy: 'recommended',
    pureVeg: false,
    minRating: 0,
    hasOffer: false,
    fastDelivery: false
  });

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);
      try {
        const [cats, rests, foods] = await Promise.all([
          foodApi.getCategories(),
          restaurantApi.getRestaurants(),
          foodApi.getFoodItems()
        ]);
        setCategories(cats);
        setRestaurants(rests);
        // Smart AI Recommendations: top recommended & bestseller dishes
        const smartPicks = foods.filter((f) => f.isBestseller || f.isRecommended).slice(0, 4);
        setRecommendedFoods(smartPicks);
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      category: 'All',
      sortBy: 'recommended',
      pureVeg: false,
      minRating: 0,
      hasOffer: false,
      fastDelivery: false
    });
  };

  // Filter and sort restaurant list
  const filteredRestaurants = restaurants.filter((r) => {
    if (filters.category !== 'All') {
      const matchCuisine = r.cuisines.some((c) =>
        c.toLowerCase().includes(filters.category.toLowerCase())
      );
      if (!matchCuisine) return false;
    }
    if (filters.pureVeg && !r.pureVeg) return false;
    if (filters.minRating && r.rating < filters.minRating) return false;
    if (filters.hasOffer && !r.offer) return false;
    if (filters.fastDelivery && r.deliveryTimeMinutes > 30) return false;
    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'rating') return b.rating - a.rating;
    if (filters.sortBy === 'deliveryTime') return a.deliveryTimeMinutes - b.deliveryTimeMinutes;
    if (filters.sortBy === 'priceLow') return a.priceForTwo - b.priceForTwo;
    if (filters.sortBy === 'distance') return a.distanceKm - b.distanceKm;
    return 0; // recommended
  });

  return (
    <div className="min-h-screen pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/80 via-white to-slate-50 pt-8 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 text-orange-700 text-xs sm:text-sm font-bold shadow-sm">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span>Superfast Food Delivery in {currentLocation?.city || 'Dantan'}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Good food. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500">
                  Great mood.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl font-normal leading-relaxed">
                Discover the best restaurants, piping hot biryanis, gourmet burgers, and delicious street delicacies near you.
              </p>

              {/* Hero Search Box */}
              <div className="bg-white p-2 sm:p-2.5 rounded-3xl shadow-xl shadow-orange-950/5 border border-slate-200/80 max-w-xl">
                <form onSubmit={handleHeroSearch} className="flex flex-col sm:flex-row items-center gap-2">
                  {/* Location Chip Button */}
                  <button
                    type="button"
                    onClick={openLocationModal}
                    className="w-full sm:w-auto flex items-center gap-2 px-3.5 py-2.5 rounded-2xl hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold shrink-0 border border-slate-100 sm:border-none"
                  >
                    <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                    <span className="truncate max-w-[130px] text-slate-800 font-bold">
                      {currentLocation?.label || 'Home'}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <div className="hidden sm:block w-[1px] h-7 bg-slate-200" />

                  {/* Input Search */}
                  <div className="relative flex-1 w-full">
                    <input
                      type="text"
                      value={heroSearch}
                      onChange={(e) => setHeroSearch(e.target.value)}
                      placeholder="Search for restaurants, dishes or cuisines..."
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>

                  {/* CTA Button */}
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all shrink-0"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Quick tags */}
              <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 pt-1">
                <span className="font-semibold text-slate-600">Popular:</span>
                {['Biryani', 'Burgers', 'Pizza', 'Pure Veg', 'Rolls'].map((tag, idx) => (
                  <button
                    key={`popular-tag-${tag}-${idx}`}
                    onClick={() => {
                      if (tag === 'Pure Veg') {
                        setFilters((prev) => ({ ...prev, pureVeg: true }));
                      } else {
                        setFilters((prev) => ({ ...prev, category: tag }));
                      }
                    }}
                    className="px-3 py-1 bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-full text-slate-600 hover:text-orange-600 transition-colors shadow-2xs"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Right Hero Visual Cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md">
                {/* Main Hero Card */}
                <div className="rounded-3xl overflow-hidden shadow-2xl shadow-orange-950/15 border-4 border-white bg-white">
                  <div className="relative h-64 sm:h-72 w-full">
                    <img
                      src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80"
                      alt="Special Biryani Feast"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute top-4 left-4 bg-orange-600/90 backdrop-blur-md text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      <span>Trending #1 Dish</span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="text-xs uppercase tracking-wider font-semibold text-amber-300 mb-0.5">
                        Spice Garden Royal
                      </div>
                      <h3 className="text-xl font-black">Chicken Dum Handi Biryani</h3>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20">
                        <span className="font-extrabold text-lg text-amber-400">₹249</span>
                        <Link
                          to="/restaurant/rest-1"
                          className="px-3.5 py-1.5 bg-white text-orange-600 hover:bg-orange-50 font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1"
                        >
                          <span>Order Now</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating promo badge */}
                <div className="absolute -top-4 -right-4 sm:-right-6 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg font-bold">
                    🚀
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">25 Min Delivery</div>
                    <div className="text-[10px] text-slate-400">Hot & Fresh at Doorstep</div>
                  </div>
                </div>

                {/* Floating offer pill */}
                <div className="absolute -bottom-4 -left-4 bg-slate-900 text-white p-3 rounded-2xl shadow-xl border border-slate-800 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
                    <Percent className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-black">Flat ₹100 OFF</div>
                    <div className="text-[10px] text-slate-400">Use Code: FOODIE100</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* 2. Food Categories Horizontal Carousel */}
        <CategoryScroll
          categories={categories}
          selectedCategory={filters.category}
          onSelectCategory={(catName) => handleFilterChange('category', catName)}
        />

        {/* 3. AI Recommendation Section: "Recommended for you" */}
        {recommendedFoods.length > 0 && (
          <section className="my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-rose-50/30 border border-orange-100/80 shadow-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-orange-600 uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Smart Pick For You</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Because you love Biryani & Burgers ❤️
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Personalized recommendations tuned to your palate and previous cravings
                </p>
              </div>

              <Link
                to="/search"
                className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 self-start sm:self-auto"
              >
                <span>View all cravings</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recommendedFoods.map((item, idx) => (
                <Link
                  key={`rec-food-${item.id || idx}-${idx}`}
                  to={`/restaurant/${item.restaurantId}`}
                  className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="relative h-36 w-full rounded-xl overflow-hidden bg-slate-100 mb-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      ⭐ {item.rating}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">{item.category}</p>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                      <span className="font-extrabold text-sm text-slate-900">
                        {formatCurrency(item.price)}
                      </span>
                      <span className="text-xs font-bold text-orange-600 group-hover:translate-x-1 transition-transform flex items-center">
                        Order <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 4. Restaurant Discovery Header & Filter Bar */}
        <section className="mt-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Top restaurants near you
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Showing {filteredRestaurants.length} verified culinary destinations
                {filters.category !== 'All' ? ` for "${filters.category}"` : ''}
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={resetFilters}
          />

          {/* Restaurant Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <RestaurantSkeleton key={`home-skel-${i}`} />
              ))}
            </div>
          ) : filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
              {filteredRestaurants.map((restaurant, idx) => (
                <RestaurantCard key={`home-rest-${restaurant.id || idx}-${idx}`} restaurant={restaurant} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="🍽️"
              title="No restaurants found"
              description="Try changing your filters or choosing a different category to explore delicious food options."
              actionText="Reset All Filters"
              onAction={resetFilters}
            />
          )}
        </section>
      </div>
    </div>
  );
};
