import { apiClient, localDb } from './client';

export const authApi = {
  // Login with email/phone & password
  async login({ email, password }) {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      if (response.data?.token) {
        localStorage.setItem('foodiego_jwt_token', response.data.token);
      }
      return response.data;
    } catch {
      // Graceful fallback to local simulated auth
      const users = localDb.get('users');
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase()) || {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email: email,
        phone: '+91 98765 43210',
        role: 'Customer',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        ordersCount: 1,
        status: 'Active'
      };
      const token = `jwt_mock_token_${Date.now()}`;
      localStorage.setItem('foodiego_jwt_token', token);
      localStorage.setItem('foodiego_current_user', JSON.stringify(user));
      return { success: true, token, user };
    }
  },

  // Register new user
  async register({ name, email, phone, password, role = 'Customer' }) {
    try {
      const response = await apiClient.post('/auth/register', { name, email, phone, password, role });
      return response.data;
    } catch {
      const users = localDb.get('users');
      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        phone: phone || '+91 99999 00000',
        role,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        ordersCount: 0,
        status: 'Active'
      };
      users.push(newUser);
      localDb.set('users', users);
      const token = `jwt_mock_token_${Date.now()}`;
      localStorage.setItem('foodiego_jwt_token', token);
      localStorage.setItem('foodiego_current_user', JSON.stringify(newUser));
      return { success: true, token, user: newUser };
    }
  },

  // Send & Verify OTP
  async sendOtp(phone) {
    try {
      return (await apiClient.post('/auth/otp/send', { phone })).data;
    } catch {
      return { success: true, message: 'OTP sent to ' + phone + ' (Code: 1234)' };
    }
  },

  async verifyOtp({ phone, otp }) {
    try {
      return (await apiClient.post('/auth/otp/verify', { phone, otp })).data;
    } catch {
      if (otp === '1234' || otp.length === 4) {
        return { success: true, message: 'Phone verified successfully' };
      }
      throw new Error('Invalid OTP. Use demo OTP 1234');
    }
  },

  // Get currently logged-in user
  async getCurrentUser() {
    try {
      const token = localStorage.getItem('foodiego_jwt_token');
      if (!token) return null;
      return (await apiClient.get('/auth/me')).data;
    } catch {
      const token = localStorage.getItem('foodiego_jwt_token');
      if (!token) return null;
      const saved = localStorage.getItem('foodiego_current_user');
      if (saved) return JSON.parse(saved);
      return null;
    }
  },

  logout() {
    localStorage.removeItem('foodiego_jwt_token');
    localStorage.removeItem('foodiego_current_user');
  }
};
