import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartApi } from '../api/cartApi';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('foodiego_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [restaurant, setRestaurant] = useState(() => {
    try {
      const saved = localStorage.getItem('foodiego_cart_restaurant');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [deliveryTip, setDeliveryTip] = useState(0);
  const [deliveryOption, setDeliveryOption] = useState('standard'); // 'standard' | 'priority'
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  // Restaurant change conflict warning modal state
  const [conflictModal, setConflictModal] = useState({
    isOpen: false,
    pendingFood: null,
    pendingOptions: null,
    pendingRestaurant: null
  });

  const { addToast } = useToast();

  useEffect(() => {
    localStorage.setItem('foodiego_cart_items', JSON.stringify(items));
    if (items.length === 0) {
      setRestaurant(null);
      localStorage.removeItem('foodiego_cart_restaurant');
      setAppliedCoupon(null);
    } else if (restaurant) {
      localStorage.setItem('foodiego_cart_restaurant', JSON.stringify(restaurant));
    }
  }, [items, restaurant]);

  // Check if adding item is from a different restaurant
  const addItem = (food, customOptions = {}, targetRestaurant) => {
    // If cart has items from another restaurant, show warning modal
    if (items.length > 0 && restaurant && restaurant.id !== targetRestaurant.id) {
      setConflictModal({
        isOpen: true,
        pendingFood: food,
        pendingOptions: customOptions,
        pendingRestaurant: targetRestaurant
      });
      return;
    }

    executeAddItem(food, customOptions, targetRestaurant);
  };

  const executeAddItem = (food, customOptions = {}, targetRestaurant) => {
    const sizeName = customOptions.size?.name || 'Regular';
    const sizeExtra = customOptions.size?.price || 0;
    const extras = customOptions.extras || [];
    const extrasCost = extras.reduce((sum, e) => sum + (e.price || 0), 0);
    const unitPrice = food.price + sizeExtra + extrasCost;

    const extrasKey = extras.map(e => e.name).sort().join('|');
    const existingIndex = items.findIndex(
      (item) => item.foodId === food.id && item.size === sizeName && item.extrasKey === extrasKey
    );

    let updatedItems = [...items];
    if (existingIndex > -1) {
      updatedItems[existingIndex].quantity += (customOptions.quantity || 1);
    } else {
      updatedItems.push({
        id: `cart-item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        foodId: food.id,
        restaurantId: targetRestaurant.id,
        restaurantName: targetRestaurant.name,
        name: food.name,
        isVeg: food.isVeg,
        basePrice: food.price,
        price: unitPrice,
        size: sizeName,
        extras: extras.map(e => e.name),
        extrasKey,
        quantity: customOptions.quantity || 1,
        image: food.image
      });
    }

    setRestaurant(targetRestaurant);
    setItems(updatedItems);
    addToast(`Added "${food.name}" to cart! 🛒`);
  };

  const confirmRestaurantSwitch = () => {
    if (conflictModal.pendingFood && conflictModal.pendingRestaurant) {
      setItems([]);
      setRestaurant(conflictModal.pendingRestaurant);
      executeAddItem(
        conflictModal.pendingFood,
        conflictModal.pendingOptions,
        conflictModal.pendingRestaurant
      );
      setConflictModal({ isOpen: false, pendingFood: null, pendingOptions: null, pendingRestaurant: null });
      addToast('Cart updated with new restaurant items');
    }
  };

  const cancelRestaurantSwitch = () => {
    setConflictModal({ isOpen: false, pendingFood: null, pendingOptions: null, pendingRestaurant: null });
  };

  const updateQuantity = (index, newQty) => {
    if (newQty <= 0) {
      removeItem(index);
      return;
    }
    const updated = [...items];
    updated[index].quantity = newQty;
    setItems(updated);
  };

  const removeItem = (index) => {
    const itemToRemove = items[index];
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    if (itemToRemove) {
      addToast(`Removed ${itemToRemove.name} from cart`, 'info');
    }
  };

  const clearCart = () => {
    setItems([]);
    setRestaurant(null);
    setAppliedCoupon(null);
    setDeliveryTip(0);
    setSpecialInstructions('');
  };

  // Calculations
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Delivery fee logic: standard is ₹30, free on orders ₹350+. Priority adds ₹20.
  const baseDeliveryFee = subtotal >= 350 ? 0 : 30;
  const deliveryFee = deliveryOption === 'priority' ? baseDeliveryFee + 20 : baseDeliveryFee;
  
  const platformFee = items.length > 0 ? 5 : 0;
  const taxes = Math.round(subtotal * 0.05); // 5% GST

  // Re-calculate coupon discount if subtotal changes
  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percent') {
      couponDiscount = Math.min((subtotal * appliedCoupon.discountPercent) / 100, appliedCoupon.maxDiscount);
    } else {
      couponDiscount = appliedCoupon.discountAmount;
    }
    couponDiscount = Math.round(couponDiscount);
  }

  const grandTotal = Math.max(0, subtotal + deliveryFee + platformFee + taxes + deliveryTip - couponDiscount);

  const applyCouponCode = async (code) => {
    try {
      const res = await cartApi.applyCoupon(code, subtotal);
      setAppliedCoupon(res.coupon);
      addToast(res.message);
      return res;
    } catch (err) {
      addToast(err.message || 'Failed to apply coupon', 'error');
      throw err;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon removed', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        restaurant,
        itemCount,
        subtotal,
        deliveryFee,
        platformFee,
        taxes,
        deliveryTip,
        deliveryOption,
        setDeliveryOption,
        setDeliveryTip,
        specialInstructions,
        setSpecialInstructions,
        couponDiscount,
        appliedCoupon,
        grandTotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyCouponCode,
        removeCoupon,
        conflictModal,
        confirmRestaurantSwitch,
        cancelRestaurantSwitch
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
