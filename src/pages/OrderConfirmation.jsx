import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, MapPin, Bike, ArrowRight, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';
import { orderApi } from '../api/orderApi';
import { formatCurrency } from '../utils/formatters';

export const OrderConfirmation = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    // Launch celebratory confetti burst
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 }
    });

    if (!order && id) {
      orderApi.getOrderById(id).then((res) => {
        setOrder(res);
        setLoading(false);
      });
    }
  }, [id, order]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const orderId = order?.id || id || 'FG10254';

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center min-h-screen flex flex-col justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-2xl space-y-6"
      >
        {/* Animated Check Icon */}
        <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-14 h-14 stroke-[2.5]" />
        </div>

        <div>
          <span className="text-xs font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Payment Received & Order Placed
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3">
            Order Confirmed!
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-2">
            Your order <span className="font-extrabold text-slate-800">#{orderId}</span> has been transmitted to the kitchen.
          </p>
        </div>

        {/* Details Card */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 text-left space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                Restaurant
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-900">
                {order?.restaurantName || 'Spice Garden Royal'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                Estimated Delivery
              </div>
              <div className="text-xs sm:text-sm font-bold text-orange-600 flex items-center gap-1 justify-end">
                <Clock className="w-3.5 h-3.5" />
                <span>25–30 minutes</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Delivering to:</span>
            <span className="font-semibold text-slate-800 truncate max-w-[220px]">
              {order?.deliveryAddress?.addressLine || 'Dantan, West Bengal'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Payment Total:</span>
            <span className="font-bold text-slate-900">
              {formatCurrency(order?.pricing?.grandTotal || 450)} ({order?.payment?.method || 'UPI'})
            </span>
          </div>
        </div>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link
            to={`/track/${orderId}`}
            className="w-full sm:flex-1 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 text-sm transition-all"
          >
            <Bike className="w-4 h-4" />
            <span>Track Order Live</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/orders"
            className="w-full sm:flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold rounded-2xl text-sm transition-all flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>View All Orders</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
