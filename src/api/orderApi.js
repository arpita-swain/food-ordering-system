import { apiClient, localDb } from './client';

export const orderApi = {
  // Create / Place a new food order
  async createOrder(orderPayload) {
    try {
      const response = await apiClient.post('/orders', orderPayload);
      return response.data;
    } catch {
      const orders = localDb.get('orders');
      const orderId = `FG${Math.floor(10000 + Math.random() * 90000)}`;
      
      const newOrder = {
        ...orderPayload,
        id: orderId,
        date: new Date().toISOString(),
        status: 'Placed',
        estimatedDeliveryTime: '25-30 minutes',
        deliveryPartner: {
          name: 'Rajesh Kumar',
          phone: '+91 98111 22334',
          rating: 4.9,
          vehicle: 'Hero Splendor (WB-34-AB-1290)'
        },
        trackingSteps: [
          { label: 'Order Placed', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), done: true },
          { label: 'Restaurant Confirmed', time: 'In 2 mins', done: false },
          { label: 'Food Being Prepared', time: 'In 10 mins', done: false },
          { label: 'Out for Delivery', time: 'In 18 mins', done: false },
          { label: 'Delivered', time: 'In 28 mins', done: false }
        ]
      };
      
      orders.unshift(newOrder);
      localDb.set('orders', orders);
      return newOrder;
    }
  },

  // Get orders list
  async getOrders() {
    try {
      const response = await apiClient.get('/orders');
      return response.data;
    } catch {
      return localDb.get('orders');
    }
  },

  // Get filtered past order history
  async getOrderHistory(filters = {}) {
    try {
      const response = await apiClient.get('/orders/history', { params: filters });
      return response.data;
    } catch {
      let orders = localDb.get('orders');
      if (filters.status && filters.status.toLowerCase() !== 'all') {
        orders = orders.filter(o => o.status?.toLowerCase() === filters.status.toLowerCase());
      }
      return orders;
    }
  },

  // Get order by ID
  async getOrderById(id) {
    try {
      const response = await apiClient.get(`/orders/${id}`);
      return response.data;
    } catch {
      const orders = localDb.get('orders');
      return orders.find(o => o.id === id) || null;
    }
  },

  // Update order status (used by delivery partner and admin)
  async updateOrderStatus(id, newStatus) {
    try {
      const response = await apiClient.patch(`/orders/${id}/status`, { status: newStatus });
      return response.data;
    } catch {
      const orders = localDb.get('orders');
      const order = orders.find(o => o.id === id);
      if (order) {
        order.status = newStatus;
        
        // Update tracking steps according to status
        const statusMap = {
          'Placed': 0,
          'Confirmed': 1,
          'Preparing': 2,
          'Out for Delivery': 3,
          'Delivered': 4
        };
        
        const currentIdx = statusMap[newStatus] ?? 0;
        order.trackingSteps = order.trackingSteps.map((step, idx) => ({
          ...step,
          done: idx <= currentIdx,
          time: idx <= currentIdx && !step.time.includes('M') ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : step.time
        }));
        
        localDb.set('orders', orders);
        return order;
      }
      throw new Error('Order not found');
    }
  },

  // Rate an order
  async rateOrder(id, { restaurantRating, foodRating, review, tags = [] }) {
    try {
      const response = await apiClient.post(`/orders/${id}/rating`, {
        restaurantRating,
        foodRating,
        review,
        tags
      });
      return response.data;
    } catch {
      const orders = localDb.get('orders');
      const order = orders.find(o => o.id === id);
      if (order) {
        order.rating = {
          restaurant: restaurantRating,
          food: foodRating,
          review,
          tags,
          ratedAt: new Date().toISOString()
        };
        localDb.set('orders', orders);
        return { success: true, message: 'Review submitted successfully!' };
      }
      throw new Error('Order not found');
    }
  }
};
