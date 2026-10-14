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
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'active' | 'completed' | 'cancelled'
  const [searchQuery, setSearchQuery] = useState('');

  const { addItem, clearCart } = useCart();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Fetch via orderApi.getOrderHistory() which hits /api/v1/orders/history
      const data = await orderApi.getOrderHistory();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load order history', err);
      // Fallback to getOrders
      const fallback = await orderApi.getOrders();
      setOrders(Array.isArray(fallback) ? fallback : []);
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
      const rest = (await restaurantApi.getRestaurantById(order.restaurantId)) || {
        id: order.restaurantId,
        name: order.restaurantName
      };

      const reorderTimestamp = Date.now();
      for (const [itIdx, item] of (order.items || []).entries()) {
        addItem(
          {
            id: item.id || `food-reorder-${reorderTimestamp}-${itIdx}`,
            name: item.name,
            price: item.price,
            isVeg: item.isVeg ?? false,
            image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300'
          },
          {
            quantity: item.quantity || 1,
            size: item.size ? { name: item.size, price: 0 } : null,
            extras: item.extras ? item.extras.map((e) => ({ name: typeof e === 'string' ? e : e.name, price: 0 })) : []
          },
          rest
        );
      }

      addToast(`Added ${order.items?.length || 0} items from ${order.restaurantName} to your cart!`);
      navigate('/cart');
    } catch (err) {
      console.error('Reorder error', err);
      addToast('Could not reorder items', 'error');
    }
  };

  // Filtered list
  const filteredOrders = orders.filter((order) => {
    // Status filter
    if (activeTab === 'active') {
      if (order.status === 'Delivered' || order.status === 'Cancelled') return false;
    } else if (activeTab === 'completed') {
      if (order.status !== 'Delivered') return false;
    } else if (activeTab === 'cancelled') {
      if (order.status !== 'Cancelled') return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchRest = order.restaurantName?.toLowerCase().includes(q);
      const matchId = order.id?.toLowerCase().includes(q);
      const matchItem = order.items?.some((i) => i.name?.toLowerCase().includes(q));
      return matchRest || matchId || matchItem;
    }

    return true;
  });

  const activeCount = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const completedCount = orders.filter((o) => o.status === 'Delivered').length;
  const cancelledCount = orders.filter((o) => o.status === 'Cancelled').length;

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600 font-medium">Loading your feast history from backend...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/20">
              <Package className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">My Orders</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track live deliveries, view past feasts, reorder dishes, and download official invoices
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="self-start sm:self-auto px-3.5 py-2 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Orders</div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">{orders.length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-[11px] font-bold text-orange-500 uppercase tracking-wider">Active Deliveries</div>
          <div className="text-xl sm:text-2xl font-black text-orange-600 mt-0.5">{activeCount}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Completed</div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-0.5">{completedCount}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Spent</div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
            {formatCurrency(orders.reduce((sum, o) => sum + (o.pricing?.grandTotal || 0), 0))}
          </div>
        </div>
      </div>

      {/* Search and Tabs Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'active'
                ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            Ongoing ({activeCount})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'completed'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            Delivered ({completedCount})
          </button>
          {cancelledCount > 0 && (
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'cancelled'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              Cancelled ({cancelledCount})
            </button>
          )}
        </div>

        {/* Search Input */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by restaurant or dish..."
            className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 shadow-sm"
          />
        </div>
      </div>

      {/* Orders List or Empty State */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
          <EmptyState
            icon="📦"
            title={orders.length === 0 ? 'No orders placed yet' : 'No matching orders'}
            description={
              orders.length === 0
                ? "You haven't ordered any delicious feasts yet. Discover popular restaurants and treat yourself!"
                : 'Try clearing your search query or switching filters to see other past orders.'
            }
            actionText="Explore Restaurants"
            actionLink="/"
          />
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order, orderIdx) => {
            const isDelivered = order.status === 'Delivered';
            const isCancelled = order.status === 'Cancelled';
            const isActive = !isDelivered && !isCancelled;

            return (
              <div
                key={`order-card-${order.id || orderIdx}-${orderIdx}`}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4 hover:shadow-md transition-shadow"
              >
                {/* Header: Restaurant & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        to={`/restaurant/${order.restaurantId}`}
                        className="text-base sm:text-lg font-bold text-slate-900 hover:text-orange-600 transition-colors"
                      >
                        {order.restaurantName}
                      </Link>
                      <span className="text-xs font-mono font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        #{order.id}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Ordered on {formatDate(order.date)}</span>
                      {order.estimatedDeliveryTime && (
                        <span>• ETA: {order.estimatedDeliveryTime}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                        isDelivered
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isCancelled
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-orange-50 text-orange-700 border border-orange-200 animate-pulse'
                      }`}
                    >
                      {isDelivered ? (
                        <CheckCircle className="w-3.5 h-3.5" />
                      ) : isCancelled ? (
                        <AlertCircle className="w-3.5 h-3.5" />
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
                    <div key={`order-item-${item.id || item.name || idx}-${idx}`} className="flex justify-between text-xs sm:text-sm text-slate-700">
                      <div>
                        <span className="font-bold text-slate-900">{item.quantity}x</span> {item.name}
                        {item.size && <span className="text-xs text-slate-400 ml-1">({item.size})</span>}
                        {Array.isArray(item.extras) && item.extras.length > 0 && (
                          <span className="text-[11px] text-orange-600 block sm:inline sm:ml-2">
                            +{item.extras.join(', ')}
                          </span>
                        )}
                      </div>
                      <span className="font-semibold text-slate-800">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Delivery details snapshot */}
                {order.deliveryAddress?.addressLine && (
                  <div className="text-[11px] text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 flex items-center gap-1.5 truncate">
                    <span className="font-semibold text-slate-600 shrink-0">Delivered to:</span>
                    <span className="truncate">{order.deliveryAddress.addressLine}</span>
                  </div>
                )}

                {/* Pricing & Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs text-slate-500">
                    Total Paid:{' '}
                    <span className="text-base font-black text-slate-900 ml-1">
                      {formatCurrency(order.pricing?.grandTotal)}
                    </span>{' '}
                    via <span className="font-semibold text-slate-700">{order.payment?.method || 'UPI'}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Track Order */}
                    <Link
                      to={`/track/${order.id}`}
                      className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1 shadow-sm transition-all ${
                        isActive
                          ? 'bg-orange-500 hover:bg-orange-600 active:scale-95 text-white shadow-orange-500/20'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>{isActive ? 'Track Live' : 'View Tracking'}</span>
                    </Link>

                    {/* Reorder */}
                    <button
                      onClick={() => handleReorder(order)}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs flex items-center gap-1 transition-all shadow-sm"
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
      )}

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
