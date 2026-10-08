import { apiClient, localDb } from './client';

export const cartApi = {
  // Validate and apply coupon code
  async applyCoupon(code, cartTotal) {
    try {
      const response = await apiClient.post('/coupons/validate', { code, cartTotal });
      return response.data;
    } catch {
      const coupons = localDb.get('coupons');
      const coupon = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
      
      if (!coupon) {
        throw new Error('Invalid coupon code. Try SAVE50 or FOODIE100');
      }
      
      if (cartTotal < coupon.minOrder) {
        throw new Error(`Minimum order of ₹${coupon.minOrder} required for ${coupon.code}`);
      }
      
      let discount = 0;
      if (coupon.discountType === 'percent') {
        discount = Math.min((cartTotal * coupon.discountPercent) / 100, coupon.maxDiscount);
      } else {
        discount = coupon.discountAmount;
      }
      
      return {
        success: true,
        coupon,
        discount: Math.round(discount),
        message: `Coupon ${coupon.code} applied successfully! You saved ₹${Math.round(discount)}`
      };
    }
  },

  // Get available coupons
  async getCoupons() {
    try {
      const response = await apiClient.get('/coupons');
      return response.data;
    } catch {
      return localDb.get('coupons');
    }
  },

  // Admin: create coupon
  async createCoupon(couponData) {
    try {
      const response = await apiClient.post('/coupons', couponData);
      return response.data;
    } catch {
      const coupons = localDb.get('coupons');
      coupons.push(couponData);
      localDb.set('coupons', coupons);
      return couponData;
    }
  }
};
