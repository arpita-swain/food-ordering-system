import { apiClient, localDb } from './client';

export const restaurantApi = {
  // Fetch all restaurants with optional filters
  async getRestaurants(filters = {}) {
    try {
      const response = await apiClient.get('/restaurants', { params: filters });
      return response.data;
    } catch {
      let list = localDb.get('restaurants');
      
      if (filters.pureVeg) {
        list = list.filter(r => r.pureVeg);
      }
      if (filters.minRating) {
        list = list.filter(r => r.rating >= filters.minRating);
      }
      if (filters.cuisine && filters.cuisine !== 'All') {
        list = list.filter(r => 
          r.cuisines.some(c => c.toLowerCase().includes(filters.cuisine.toLowerCase()))
        );
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(r => 
          r.name.toLowerCase().includes(q) ||
          r.cuisines.some(c => c.toLowerCase().includes(q))
        );
      }
      if (filters.sortBy) {
        if (filters.sortBy === 'rating') {
          list.sort((a, b) => b.rating - a.rating);
        } else if (filters.sortBy === 'deliveryTime') {
          list.sort((a, b) => a.deliveryTimeMinutes - b.deliveryTimeMinutes);
        } else if (filters.sortBy === 'priceLow') {
          list.sort((a, b) => a.priceForTwo - b.priceForTwo);
        } else if (filters.sortBy === 'distance') {
          list.sort((a, b) => a.distanceKm - b.distanceKm);
        }
      }
      return list;
    }
  },

  // Get specific restaurant by ID
  async getRestaurantById(id) {
    try {
      const response = await apiClient.get(`/restaurants/${id}`);
      return response.data;
    } catch {
      const list = localDb.get('restaurants');
      return list.find(r => r.id === id) || null;
    }
  },

  // Admin: Create restaurant
  async createRestaurant(restaurantData) {
    try {
      const response = await apiClient.post('/restaurants', restaurantData);
      return response.data;
    } catch {
      const list = localDb.get('restaurants');
      const newRest = {
        ...restaurantData,
        id: `rest-${Date.now()}`,
        rating: 4.5,
        ratingCount: 'New',
        featured: false,
        isOpen: true,
        deliveryTimeMinutes: parseInt(restaurantData.deliveryTime) || 30,
        distanceKm: parseFloat(restaurantData.distance) || 2.5
      };
      list.unshift(newRest);
      localDb.set('restaurants', list);
      return newRest;
    }
  },

  // Admin: Update restaurant
  async updateRestaurant(id, updates) {
    try {
      const response = await apiClient.put(`/restaurants/${id}`, updates);
      return response.data;
    } catch {
      const list = localDb.get('restaurants');
      const index = list.findIndex(r => r.id === id);
      if (index !== -1) {
        list[index] = { ...list[index], ...updates };
        localDb.set('restaurants', list);
        return list[index];
      }
      throw new Error('Restaurant not found');
    }
  },

  // Admin: Delete restaurant
  async deleteRestaurant(id) {
    try {
      await apiClient.delete(`/restaurants/${id}`);
      return { success: true };
    } catch {
      let list = localDb.get('restaurants');
      list = list.filter(r => r.id !== id);
      localDb.set('restaurants', list);
      return { success: true };
    }
  }
};
