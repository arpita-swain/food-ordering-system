import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  MapPin,
  Search,
  ShoppingCart,
  Heart,
  User,
  ChevronDown,
  Menu,
  X,
  Compass,
  Package,
  HelpCircle,
  LogOut,
  Sparkles,
  Download
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useLocation as useDeliveryLocation } from '../../context/LocationContext';
import { useFavorites } from '../../context/FavoritesContext';
import { formatCurrency } from '../../utils/formatters';

export const Header = () => {
  const { user, logout } = useAuth();
  const { itemCount, grandTotal } = useCart();
  const { currentLocation, openLocationModal } = useDeliveryLocation();
  const { totalFavoritesCount } = useFavorites();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(quickSearch.trim())}`);
      setQuickSearch('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-2.5'
          : 'bg-white border-b border-slate-100 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Left: Mobile hamburger + Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-700"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* FoodieGo Brand Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform duration-300">
                <span className="text-xl">🍕</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors">
                  Foodie<span className="text-orange-500">Go</span>
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 -mt-1 hidden sm:block">
                  Feast On Demand
                </span>
              </div>
            </Link>

            {/* Desktop Location Selector */}
            <button
              onClick={openLocationModal}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-orange-50/70 border border-slate-200/80 text-left transition-all group ml-2"
            >
              <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="max-w-[170px] truncate">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <span>Deliver to:</span>
                  <span className="text-orange-600 font-extrabold">{currentLocation?.label || 'Home'}</span>
                </div>
                <div className="text-xs font-semibold text-slate-700 truncate">
                  {currentLocation?.address || 'Dantan, West Bengal'}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-600 transition-colors ml-1" />
            </button>
          </div>

          {/* Center: Global Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden sm:flex flex-1 max-w-md mx-2 relative"
          >
            <input
              type="text"
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              placeholder="Search for restaurants, dishes or cuisines..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 hover:bg-slate-100/80 focus:bg-white rounded-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 border border-transparent focus:border-orange-300 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>

          {/* Right: Actions (Wishlist, Cart, User) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Button */}
            <Link
              to="/search"
              className="sm:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Search food"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Favorites / Wishlist */}
            <Link
              to="/favorites"
              className="relative p-2 rounded-xl text-slate-600 hover:text-rose-500 hover:bg-rose-50 transition-colors hidden sm:block"
              title="Favorites"
            >
              <Heart className="w-5 h-5" />
              {totalFavoritesCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow">
                  {totalFavoritesCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <Link
              to="/cart"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 ${
                itemCount > 0
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600 active:scale-95'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline">Cart</span>
              {itemCount > 0 && (
                <span className="border-l border-white/30 pl-2 font-black">
                  {formatCurrency(grandTotal)}
                </span>
              )}
            </Link>

            {/* User Profile / Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-2xl hover:bg-slate-100 transition-colors"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
                </button>

                {profileDropdownOpen && (
                  <div
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 text-slate-700 text-sm animate-in fade-in slide-in-from-top-2"
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <div className="font-bold text-slate-900">{user.name}</div>
                      <div className="text-xs text-slate-400 truncate">{user.email}</div>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 font-medium"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 font-medium"
                    >
                      <Package className="w-4 h-4 text-slate-400" />
                      <span>My Orders</span>
                    </Link>
                    <Link
                      to="/favorites"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 font-medium"
                    >
                      <Heart className="w-4 h-4 text-slate-400" />
                      <span>Favorites ({totalFavoritesCount})</span>
                    </Link>
                    <Link
                      to="/support"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 font-medium"
                    >
                      <HelpCircle className="w-4 h-4 text-slate-400" />
                      <span>Help & Support</span>
                    </Link>
                    <a
                      href="/foodiego-backend.zip"
                      download="foodiego-backend.zip"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 hover:bg-amber-50 text-amber-600 font-semibold"
                    >
                      <Download className="w-4 h-4 text-amber-500" />
                      <span>Download Backend (.ZIP)</span>
                    </a>
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-rose-600 hover:bg-rose-50 font-semibold"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-slate-700 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-slate-900 hover:bg-orange-500 text-white shadow-sm transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Location Header Sub-row */}
        <div className="md:hidden mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            onClick={openLocationModal}
            className="flex items-center gap-1.5 text-slate-700 truncate max-w-[85%]"
          >
            <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span className="font-bold text-orange-600">{currentLocation?.label || 'Home'}:</span>
            <span className="truncate text-slate-600">{currentLocation?.address || 'Dantan, West Bengal'}</span>
          </button>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              placeholder="Search dishes or restaurants..."
              className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-xl text-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 py-2 text-slate-700 font-semibold"
          >
            <Compass className="w-4 h-4 text-orange-500" />
            <span>Discover Food</span>
          </Link>
          <Link
            to="/orders"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 py-2 text-slate-700 font-semibold"
          >
            <Package className="w-4 h-4 text-orange-500" />
            <span>My Orders</span>
          </Link>
          <Link
            to="/favorites"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 py-2 text-slate-700 font-semibold"
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Saved Favorites ({totalFavoritesCount})</span>
          </Link>
          <Link
            to="/support"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 py-2 text-slate-700 font-semibold"
          >
            <HelpCircle className="w-4 h-4 text-orange-500" />
            <span>Help & Support</span>
          </Link>
          <Link
            to="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 py-2 text-slate-700 font-semibold"
          >
            <User className="w-4 h-4 text-orange-500" />
            <span>Profile & Addresses</span>
          </Link>
          <a
            href="/foodiego-backend.zip"
            download="foodiego-backend.zip"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 py-2 text-amber-600 font-bold border-t border-slate-100 pt-3"
          >
            <Download className="w-4 h-4 text-amber-500" />
            <span>Download Backend (.ZIP)</span>
          </a>
        </div>
      )}
    </header>
  );
};
