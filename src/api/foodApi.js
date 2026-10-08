import { apiClient, localDb } from './client';

export const foodApi = {
  // Get all food items or by restaurant
  async getFoodItems(params = {}) {
    try {
      const response = await apiClient.get('/foods', { params });
      return response.data;
    } catch {
      let items = localDb.get('food_items');
      if (params.restaurantId) {
        items = items.filter(f => f.restaurantId === params.restaurantId);
      }
      if (params.category && params.category !== 'All') {
        items = items.filter(f => f.category.toLowerCase() === params.category.toLowerCase());
      }
      if (params.isVeg !== undefined) {
        items = items.filter(f => f.isVeg === params.isVeg);
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        items = items.filter(f => 
          f.name.toLowerCase().includes(q) || 
          f.description.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q)
        );
      }
      return items;
    }
  },

  // Get food categories
  async getCategories() {
    try {
      const response = await apiClient.get('/categories');
      return response.data;
    } catch {
      return localDb.get('categories');
    }
  },

  // Admin: Create food item
  async createFoodItem(foodData) {
    try {
      const response = await apiClient.post('/foods', foodData);
      return response.data;
    } catch {
      const list = localDb.get('food_items');
      const newItem = {
        ...foodData,
        id: `food-${Date.now()}`,
        rating: 4.5,
        ratingCount: 1,
        customizations: foodData.customizations || {
          sizes: [{ name: 'Regular', price: 0 }],
          extras: []
        }
      };
      list.unshift(newItem);
      localDb.set('food_items', list);
      return newItem;
    }
  },

  // Admin: Update food item
  async updateFoodItem(id, updates) {
    try {
      const response = await apiClient.put(`/foods/${id}`, updates);
      return response.data;
    } catch {
      const list = localDb.get('food_items');
      const idx = list.findIndex(f => f.id === id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...updates };
        localDb.set('food_items', list);
        return list[idx];
      }
      throw new Error('Food item not found');
    }
  },

  // Admin: Delete food item
  async deleteFoodItem(id) {
    try {
      await apiClient.delete(`/foods/${id}`);
      return { success: true };
    } catch {
      let list = localDb.get('food_items');
      list = list.filter(f => f.id !== id);
      localDb.set('food_items', list);
      return { success: true };
    }
  }
};
