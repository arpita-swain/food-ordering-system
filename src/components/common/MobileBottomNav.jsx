import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, Package, User, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { formatCurrency } from '../../utils/formatters';

export const MobileBottomNav = () => {
  const { itemCount, grandTotal, restaurant } = useCart();
  const { totalFavoritesCount } = useFavorites();
  const location = useLocation();

  // Hide on checkout and admin/delivery portals to avoid clutter
  if (
    location.pathname.startsWith('/checkout') ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/delivery')
  ) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
      {/* Sticky Cart pill if cart has items and not on cart page */}
      {itemCount > 0 && location.pathname !== '/cart' && (
        <div className="px-4 pb-2 pointer-events-auto">
          <Link
            to="/cart"
            className="flex items-center justify-between p-3.5 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white rounded-2xl shadow-xl shadow-orange-500/30 animate-in slide-in-from-bottom-2"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-black text-xs">
                {itemCount}
              </div>
              <div>
                <div className="text-xs font-bold leading-tight line-clamp-1">
                  {restaurant?.name || 'Selected Restaurant'}
                </div>
                <div className="text-[11px] text-orange-100 font-semibold">
                  {formatCurrency(grandTotal)} • View Cart
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 font-bold text-xs bg-white text-orange-600 px-3 py-1.5 rounded-xl shadow-sm">
              <span>Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      )}

      {/* Bottom Nav Bar */}
      <nav className="pointer-events-auto bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
              isActive ? 'text-orange-600' : 'text-slate-500'
            }`
          }
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/search"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
              isActive ? 'text-orange-600' : 'text-slate-500'
            }`
          }
        >
          <Search className="w-5 h-5" />
          <span>Search</span>
        </NavLink>

        <NavLink
          to="/favorites"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors relative ${
              isActive ? 'text-orange-600' : 'text-slate-500'
            }`
          }
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {totalFavoritesCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-rose-500 text-white rounded-full text-[8px] font-bold w-3.5 h-3.5 flex items-center justify-center">
                {totalFavoritesCount}
              </span>
            )}
          </div>
          <span>Favorites</span>
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
              isActive ? 'text-orange-600' : 'text-slate-500'
            }`
          }
        >
          <Package className="w-5 h-5" />
          <span>Orders</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
              isActive ? 'text-orange-600' : 'text-slate-500'
            }`
          }
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </NavLink>
      </nav>
    </div>
  );
};
