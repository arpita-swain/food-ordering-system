import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, X, Sparkles, Clock, Utensils, Store, ChevronRight } from 'lucide-react';
import { restaurantApi } from '../api/restaurantApi';
import { foodApi } from '../api/foodApi';
import { FoodCard } from '../components/food/FoodCard';
import { RestaurantCard } from '../components/restaurant/RestaurantCard';
import { EmptyState } from '../components/common/EmptyState';
import { FoodSkeleton, RestaurantSkeleton } from '../components/common/SkeletonCard';

export const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState('dishes'); // 'dishes' | 'restaurants'
  const [loading, setLoading] = useState(false);
  const [allFoods, setAllFoods] = useState([]);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('foodiego_recent_searches');
      return saved ? JSON.parse(saved) : ['Biryani', 'Pizza', 'Burger', 'Paneer'];
    } catch {
      return ['Biryani', 'Pizza', 'Burger'];
    }
  });

  const popularSearches = [
    '🍗 Chicken Biryani',
    '🍔 Smash Burger',
    '🍕 Farmhouse Pizza',
    '🍛 Butter Chicken',
    '🥟 Dimsums',
    '🍰 Chocolate Pastry',
    '🥗 Satvik Thali'
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [foods, rests] = await Promise.all([
          foodApi.getFoodItems(),
          restaurantApi.getRestaurants()
        ]);
        setAllFoods(foods);
        setAllRestaurants(rests);
      } catch (err) {
        console.error('Search fetch error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
      addRecentSearch(query.trim());
    }
  };

  const addRecentSearch = (searchTerm) => {
    const updated = [searchTerm, ...recentSearches.filter((s) => s.toLowerCase() !== searchTerm.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    localStorage.setItem('foodiego_recent_searches', JSON.stringify(updated));
  };

  const clearQuery = () => {
    setQuery('');
    setSearchParams({});
  };

  const executeSearchTag = (tag) => {
    const cleaned = tag.replace(/^[^\w\s]+/, '').trim();
    setQuery(cleaned);
    setSearchParams({ q: cleaned });
    addRecentSearch(cleaned);
  };

  // Filter matched dishes and restaurants
  const cleanQ = query.trim().toLowerCase();

  const matchedFoods = cleanQ
    ? allFoods.filter(
        (f) =>
          f.name.toLowerCase().includes(cleanQ) ||
          f.category.toLowerCase().includes(cleanQ) ||
          f.description.toLowerCase().includes(cleanQ)
      )
    : [];

  const matchedRestaurants = cleanQ
    ? allRestaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(cleanQ) ||
          r.cuisines.some((c) => c.toLowerCase().includes(cleanQ)) ||
          r.address.toLowerCase().includes(cleanQ)
      )
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Search Input Bar */}
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value) {
                setSearchParams({ q: e.target.value });
              } else {
                setSearchParams({});
              }
            }}
            placeholder="Search for restaurants, dishes or cuisines..."
            className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl shadow-md text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            autoFocus
          />
          <SearchIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          {query && (
            <button
              type="button"
              onClick={clearQuery}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 absolute right-3.5 top-1/2 -translate-y-1/2"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </form>

        {/* When no query is typed, show popular & recent tags */}
        {!query && (
          <div className="mt-8 space-y-6">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Recent Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((s, idx) => (
                    <button
                      key={`recent-${s}-${idx}`}
                      onClick={() => executeSearchTag(s)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-orange-50 hover:text-orange-600 rounded-xl text-xs sm:text-sm text-slate-700 font-medium transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>Popular Trending Cravings</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((item, idx) => (
                  <button
                    key={`popular-${item}-${idx}`}
                    onClick={() => executeSearchTag(item)}
                    className="px-3.5 py-2 bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-2xl text-xs sm:text-sm text-slate-700 hover:text-orange-600 font-semibold transition-all shadow-xs"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results View */}
      {query && (
        <div className="mt-8">
          {/* Tabs */}
          <div className="flex items-center justify-center gap-2 mb-8 border-b border-slate-200 pb-3">
            <button
              onClick={() => setActiveTab('dishes')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-xs sm:text-sm transition-all ${
                activeTab === 'dishes'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Dishes ({matchedFoods.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('restaurants')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-xs sm:text-sm transition-all ${
                activeTab === 'restaurants'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Restaurants ({matchedRestaurants.length})</span>
            </button>
          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <FoodSkeleton key={`search-skel-${i}`} />
              ))}
            </div>
          ) : activeTab === 'dishes' ? (
            matchedFoods.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matchedFoods.map((food, idx) => {
                  const rest = allRestaurants.find((r) => r.id === food.restaurantId) || {
                    id: food.restaurantId,
                    name: 'Restaurant'
                  };
                  return <FoodCard key={`search-food-${food.id || idx}-${idx}`} food={food} restaurant={rest} />;
                })}
              </div>
            ) : (
              <EmptyState
                icon="🔍"
                title={`No dishes found for "${query}"`}
                description="Try checking your spelling or searching for a different dish, cuisine or restaurant name."
                actionText="Explore All Restaurants"
                actionLink="/"
              />
            )
          ) : matchedRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedRestaurants.map((restaurant, idx) => (
                <RestaurantCard key={`search-rest-${restaurant.id || idx}-${idx}`} restaurant={restaurant} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="🏪"
              title={`No restaurants found for "${query}"`}
              description="We could not find any restaurants matching your query. Explore top-rated places instead!"
              actionText="View Top Restaurants"
              actionLink="/"
            />
          )}
        </div>
      )}
    </div>
  );
};
