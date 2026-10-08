import { apiClient, localDb } from './client';

export const userApi = {
  // Get all users (Admin view)
  async getUsers() {
    try {
      const response = await apiClient.get('/users');
      return response.data;
    } catch {
      return localDb.get('users');
    }
  },

  // Update user profile or role/status
  async updateUser(id, updates) {
    try {
      const response = await apiClient.put(`/users/${id}`, updates);
      return response.data;
    } catch {
      const users = localDb.get('users');
      const idx = users.findIndex(u => u.id === id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...updates };
        localDb.set('users', users);
        
        // Also update current user if matching
        const currentUser = JSON.parse(localStorage.getItem('foodiego_current_user') || '{}');
        if (currentUser.id === id) {
          localStorage.setItem('foodiego_current_user', JSON.stringify(users[idx]));
        }
        
        return users[idx];
      }
      throw new Error('User not found');
    }
  },

  // Get addresses
  async getAddresses() {
    try {
      const response = await apiClient.get('/users/addresses');
      return response.data;
    } catch {
      return localDb.get('addresses');
    }
  },

  // Add new address
  async addAddress(addressData) {
    try {
      const response = await apiClient.post('/users/addresses', addressData);
      return response.data;
    } catch {
      const addresses = localDb.get('addresses');
      const newAddr = {
        ...addressData,
        id: `addr-${Date.now()}`,
        isDefault: addresses.length === 0 || addressData.isDefault
      };
      
      if (newAddr.isDefault) {
        addresses.forEach(a => a.isDefault = false);
      }
      
      addresses.unshift(newAddr);
      localDb.set('addresses', addresses);
      return newAddr;
    }
  },

  // Delete address
  async deleteAddress(id) {
    try {
      await apiClient.delete(`/users/addresses/${id}`);
      return { success: true };
    } catch {
      let addresses = localDb.get('addresses');
      addresses = addresses.filter(a => a.id !== id);
      localDb.set('addresses', addresses);
      return { success: true };
    }
  },

  // Set default address
  async setDefaultAddress(id) {
    try {
      const response = await apiClient.patch(`/users/addresses/${id}/default`);
      return response.data;
    } catch {
      const addresses = localDb.get('addresses');
      addresses.forEach(a => {
        a.isDefault = a.id === id;
      });
      localDb.set('addresses', addresses);
      return addresses;
    }
  }
};
