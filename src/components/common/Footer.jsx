import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Clock, Award, Phone, Mail, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-24 md:pb-12 border-t border-slate-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value props badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-slate-800 text-slate-300">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center border border-orange-500/20 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Lightning Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Average delivery in 28 mins</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Hygienic Food</h4>
              <p className="text-xs text-slate-400 mt-0.5">FSSAI certified partner kitchens</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Best Deals & Rewards</h4>
              <p className="text-xs text-slate-400 mt-0.5">Save with SAVE50 & FOODIE100</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 shrink-0">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Live GPS Tracking</h4>
              <p className="text-xs text-slate-400 mt-0.5">Watch rider on interactive map</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-400 flex items-center justify-center text-white text-lg font-bold">
                🍕
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Foodie<span className="text-orange-500">Go</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Discover the most delicious meals, biryanis, sourdough pizzas, and gourmet treats in Dantan and beyond. From local street gems to fine dining, delivered fast and warm.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-orange-500" />
                <span>support@foodiego.com</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-orange-500" />
                <span>+91 98765 43210</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Explore FoodieGo
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-white transition-colors">Top Restaurants</Link></li>
              <li><Link to="/search" className="hover:text-white transition-colors">Dish Discovery</Link></li>
              <li><Link to="/favorites" className="hover:text-white transition-colors">My Favorites</Link></li>
              <li><Link to="/orders" className="hover:text-white transition-colors">Order Tracking</Link></li>
              <li><Link to="/support" className="hover:text-white transition-colors">Customer Help</Link></li>
            </ul>
          </div>

          {/* Popular Cuisines */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Popular Cuisines
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/search?q=Biryani" className="hover:text-white transition-colors">Awadhi & Dum Biryani</Link></li>
              <li><Link to="/search?q=Pizza" className="hover:text-white transition-colors">Woodfired Pizzas</Link></li>
              <li><Link to="/search?q=Burgers" className="hover:text-white transition-colors">Smash Burgers</Link></li>
              <li><Link to="/search?q=Chinese" className="hover:text-white transition-colors">Chinese & Noodles</Link></li>
              <li><Link to="/search?q=Desserts" className="hover:text-white transition-colors">Pastries & Desserts</Link></li>
            </ul>
          </div>

          {/* Partner & Admin */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Portals & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/delivery" className="hover:text-emerald-400 font-semibold transition-colors">🛵 Delivery Partner UI</Link></li>
              <li><Link to="/admin" className="hover:text-purple-400 font-semibold transition-colors">⚡ Admin Dashboard</Link></li>
              <li><a href="#terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#fssai" className="hover:text-white transition-colors">FSSAI Compliance</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 FoodieGo Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for food lovers everywhere.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
