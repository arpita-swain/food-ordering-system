import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { Home } from '../pages/Home';
import { Search } from '../pages/Search';
import { RestaurantDetails } from '../pages/RestaurantDetails';
import { Cart } from '../pages/Cart';
import { Checkout } from '../pages/Checkout';
import { OrderConfirmation } from '../pages/OrderConfirmation';
import { OrderTracking } from '../pages/OrderTracking';
import { Orders } from '../pages/Orders';
import { Favorites } from '../pages/Favorites';
import { Profile } from '../pages/Profile';
import { Support } from '../pages/Support';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { DeliveryPortal } from '../pages/DeliveryPortal';
import { AdminDashboard } from '../pages/AdminDashboard';
import { NotFound } from '../pages/NotFound';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/restaurant/:id" element={<RestaurantDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-confirmed/:id" element={<OrderConfirmation />} />
      <Route path="/track/:id" element={<OrderTracking />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/support" element={<Support />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/delivery" element={<DeliveryPortal />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
