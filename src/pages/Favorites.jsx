import React, { useState, useEffect } from 'react';
import { Heart, Store, Utensils } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { restaurantApi } from '../api/restaurantApi';
import { foodApi } from '../api/foodApi';
import { RestaurantCard } from '../components/restaurant/RestaurantCard';
import { FoodCard } from '../components/food/FoodCard';
import { EmptyState } from '../components/common/EmptyState';

export const Favorites = () => {
  const { favoriteRestaurants, favoriteFoods } = useFavorites();
  const [activeTab, setActiveTab] = useState('restaurants'); // 'restaurants' | 'foods'
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [allFoods, setAllFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [rests, foods] = await Promise.all([
          restaurantApi.getRestaurants(),
          foodApi.getFoodItems()
        ]);
        setAllRestaurants(rests);
        setAllFoods(foods);
      } catch (err) {
        console.error('Failed to load favorites data', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const savedRestaurantsList = allRestaurants.filter((r) =>
    favoriteRestaurants.includes(r.id)
  );

  const savedFoodsList = allFoods.filter((f) =>
    favoriteFoods.includes(f.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <div className="pb-6 mb-6 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-500 fill-current" />
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Your Favorites</h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Your bookmarked restaurants and favorite delicacies in one place
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8">
        <button
          onClick={() => setActiveTab('restaurants')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'restaurants'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Restaurants ({savedRestaurantsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('foods')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'foods'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Dishes ({savedFoodsList.length})</span>
        </button>
      </div>

      {/* Grid Content */}
      {activeTab === 'restaurants' ? (
        savedRestaurantsList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedRestaurantsList.map((rest) => (
              <RestaurantCard key={rest.id} restaurant={rest} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="❤️"
            title="No favorite restaurants saved"
            description="Tap the heart icon on any restaurant to bookmark your go-to food hubs."
            actionText="Browse Restaurants"
            actionLink="/"
          />
        )
      ) : savedFoodsList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedFoodsList.map((food) => {
            const rest = allRestaurants.find((r) => r.id === food.restaurantId) || {
              id: food.restaurantId,
              name: 'Restaurant'
            };
            return <FoodCard key={food.id} food={food} restaurant={rest} />;
          })}
        </div>
      ) : (
        <EmptyState
          icon="🍕"
          title="No favorite dishes saved"
          description="Save delicious biryanis, burgers, and desserts for quick 1-click reordering."
          actionText="Find Delicious Food"
          actionLink="/"
        />
      )}
    </div>
  );
};
