import axios from 'axios';
import {
  INITIAL_RESTAURANTS,
  INITIAL_FOOD_ITEMS,
  INITIAL_CATEGORIES,
  INITIAL_COUPONS,
  INITIAL_ORDERS,
  INITIAL_ADDRESSES,
  INITIAL_USERS
} from '../data/initialData';

// API base URL from environment variable as required
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor to attach JWT token if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('foodiego_jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Local Mock Database with LocalStorage persistence to guarantee full zero-setup interactivity
class LocalDatabase {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem('foodiego_restaurants')) {
      localStorage.setItem('foodiego_restaurants', JSON.stringify(INITIAL_RESTAURANTS));
    }
    if (!localStorage.getItem('foodiego_food_items')) {
      localStorage.setItem('foodiego_food_items', JSON.stringify(INITIAL_FOOD_ITEMS));
    }
    if (!localStorage.getItem('foodiego_categories')) {
      localStorage.setItem('foodiego_categories', JSON.stringify(INITIAL_CATEGORIES));
    }
    if (!localStorage.getItem('foodiego_coupons')) {
      localStorage.setItem('foodiego_coupons', JSON.stringify(INITIAL_COUPONS));
    }
    if (!localStorage.getItem('foodiego_orders')) {
      localStorage.setItem('foodiego_orders', JSON.stringify(INITIAL_ORDERS));
    }
    if (!localStorage.getItem('foodiego_addresses')) {
      localStorage.setItem('foodiego_addresses', JSON.stringify(INITIAL_ADDRESSES));
    }
    if (!localStorage.getItem('foodiego_users')) {
      localStorage.setItem('foodiego_users', JSON.stringify(INITIAL_USERS));
    }
  }

  get(key) {
    try {
      const data = localStorage.getItem(`foodiego_${key}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  set(key, value) {
    localStorage.setItem(`foodiego_${key}`, JSON.stringify(value));
  }

  resetToDefaults() {
    localStorage.removeItem('foodiego_restaurants');
    localStorage.removeItem('foodiego_food_items');
    localStorage.removeItem('foodiego_categories');
    localStorage.removeItem('foodiego_coupons');
    localStorage.removeItem('foodiego_orders');
    localStorage.removeItem('foodiego_addresses');
    localStorage.removeItem('foodiego_users');
    this.init();
  }
}

export const localDb = new LocalDatabase();
