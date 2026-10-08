import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  RotateCw,
  FileDown,
  Star,
  Clock,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Truck
} from 'lucide-react';
import { orderApi } from '../api/orderApi';
import { foodApi } from '../api/foodApi';
import { restaurantApi } from '../api/restaurantApi';
import { useCart } from '../context/CartContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { downloadInvoice } from '../utils/invoiceGenerator';
import { EmptyState } from '../components/common/EmptyState';
import { ReviewModal } from '../components/modals/ReviewModal';
import { useToast } from '../context/ToastContext';

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderForReview, setSelectedOrderForReview] = useState(null);

  const { addItem, clearCart } = useCart();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const fetchOrders = async () => {
    try {
      const data = await orderApi.getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleReorder = async (order) => {
    try {
      clearCart();
      const rest = await restaurantApi.getRestaurantById(order.restaurantId) || {
        id: order.restaurantId,
        name: order.restaurantName
      };

      for (const item of order.items) {
        addItem(
          {
            id: item.id || `food-reorder-${Date.now()}`,
            name: item.name,
            price: item.price,
            isVeg: item.isVeg ?? false,
            image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300'
          },
          {
            quantity: item.quantity,
            size: item.size ? { name: item.size, price: 0 } : null,
            extras: item.extras ? item.extras.map((e) => ({ name: e, price: 0 })) : []
          },
          rest
        );
      }

      addToast(`Reordered from ${order.restaurantName}!`);
      navigate('/cart');
    } catch (err) {
      console.error('Reorder error', err);
      addToast('Could not reorder items', 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500">Loading your feast history...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <EmptyState
          icon="📦"
          title="No previous orders yet"
          description="Looks like you haven't ordered any meals yet. Explore top restaurants and treat yourself!"
          actionText="Start Ordering"
          actionLink="/"
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Your Orders</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track, reorder, or download tax invoices for your past meals
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          const isDelivered = order.status === 'Delivered';

          return (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4 hover:shadow-md transition-shadow"
            >
              {/* Header: Restaurant & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {order.restaurantName}
                    </h3>
                    <span className="text-xs font-mono font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      #{order.id}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Ordered on {formatDate(order.date)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      order.status === 'Delivered'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-orange-50 text-orange-700 border border-orange-200'
                    }`}
                  >
                    {order.status === 'Delivered' ? (
                      <CheckCircle className="w-3.5 h-3.5" />
                    ) : (
                      <Truck className="w-3.5 h-3.5" />
                    )}
                    <span>{order.status}</span>
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-1.5 py-1">
                {(order.items || []).map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs sm:text-sm text-slate-700">
                    <div>
                      <span className="font-bold text-slate-900">{item.quantity}x</span> {item.name}
                      {item.size && <span className="text-xs text-slate-400 ml-1">({item.size})</span>}
                    </div>
                    <span className="font-semibold text-slate-800">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing & Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-xs text-slate-500">
                  Total Paid:{' '}
                  <span className="text-base font-black text-slate-900 ml-1">
                    {formatCurrency(order.pricing?.grandTotal)}
                  </span>{' '}
                  via {order.payment?.method || 'UPI'}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Track Order */}
                  <Link
                    to={`/track/${order.id}`}
                    className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-orange-500/20 transition-all"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Track Live</span>
                  </Link>

                  {/* Reorder */}
                  <button
                    onClick={() => handleReorder(order)}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs flex items-center gap-1 transition-all"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Reorder</span>
                  </button>

                  {/* Download Invoice */}
                  <button
                    onClick={() => downloadInvoice(order)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Download Tax Invoice"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Invoice</span>
                  </button>

                  {/* Rate Order */}
                  {isDelivered && (
                    <button
                      onClick={() => setSelectedOrderForReview(order)}
                      className="px-3 py-2 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100 text-amber-800 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                      <span>{order.rating ? 'Edit Rating' : 'Rate Order'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Review Modal */}
      {selectedOrderForReview && (
        <ReviewModal
          isOpen={!!selectedOrderForReview}
          onClose={() => setSelectedOrderForReview(null)}
          order={selectedOrderForReview}
          onReviewSubmitted={fetchOrders}
        />
      )}
    </div>
  );
};
