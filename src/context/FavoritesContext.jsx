import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const [favoriteRestaurants, setFavoriteRestaurants] = useState(() => {
    try {
      const saved = localStorage.getItem('foodiego_fav_restaurants');
      return saved ? JSON.parse(saved) : ['rest-1', 'rest-5'];
    } catch {
      return ['rest-1', 'rest-5'];
    }
  });

  const [favoriteFoods, setFavoriteFoods] = useState(() => {
    try {
      const saved = localStorage.getItem('foodiego_fav_foods');
      return saved ? JSON.parse(saved) : ['food-101', 'food-201'];
    } catch {
      return ['food-101', 'food-201'];
    }
  });

  const { addToast } = useToast();

  useEffect(() => {
    localStorage.setItem('foodiego_fav_restaurants', JSON.stringify(favoriteRestaurants));
  }, [favoriteRestaurants]);

  useEffect(() => {
    localStorage.setItem('foodiego_fav_foods', JSON.stringify(favoriteFoods));
  }, [favoriteFoods]);

  const toggleFavoriteRestaurant = (id, name = 'Restaurant') => {
    setFavoriteRestaurants((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        addToast(`Removed ${name} from favorites`, 'info');
        return prev.filter((item) => item !== id);
      } else {
        addToast(`Added ${name} to favorites ❤️`);
        return [...prev, id];
      }
    });
  };

  const isRestaurantFavorite = (id) => favoriteRestaurants.includes(id);

  const toggleFavoriteFood = (id, name = 'Dish') => {
    setFavoriteFoods((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        addToast(`Removed ${name} from favorites`, 'info');
        return prev.filter((item) => item !== id);
      } else {
        addToast(`Added ${name} to favorites ❤️`);
        return [...prev, id];
      }
    });
  };

  const isFoodFavorite = (id) => favoriteFoods.includes(id);

  return (
    <FavoritesContext.Provider
      value={{
        favoriteRestaurants,
        favoriteFoods,
        toggleFavoriteRestaurant,
        isRestaurantFavorite,
        toggleFavoriteFood,
        isFoodFavorite,
        totalFavoritesCount: favoriteRestaurants.length + favoriteFoods.length
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
