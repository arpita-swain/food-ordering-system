import React, { useState, useEffect } from 'react';
import {
  Bike,
  Package,
  CheckCircle,
  Clock,
  Phone,
  MapPin,
  TrendingUp,
  DollarSign,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  RotateCw
} from 'lucide-react';
import { orderApi } from '../api/orderApi';
import { formatCurrency } from '../utils/formatters';
import { LiveTrackingMap } from '../components/map/LiveTrackingMap';
import { useToast } from '../context/ToastContext';

export const DeliveryPortal = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'requests' | 'history'
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const partnerStats = {
    todayOrders: 12,
    completed: 8,
    pending: 4,
    todayEarnings: 1250,
    rating: 4.9,
    name: 'Rajesh Kumar',
    vehicle: 'Hero Splendor (WB-34-AB-1290)'
  };

  const fetchOrders = async () => {
    try {
      const data = await orderApi.getOrders();
      setOrders(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderApi.updateOrderStatus(orderId, newStatus);
      addToast(`Delivery status updated to: ${newStatus} 🛵`);
      fetchOrders();
    } catch {
      addToast('Failed to update status', 'error');
    }
  };

  const activeDeliveries = orders.filter((o) => o.status !== 'Delivered');
  const completedDeliveries = orders.filter((o) => o.status === 'Delivered');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Partner Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150"
            alt="Delivery Partner"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">{partnerStats.name}</h1>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                Online & On Duty
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Vehicle: {partnerStats.vehicle} • Rating: ⭐ {partnerStats.rating} (Super Rider)
            </p>
          </div>
        </div>

        {/* Quick Shift Toggle */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => addToast('Shift status: ACTIVE and receiving high-priority orders')}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>Accepting Trips</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Today's Orders</span>
            <Package className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">{partnerStats.todayOrders}</div>
          <div className="text-[11px] text-slate-400 mt-1">Target: 15 orders for bonus</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Completed</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">{partnerStats.completed}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">100% on-time delivery</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Pending Trips</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">{activeDeliveries.length}</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">Active in pipeline</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Today's Earnings</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {formatCurrency(partnerStats.todayEarnings)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Includes ₹180 in tips</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'active'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bike className="w-4 h-4" />
          <span>Active Deliveries ({activeDeliveries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'history'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          <span>Completed Trips ({completedDeliveries.length})</span>
        </button>
      </div>

      {/* Tab: Active Deliveries */}
      {activeTab === 'active' && (
        <div className="space-y-6">
          {activeDeliveries.length > 0 ? (
            activeDeliveries.map((order, idx) => (
              <div
                key={`deliv-active-${order.id || idx}-${idx}`}
                className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 space-y-6"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full">
                        #{order.id}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">
                        Pickup from: {order.restaurantName}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Order Value: {formatCurrency(order.pricing?.grandTotal)} ({order.payment?.method})
                    </p>
                  </div>

                  {/* Call Customer */}
                  <div className="flex items-center gap-2">
                    <a
                      href="tel:+919876543210"
                      className="px-3.5 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Customer</span>
                    </a>
                  </div>
                </div>

                {/* Pickup & Drop Points */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-orange-600 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Pickup Point (Restaurant)</span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 mt-1">{order.restaurantName}</div>
                    <p className="text-xs text-slate-500 mt-0.5">{order.restaurantAddress || 'Dantan Central'}</p>
                  </div>

                  <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Drop-off Destination (Customer)</span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 mt-1">
                      {order.deliveryAddress?.name || 'Customer'}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {order.deliveryAddress?.addressLine || 'Home Delivery'}
                    </p>
                  </div>
                </div>

                {/* GPS Map View */}
                <div className="h-64 rounded-2xl overflow-hidden border border-slate-200">
                  <LiveTrackingMap
                    restaurantLocation={{ lat: 21.9542, lng: 87.2721, name: order.restaurantName }}
                    customerLocation={{ lat: 21.9640, lng: 87.2790, name: 'Customer Destination' }}
                    riderLocation={{ lat: 21.9580, lng: 87.2750, name: 'Your Location' }}
                    status={order.status}
                  />
                </div>

                {/* Status Update Action Buttons */}
                <div className="pt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-500 mr-2">Update Stage:</span>
                  {['Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'].map((st, sIdx) => (
                    <button
                      key={`deliv-stage-${st}-${sIdx}`}
                      onClick={() => handleUpdateStatus(order.id, st)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        order.status === st
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8">
              <div className="text-4xl mb-2">🛵</div>
              <h3 className="text-base font-bold text-slate-800">No active deliveries</h3>
              <p className="text-xs text-slate-500 mt-1">
                You are currently idle. New requests will ping your phone automatically.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab: Completed History */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {completedDeliveries.map((c, idx) => (
            <div key={`deliv-hist-${c.id || idx}-${idx}`} className="p-4 sm:p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    #{c.id}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{c.restaurantName}</h4>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Delivered to {c.deliveryAddress?.addressLine?.slice(0, 30)}...
                </p>
              </div>

              <div className="text-right">
                <div className="text-sm font-black text-emerald-600">+₹45 fee earned</div>
                <div className="text-[11px] text-slate-400">Paid out to wallet</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
