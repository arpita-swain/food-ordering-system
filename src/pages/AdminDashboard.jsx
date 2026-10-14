import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  Store,
  Package,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  Search,
  Tag
} from 'lucide-react';
import { restaurantApi } from '../api/restaurantApi';
import { foodApi } from '../api/foodApi';
import { orderApi } from '../api/orderApi';
import { cartApi } from '../api/cartApi';
import { userApi } from '../api/userApi';
import { formatCurrency } from '../utils/formatters';
import { useToast } from '../context/ToastContext';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'restaurants' | 'foods' | 'orders' | 'coupons' | 'users'
  const [restaurants, setRestaurants] = useState([]);
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal forms states
  const [isAddRestOpen, setIsAddRestOpen] = useState(false);
  const [newRestForm, setNewRestForm] = useState({
    name: '',
    cuisines: 'Biryani, Indian',
    priceForTwo: 300,
    deliveryTime: '25-30 min',
    distance: '2.5 km',
    pureVeg: false,
    address: 'Dantan Central'
  });

  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
  const [newFoodForm, setNewFoodForm] = useState({
    name: '',
    restaurantId: 'rest-1',
    category: 'Biryani',
    price: 249,
    description: 'Freshly prepared specialty dish with premium spices.',
    isVeg: false,
    isBestseller: true
  });

  const { addToast } = useToast();

  const loadAllAdminData = async () => {
    try {
      const [r, f, o, c, u] = await Promise.all([
        restaurantApi.getRestaurants(),
        foodApi.getFoodItems(),
        orderApi.getOrders(),
        cartApi.getCoupons(),
        userApi.getUsers()
      ]);
      setRestaurants(r);
      setFoods(f);
      setOrders(o);
      setCoupons(c);
      setUsers(u);
    } catch (err) {
      console.error('Admin data fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    try {
      await restaurantApi.createRestaurant({
        name: newRestForm.name,
        cuisines: newRestForm.cuisines.split(',').map((c) => c.trim()),
        priceForTwo: Number(newRestForm.priceForTwo),
        deliveryTime: newRestForm.deliveryTime,
        distance: newRestForm.distance,
        pureVeg: newRestForm.pureVeg,
        address: newRestForm.address,
        coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'
      });
      addToast('Restaurant added successfully!');
      setIsAddRestOpen(false);
      loadAllAdminData();
    } catch {
      addToast('Failed to add restaurant', 'error');
    }
  };

  const handleDeleteRestaurant = async (id) => {
    if (confirm('Delete this restaurant?')) {
      await restaurantApi.deleteRestaurant(id);
      addToast('Restaurant removed');
      loadAllAdminData();
    }
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    try {
      await foodApi.createFoodItem({
        name: newFoodForm.name,
        restaurantId: newFoodForm.restaurantId,
        category: newFoodForm.category,
        price: Number(newFoodForm.price),
        description: newFoodForm.description,
        isVeg: newFoodForm.isVeg,
        isBestseller: newFoodForm.isBestseller,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500'
      });
      addToast('Food dish added to menu!');
      setIsAddFoodOpen(false);
      loadAllAdminData();
    } catch {
      addToast('Failed to add food dish', 'error');
    }
  };

  const handleDeleteFood = async (id) => {
    if (confirm('Delete this dish?')) {
      await foodApi.deleteFoodItem(id);
      addToast('Dish removed');
      loadAllAdminData();
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await orderApi.updateOrderStatus(orderId, newStatus);
      addToast(`Order #${orderId} marked as ${newStatus}`);
      loadAllAdminData();
    } catch {
      addToast('Status update failed', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800">
              Admin Supervisor Console
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            FoodieGo Business & Platform Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Control restaurants, menus, order fulfillment, coupons and analytical revenue
          </p>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 mb-8">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>Total Orders</span>
            <Package className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">12,450</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1">↑ +14.2% this week</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">₹8.4L</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1">Gross Merchandise Value</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>Customers</span>
            <Users className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">6,240</div>
          <div className="text-[10px] text-slate-400 mt-1">Active Foodies</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>Restaurants</span>
            <Store className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">128</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1">98% Active in Dantan</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm col-span-2 lg:col-span-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>Pending Orders</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-orange-600">84</div>
          <div className="text-[10px] text-orange-700 font-semibold mt-1">Action required</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-8 border-b border-slate-200 pb-3">
        {[
          { id: 'overview', label: '📊 Analytics & Growth' },
          { id: 'restaurants', label: `🏪 Restaurants (${restaurants.length})` },
          { id: 'foods', label: `🍱 Food Menu (${foods.length})` },
          { id: 'orders', label: `📦 Orders (${orders.length})` },
          { id: 'coupons', label: `🎟️ Offers & Coupons (${coupons.length})` },
          { id: 'users', label: `👥 Users (${users.length})` }
        ].map((tab, idx) => (
          <button
            key={`admin-tab-${tab.id}-${idx}`}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full font-bold text-xs sm:text-sm shrink-0 transition-all ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Overview & Analytics */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visual Orders Bar Chart */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Daily Order Volume (This Week)</h3>
              <div className="h-48 flex items-end gap-3 pt-4 px-2">
                {[
                  { day: 'Mon', count: 180, pct: '50%' },
                  { day: 'Tue', count: 210, pct: '60%' },
                  { day: 'Wed', count: 260, pct: '75%' },
                  { day: 'Thu', count: 240, pct: '70%' },
                  { day: 'Fri', count: 320, pct: '90%' },
                  { day: 'Sat', count: 380, pct: '100%' },
                  { day: 'Sun', count: 350, pct: '95%' }
                ].map((bar, idx) => (
                  <div key={`admin-bar-${bar.day}-${idx}`} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[10px] font-bold text-slate-500">{bar.count}</span>
                    <div
                      style={{ height: bar.pct }}
                      className="w-full bg-gradient-to-t from-orange-600 to-amber-400 rounded-t-xl transition-all"
                    />
                    <span className="text-[11px] font-semibold text-slate-600">{bar.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Foods Breakdown */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Top Ordered Food Categories</h3>
              <div className="space-y-3 pt-2">
                {[
                  { name: 'Biryani (Awadhi & Handi)', share: '38%', count: '4,730 orders', color: 'bg-orange-500' },
                  { name: 'Gourmet Smash Burgers', share: '24%', count: '2,980 orders', color: 'bg-amber-500' },
                  { name: 'Woodfired Pizzas', share: '18%', count: '2,240 orders', color: 'bg-rose-500' },
                  { name: 'Pure Veg & South Indian', share: '14%', count: '1,740 orders', color: 'bg-emerald-500' },
                  { name: 'Desserts & Pastries', share: '6%', count: '760 orders', color: 'bg-purple-500' }
                ].map((cat, idx) => (
                  <div key={`admin-cat-${cat.name}-${idx}`} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-800">{cat.name}</span>
                      <span className="text-slate-500">{cat.share} ({cat.count})</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${cat.color} rounded-full`} style={{ width: cat.share }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Restaurants Management */}
      {activeTab === 'restaurants' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-900">Partner Restaurants</h3>
            <button
              onClick={() => setIsAddRestOpen(true)}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Restaurant</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {restaurants.map((r, idx) => (
              <div key={`admin-rest-${r.id || idx}-${idx}`} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={r.coverImage}
                    alt={r.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">{r.name}</h4>
                    <p className="text-xs text-slate-500">{r.cuisines?.join(', ')}</p>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {r.address} • ⭐ {r.rating} ({r.ratingCount})
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteRestaurant(r.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Delete restaurant"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Food Menu Management */}
      {activeTab === 'foods' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-900">Dishes & Menu Catalog</h3>
            <button
              onClick={() => setIsAddFoodOpen(true)}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Dish</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {foods.map((f, idx) => (
              <div key={`admin-food-${f.id || idx}-${idx}`} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={f.image}
                    alt={f.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{f.name}</h4>
                      {f.isBestseller && (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                          Bestseller
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500">
                      Category: {f.category} • Price: {formatCurrency(f.price)}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteFood(f.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Delete dish"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Orders Management */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Live Customer Orders</h3>
            <span className="text-xs text-slate-400">Real-time status synchronizer</span>
          </div>

          <div className="divide-y divide-slate-100">
            {orders.map((o, idx) => (
              <div key={`admin-order-${o.id || idx}-${idx}`} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                      #{o.id}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{o.restaurantName}</span>
                    <span className="text-xs text-slate-400">
                      • {o.deliveryAddress?.name}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Items: {o.items?.map((it) => `${it.quantity}x ${it.name}`).join(', ')}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Amount: <span className="font-bold text-slate-800">{formatCurrency(o.pricing?.grandTotal)}</span> • Paid via {o.payment?.method}
                  </div>
                </div>

                {/* Status Switcher Select */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Status:</span>
                  <select
                    value={o.status}
                    onChange={(e) => handleOrderStatusChange(o.id, e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Placed">Placed</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Coupons & Offers */}
      {activeTab === 'coupons' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-900">Active Coupons</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {coupons.map((c, idx) => (
              <div key={`admin-coupon-${c.code || idx}-${idx}`} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-extrabold bg-orange-100 text-orange-800 px-2.5 py-1 rounded-md">
                    {c.code}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">{c.description}</p>
                <div className="text-[11px] text-slate-400">
                  Min Order: ₹{c.minOrder} • Max Discount: ₹{c.maxDiscount}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: Users & Roles */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {users.map((u, idx) => (
            <div key={`admin-user-${u.id || idx}-${idx}`} className="p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={u.avatar}
                  alt={u.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{u.name}</h4>
                  <p className="text-xs text-slate-400">{u.email} • {u.phone}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-bold">
                {u.role}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Add Restaurant Modal */}
      {isAddRestOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add New Partner Restaurant</h3>
            <form onSubmit={handleAddRestaurant} className="space-y-3">
              <div>
                <label className="text-xs font-semibold block mb-1">Restaurant Name</label>
                <input
                  type="text"
                  required
                  value={newRestForm.name}
                  onChange={(e) => setNewRestForm({ ...newRestForm, name: e.target.value })}
                  placeholder="E.g. Royal Bengal Sweets"
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Cuisines (comma separated)</label>
                <input
                  type="text"
                  value={newRestForm.cuisines}
                  onChange={(e) => setNewRestForm({ ...newRestForm, cuisines: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold block mb-1">Price for Two (₹)</label>
                  <input
                    type="number"
                    value={newRestForm.priceForTwo}
                    onChange={(e) => setNewRestForm({ ...newRestForm, priceForTwo: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Delivery Time</label>
                  <input
                    type="text"
                    value={newRestForm.deliveryTime}
                    onChange={(e) => setNewRestForm({ ...newRestForm, deliveryTime: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Address</label>
                <input
                  type="text"
                  value={newRestForm.address}
                  onChange={(e) => setNewRestForm({ ...newRestForm, address: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddRestOpen(false)}
                  className="flex-1 py-2.5 border rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-500 text-white rounded-xl text-xs font-bold"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Food Modal */}
      {isAddFoodOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add New Dish</h3>
            <form onSubmit={handleAddFood} className="space-y-3">
              <div>
                <label className="text-xs font-semibold block mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  value={newFoodForm.name}
                  onChange={(e) => setNewFoodForm({ ...newFoodForm, name: e.target.value })}
                  placeholder="E.g. Shahi Mutton Korma"
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold block mb-1">Category</label>
                  <input
                    type="text"
                    value={newFoodForm.category}
                    onChange={(e) => setNewFoodForm({ ...newFoodForm, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={newFoodForm.price}
                    onChange={(e) => setNewFoodForm({ ...newFoodForm, price: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newFoodForm.isVeg}
                    onChange={(e) => setNewFoodForm({ ...newFoodForm, isVeg: e.target.checked })}
                  />
                  <span>Pure Veg</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newFoodForm.isBestseller}
                    onChange={(e) => setNewFoodForm({ ...newFoodForm, isBestseller: e.target.checked })}
                  />
                  <span>Mark Bestseller</span>
                </label>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddFoodOpen(false)}
                  className="flex-1 py-2.5 border rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-500 text-white rounded-xl text-xs font-bold"
                >
                  Add Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
