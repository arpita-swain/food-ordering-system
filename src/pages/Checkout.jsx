import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  CreditCard,
  CheckCircle,
  Plus,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Zap,
  Bike
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { orderApi } from '../api/orderApi';
import { AddressModal } from '../components/modals/AddressModal';
import { PaymentModal } from '../components/modals/PaymentModal';
import { formatCurrency } from '../utils/formatters';

export const Checkout = () => {
  const {
    items,
    restaurant,
    subtotal,
    deliveryFee,
    platformFee,
    taxes,
    deliveryTip,
    couponDiscount,
    grandTotal,
    deliveryOption,
    setDeliveryOption,
    specialInstructions,
    clearCart
  } = useCart();

  const { addresses, user } = useAuth();
  const { currentLocation } = useLocation();
  const navigate = useNavigate();

  // Multi-step states
  const [selectedAddress, setSelectedAddress] = useState(() => {
    return addresses.find((a) => a.isDefault) || addresses[0] || {
      id: 'default-loc',
      type: 'Home',
      name: user?.name || 'Arpit Sinha',
      phone: '+91 98765 43210',
      addressLine: currentLocation.address || 'Station Road, Dantan, West Bengal',
      lat: currentLocation.lat || 21.9540,
      lng: currentLocation.lng || 87.2720
    };
  });

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrderClick = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = async (paymentResult) => {
    setIsPaymentModalOpen(false);
    setIsSubmitting(true);

    try {
      const orderPayload = {
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        restaurantAddress: restaurant.address,
        items: items.map((i) => ({
          id: i.foodId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          size: i.size,
          extras: i.extras
        })),
        pricing: {
          subtotal,
          deliveryFee,
          platformFee,
          taxes,
          deliveryTip,
          discount: couponDiscount,
          grandTotal
        },
        deliveryOption,
        specialInstructions,
        deliveryAddress: {
          name: selectedAddress.name || user?.name || 'Customer',
          phone: selectedAddress.phone || user?.phone,
          type: selectedAddress.type || 'Home',
          addressLine: selectedAddress.addressLine || `${selectedAddress.house}, ${selectedAddress.street}, ${selectedAddress.city}`,
          lat: selectedAddress.lat || 21.9540,
          lng: selectedAddress.lng || 87.2720
        },
        payment: {
          method: paymentResult.method || paymentMethod,
          status: 'Paid',
          transactionId: paymentResult.transactionId
        }
      };

      const newOrder = await orderApi.createOrder(orderPayload);
      clearCart();
      navigate(`/order-confirmed/${newOrder.id}`, { state: { order: newOrder } });
    } catch (err) {
      console.error('Failed to create order', err);
      alert('Error finalizing order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Secure Checkout</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Complete your feast order in 4 simple steps
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Multi-Step Flow */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* STEP 1: Address Selection */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
                  1
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Delivery Address</h3>
                  <p className="text-xs text-slate-400">Choose where you want your food delivered</p>
                </div>
              </div>

              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200 flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New</span>
              </button>
            </div>

            {/* Saved Addresses Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {addresses.map((addr) => {
                const isSelected = selectedAddress.id === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/20 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-orange-500" />
                        <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                          {addr.type}
                        </span>
                      </div>
                      {isSelected && <CheckCircle className="w-4 h-4 text-orange-600 fill-orange-100" />}
                    </div>
                    <div className="text-xs font-bold text-slate-800">{addr.name}</div>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                      {addr.house}, {addr.street}, {addr.city} - {addr.pincode}
                    </p>
                    <div className="text-[11px] text-slate-400 mt-1">{addr.phone}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Delivery Options (Standard vs Priority) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
                2
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delivery Speed</h3>
                <p className="text-xs text-slate-400">Choose your preferred delivery priority</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Standard */}
              <div
                onClick={() => setDeliveryOption('standard')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  deliveryOption === 'standard'
                    ? 'border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                    <Bike className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Standard Delivery</h4>
                    <p className="text-xs text-slate-500">25–30 mins</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-800">
                  {deliveryFee === 0 ? 'FREE' : 'Standard'}
                </span>
              </div>

              {/* Priority */}
              <div
                onClick={() => setDeliveryOption('priority')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  deliveryOption === 'priority'
                    ? 'border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                    <Zap className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-slate-900">Priority Express</h4>
                      <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-1.5 py-0.2 rounded">
                        Fastest
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">15–20 mins (Direct to you)</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-800">+₹20</span>
              </div>
            </div>
          </div>

          {/* STEP 3: Payment Method Selection */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
                3
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Payment Method</h3>
                <p className="text-xs text-slate-400">All transactions are 100% encrypted & secure</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'UPI', label: 'UPI / QR', icon: '📱' },
                { id: 'CARD', label: 'Cards', icon: '💳' },
                { id: 'NETBANKING', label: 'Net Banking', icon: '🏦' },
                { id: 'COD', label: 'Cash on Delivery', icon: '💵' }
              ].map(({ id, label, icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPaymentMethod(id)}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    paymentMethod === id
                      ? 'border-orange-500 bg-orange-50 text-orange-600 font-bold ring-2 ring-orange-500/20'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xl block mb-1">{icon}</span>
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Action */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-lg">🍱</span>
                <h3 className="font-bold text-slate-900 text-sm">Order Summary</h3>
              </div>
              <span className="text-xs text-slate-400">{items.length} items</span>
            </div>

            <div className="text-xs text-slate-500">
              <span className="font-bold text-slate-800">{restaurant?.name}</span>
            </div>

            {/* Items snippet */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {items.map((it) => (
                <div key={it.id} className="flex justify-between text-xs text-slate-700">
                  <div className="truncate max-w-[170px]">
                    <span className="font-semibold">{it.quantity}x</span> {it.name}
                  </div>
                  <span className="font-bold">{formatCurrency(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Bill Breakdown */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Item Total</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span>{deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & GST (5%)</span>
                <span>{formatCurrency(taxes)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Savings</span>
                  <span>-{formatCurrency(couponDiscount)}</span>
                </div>
              )}
              {deliveryTip > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Rider Tip</span>
                  <span>+{formatCurrency(deliveryTip)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-base font-black text-slate-900">
                <span>Total Amount</span>
                <span className="text-orange-600">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <button
              onClick={handlePlaceOrderClick}
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 disabled:opacity-50 text-white font-extrabold rounded-2xl shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 text-base transition-all mt-4"
            >
              <span>Place Order ({formatCurrency(grandTotal)})</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Razorpay / Stripe PCI-DSS Protected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Address modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onAddressAdded={(newAddr) => setSelectedAddress(newAddr)}
      />

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={grandTotal}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};
