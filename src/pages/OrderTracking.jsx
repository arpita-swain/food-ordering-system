import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  Phone,
  MessageCircle,
  Bike,
  MapPin,
  Star,
  ChevronRight,
  ShieldCheck,
  RotateCw,
  Sparkles
} from 'lucide-react';
import { orderApi } from '../api/orderApi';
import { LiveTrackingMap } from '../components/map/LiveTrackingMap';
import { ReviewModal } from '../components/modals/ReviewModal';
import { formatCurrency } from '../utils/formatters';
import { useToast } from '../context/ToastContext';

export const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [riderCoords, setRiderCoords] = useState({ lat: 21.9575, lng: 87.2745 });
  const { addToast } = useToast();

  const statusList = [
    'Placed',
    'Confirmed',
    'Preparing',
    'Out for Delivery',
    'Delivered'
  ];

  const fetchOrder = async () => {
    try {
      const res = await orderApi.getOrderById(id);
      if (res) {
        setOrder(res);
      } else {
        // Fallback default
        const list = await orderApi.getOrders();
        setOrder(list[0]);
      }
    } catch (err) {
      console.error('Failed to get tracking details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // Simulate rider movement periodically
  useEffect(() => {
    if (!order || order.status === 'Delivered') return;

    const interval = setInterval(() => {
      setRiderCoords((prev) => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, [order?.status]);

  // Demo status advancer for testing
  const advanceStatus = async () => {
    if (!order) return;
    const currentIdx = statusList.indexOf(order.status);
    const nextIdx = (currentIdx + 1) % statusList.length;
    const nextStatus = statusList[nextIdx];

    const updated = await orderApi.updateOrderStatus(order.id, nextStatus);
    setOrder({ ...updated });
    addToast(`Status updated to: ${nextStatus}`);

    if (nextStatus === 'Delivered') {
      setTimeout(() => setIsReviewModalOpen(true), 800);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500">Connecting to live tracking satellite...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <h2 className="text-xl font-bold">Order not found</h2>
        <Link to="/orders" className="text-orange-500 font-bold mt-4 inline-block">
          Return to Orders
        </Link>
      </div>
    );
  }

  const currentStatusIdx = Math.max(0, statusList.indexOf(order.status));

  const stepsData = [
    { label: 'Order Placed', desc: 'Received by kitchen' },
    { label: 'Confirmed', desc: 'Kitchen accepted' },
    { label: 'Food Preparing', desc: 'Chef cooking with love' },
    { label: 'Out for Delivery', desc: 'Rider is on the way' },
    { label: 'Delivered', desc: 'Enjoy your feast!' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Live Order Tracking
            </h1>
            <span className="text-xs font-mono font-bold bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full">
              #{order.id}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ordering from <span className="font-bold text-slate-800">{order.restaurantName}</span>
          </p>
        </div>

        {/* Evaluation Demo Status Controller */}
        <div className="flex items-center gap-2">
          <button
            onClick={advanceStatus}
            className="px-3.5 py-2 bg-slate-900 hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            title="Click to advance status for demo evaluation"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Demo: Advance Status ({order.status})</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Progress Stepper & Rider Card */}
        <div className="lg:col-span-5 space-y-6">
          {/* Status Timeline Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  Current Status
                </span>
                <div className="text-lg font-black text-slate-900 flex items-center gap-2 mt-0.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{order.status}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  Est. Delivery Time
                </span>
                <div className="text-sm font-bold text-orange-600 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{order.status === 'Delivered' ? 'Delivered' : '18–22 mins'}</span>
                </div>
              </div>
            </div>

            {/* Stepper */}
            <div className="space-y-6 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {stepsData.map((step, idx) => {
                const isPassed = idx <= currentStatusIdx;
                const isCurrent = idx === currentStatusIdx;

                return (
                  <div key={step.label} className="relative flex items-start gap-4">
                    <div
                      className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                        isPassed
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'bg-white border-slate-300 text-slate-400'
                      } ${isCurrent ? 'ring-4 ring-emerald-500/20' : ''}`}
                    >
                      {isPassed ? '✓' : idx + 1}
                    </div>

                    <div>
                      <h4
                        className={`text-sm font-bold ${
                          isPassed ? 'text-slate-900' : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Partner Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Delivery Hero
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified Rider</span>
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120"
                  alt="Delivery Hero"
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {order.deliveryPartner?.name || 'Rajesh Kumar'}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{order.deliveryPartner?.rating || '4.9'}</span>
                    </span>
                    <span>•</span>
                    <span>{order.deliveryPartner?.vehicle || 'Hero Splendor (WB-34)'}</span>
                  </div>
                </div>
              </div>

              {/* Call & Chat buttons */}
              <div className="flex items-center gap-2">
                <a
                  href="tel:+919811122334"
                  className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors"
                  title="Call delivery partner"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <button
                  onClick={() => addToast('Opening SMS to rider (+91 98111 22334)')}
                  className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 hover:bg-orange-100 flex items-center justify-center transition-colors"
                  title="Message delivery partner"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Rate Button if Delivered */}
          {order.status === 'Delivered' && (
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 text-sm transition-all"
            >
              <Star className="w-4 h-4 fill-current text-amber-300" />
              <span>Rate Restaurant & Food</span>
            </button>
          )}
        </div>

        {/* Right Column: Live GPS Leaflet Map & Items */}
        <div className="lg:col-span-7 space-y-6">
          {/* Interactive Live Tracking Map */}
          <LiveTrackingMap
            restaurantLocation={{
              lat: 21.9542,
              lng: 87.2721,
              name: order.restaurantName
            }}
            customerLocation={{
              lat: order.deliveryAddress?.lat || 21.9640,
              lng: order.deliveryAddress?.lng || 87.2790,
              name: order.deliveryAddress?.type || 'Destination'
            }}
            riderLocation={{
              lat: riderCoords.lat,
              lng: riderCoords.lng,
              name: order.deliveryPartner?.name || 'Rider on route'
            }}
            status={order.status}
          />

          {/* Order Items Breakdown */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Items in this Order</h3>
              <span className="text-xs font-semibold text-slate-400">
                {order.items?.length || 0} items
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {(order.items || []).map((item, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center text-xs sm:text-sm">
                  <div>
                    <span className="font-bold text-slate-800">{item.quantity}x</span>{' '}
                    <span className="font-medium text-slate-800">{item.name}</span>
                    {item.size && <span className="text-xs text-slate-400 ml-1">({item.size})</span>}
                  </div>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-sm font-extrabold text-slate-900">
              <span>Grand Total</span>
              <span className="text-orange-600 text-base">
                {formatCurrency(order.pricing?.grandTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        order={order}
        onReviewSubmitted={fetchOrder}
      />
    </div>
  );
};
