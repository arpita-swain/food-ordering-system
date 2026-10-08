import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Ticket,
  Check,
  X,
  Sparkles,
  Info,
  Clock,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { cartApi } from '../api/cartApi';
import { VegBadge } from '../components/food/VegBadge';
import { EmptyState } from '../components/common/EmptyState';
import { formatCurrency } from '../utils/formatters';

export const Cart = () => {
  const {
    items,
    restaurant,
    itemCount,
    subtotal,
    deliveryFee,
    platformFee,
    taxes,
    deliveryTip,
    setDeliveryTip,
    specialInstructions,
    setSpecialInstructions,
    couponDiscount,
    appliedCoupon,
    grandTotal,
    updateQuantity,
    removeItem,
    clearCart,
    applyCouponCode,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [couponError, setCouponError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const list = await cartApi.getCoupons();
        setAvailableCoupons(list);
      } catch (err) {
        console.error('Failed to load coupons', err);
      }
    };
    fetchCoupons();
  }, []);

  const handleApply = async (codeToApply) => {
    setCouponError('');
    try {
      await applyCouponCode(codeToApply || couponInput);
      setCouponInput('');
    } catch (err) {
      setCouponError(err.message || 'Invalid coupon code');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          icon="🛒"
          title="Your FoodieGo cart is empty"
          description="Good food is just a click away! Browse top-rated restaurants and order your favorite feast."
          actionText="Explore Restaurants"
          actionLink="/"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Your Feast Cart</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ordering from <span className="font-bold text-slate-800">{restaurant?.name}</span>
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Items List & Instructions */}
        <div className="lg:col-span-7 space-y-6">
          {/* Restaurant Banner & Add More Items */}
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-xl font-bold">
                🏪
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  {restaurant?.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1">{restaurant?.address}</p>
              </div>
            </div>

            <Link
              to={`/restaurant/${restaurant?.id}`}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200 transition-colors shrink-0"
            >
              + Add More Items
            </Link>
          </div>

          {/* Cart Items List */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {items.map((item, idx) => (
              <div key={item.id} className="p-4 sm:p-5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">
                    <VegBadge isVeg={item.isVeg} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                      {item.name}
                    </h4>
                    {item.size && (
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Size: {item.size}
                      </p>
                    )}
                    {item.extras?.length > 0 && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        Addons: {item.extras.join(', ')}
                      </p>
                    )}
                    <div className="text-sm font-black text-slate-900 mt-1">
                      {formatCurrency(item.price * item.quantity)}
                      <span className="text-xs font-normal text-slate-400 ml-1">
                        ({formatCurrency(item.price)} each)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quantity adjuster */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1 shadow-sm">
                    <button
                      onClick={() => updateQuantity(idx, item.quantity - 1)}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-7 text-center font-bold text-xs text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(idx, item.quantity + 1)}
                      className="p-1 hover:bg-orange-100 rounded text-orange-600 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(idx)}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cooking & Delivery Note */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Special Instructions for Restaurant
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="E.g. Avoid plastic cutlery, leave packet with guard..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Delivery Partner Tip Selector */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Tip your delivery partner
                </h4>
                <p className="text-[11px] text-slate-400">100% of the tip goes to your rider</p>
              </div>
              {deliveryTip > 0 && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  +{formatCurrency(deliveryTip)}
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[0, 20, 30, 50].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setDeliveryTip(amount)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    deliveryTip === amount
                      ? 'border-orange-500 bg-orange-50 text-orange-600 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {amount === 0 ? 'No Tip' : `₹${amount}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Coupons & Bill Details */}
        <div className="lg:col-span-5 space-y-6">
          {/* Coupon Section */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-orange-500" />
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
                Apply Coupons & Offers
              </h3>
            </div>

            {appliedCoupon ? (
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div>
                    <div className="font-extrabold text-emerald-900 text-xs sm:text-sm">
                      '{appliedCoupon.code}' Applied!
                    </div>
                    <div className="text-[11px] text-emerald-700">
                      You saved {formatCurrency(couponDiscount)} on this order
                    </div>
                  </div>
                </div>

                <button
                  onClick={removeCoupon}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 px-2 py-1"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code (e.g. SAVE50)"
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    onClick={() => handleApply(couponInput)}
                    disabled={!couponInput.trim()}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-orange-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="text-xs text-rose-600 font-semibold">{couponError}</p>
                )}

                {/* Available Coupons list */}
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Available Offers
                  </span>
                  {availableCoupons.map((c) => (
                    <div
                      key={c.code}
                      className="p-3 bg-slate-50 hover:bg-orange-50/50 rounded-2xl border border-slate-200 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs text-orange-600 font-mono tracking-wider bg-orange-100/80 px-2 py-0.5 rounded">
                            {c.code}
                          </span>
                          <span className="text-[10px] text-slate-400">{c.badge}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{c.description}</p>
                      </div>

                      <button
                        onClick={() => handleApply(c.code)}
                        className="text-xs font-bold text-orange-600 hover:text-orange-700 px-3 py-1.5 bg-white border border-orange-200 rounded-xl shadow-xs"
                      >
                        Apply
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bill Summary Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
              Bill Summary
            </h3>

            <div className="space-y-2.5 text-xs sm:text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Item Total ({itemCount} items)</span>
                <span className="font-semibold text-slate-800">{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <span>Delivery Partner Fee</span>
                  {subtotal >= 350 && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded font-bold">
                      FREE
                    </span>
                  )}
                </span>
                <span className="font-semibold text-slate-800">
                  {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span className="font-semibold text-slate-800">{formatCurrency(platformFee)}</span>
              </div>

              <div className="flex justify-between">
                <span>Taxes & Restaurant Charges (5% GST)</span>
                <span className="font-semibold text-slate-800">{formatCurrency(taxes)}</span>
              </div>

              {deliveryTip > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Delivery Partner Tip</span>
                  <span>+{formatCurrency(deliveryTip)}</span>
                </div>
              )}

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount</span>
                  <span>-{formatCurrency(couponDiscount)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-base sm:text-lg font-black text-slate-900">
                <span>Grand Total</span>
                <span className="text-orange-600">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {/* Savings Callout */}
            {couponDiscount > 0 && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>You are saving {formatCurrency(couponDiscount)} on this order!</span>
              </div>
            )}

            {/* Proceed to Checkout CTA */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white font-extrabold rounded-2xl shadow-xl shadow-orange-500/25 flex items-center justify-between px-6 text-sm sm:text-base transition-all"
            >
              <div className="text-left">
                <div className="text-[10px] text-orange-100 uppercase tracking-wider font-semibold">
                  Total Payable
                </div>
                <div>{formatCurrency(grandTotal)}</div>
              </div>

              <div className="flex items-center gap-1.5">
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safe and secure payments. 100% refund guarantee.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
