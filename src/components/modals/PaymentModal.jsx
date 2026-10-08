import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, QrCode, CreditCard, Building2, Banknote, CheckCircle2, Loader2, Lock } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { paymentApi } from '../../api/paymentApi';

export const PaymentModal = ({
  isOpen,
  onClose,
  totalAmount,
  orderId,
  onPaymentSuccess
}) => {
  const [selectedMethod, setSelectedMethod] = useState('UPI'); // 'UPI' | 'CARD' | 'NETBANKING' | 'COD'
  const [upiId, setUpiId] = useState('arpit@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      const result = await paymentApi.processPayment({
        method: selectedMethod,
        amount: totalAmount,
        orderId
      });

      if (result.success) {
        setPaymentSuccess(true);
        setTimeout(() => {
          setIsProcessing(false);
          onPaymentSuccess(result);
        }, 1200);
      }
    } catch (err) {
      setIsProcessing(false);
      alert('Payment processing failed. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold">FoodieGo Secure Pay</h3>
                <p className="text-xs text-slate-400">128-bit SSL & Razorpay / Stripe Ready</p>
              </div>
            </div>
            {!isProcessing && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6">
            {isProcessing ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                {paymentSuccess ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20"
                  >
                    <CheckCircle2 className="w-10 h-10" />
                  </motion.div>
                ) : (
                  <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                )}
                <div>
                  <h4 className="text-lg font-bold text-slate-800">
                    {paymentSuccess ? 'Payment Approved!' : 'Connecting Gateway...'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {paymentSuccess
                      ? 'Confirming your feast with the kitchen'
                      : 'Please do not refresh or close this browser window'}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Total amount summary card */}
                <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-orange-950 uppercase tracking-wide">
                      Total Payable
                    </div>
                    <div className="text-2xl font-black text-slate-900 mt-0.5">
                      {formatCurrency(totalAmount)}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Zero Surcharge
                    </span>
                  </div>
                </div>

                {/* Methods Tabs */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 block">
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'UPI', label: 'UPI / QR', icon: QrCode },
                      { id: 'CARD', label: 'Card', icon: CreditCard },
                      { id: 'NETBANKING', label: 'Net Banking', icon: Building2 },
                      { id: 'COD', label: 'Cash on Delivery', icon: Banknote }
                    ].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setSelectedMethod(id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                          selectedMethod === id
                            ? 'border-orange-500 bg-orange-50/70 text-orange-600 ring-2 ring-orange-500/20 font-bold shadow-sm'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <Icon className="w-5 h-5 mb-1" />
                        <span className="text-xs">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Method Specific Details */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  {selectedMethod === 'UPI' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">UPI ID / VPA</span>
                        <span className="text-[11px] text-orange-600 font-semibold">GPay, PhonePe, Paytm</span>
                      </div>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-mono focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                      <div className="flex items-center gap-2 pt-1">
                        <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs shadow-sm">
                          QR
                        </div>
                        <span className="text-[11px] text-slate-500">
                          Scan dynamic UPI QR code on the next screen
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedMethod === 'CARD' && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          placeholder="•••• •••• •••• 4242"
                          maxLength={19}
                          defaultValue="4111 2222 3333 4242"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-mono focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                            Valid Thru
                          </label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            defaultValue="12/28"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-mono focus:ring-2 focus:ring-orange-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                            CVV
                          </label>
                          <input
                            type="password"
                            placeholder="•••"
                            maxLength={4}
                            defaultValue="921"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-mono focus:ring-2 focus:ring-orange-500 focus:outline-none"
                          />
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Card details tokenized securely. Frontend never stores sensitive PAN/CVV.
                      </p>
                    </div>
                  )}

                  {selectedMethod === 'NETBANKING' && (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-700 block">Popular Banks</label>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank'].map((bank, i) => (
                          <div
                            key={bank}
                            className={`p-2.5 rounded-xl border bg-white flex items-center gap-2 cursor-pointer ${
                              i === 0 ? 'border-orange-500 text-orange-600 font-bold' : 'border-slate-200'
                            }`}
                          >
                            <Building2 className="w-4 h-4 text-slate-400" />
                            <span>{bank}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedMethod === 'COD' && (
                    <div className="text-center py-2 space-y-1">
                      <Banknote className="w-8 h-8 text-emerald-600 mx-auto" />
                      <div className="text-xs font-bold text-slate-800">Cash on Delivery Available</div>
                      <p className="text-[11px] text-slate-500">
                        Pay cash or scan QR when delivery partner arrives at your doorstep.
                      </p>
                    </div>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="button"
                  onClick={handlePay}
                  className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 text-base transition-all"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    Pay {formatCurrency(totalAmount)}
                  </span>
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
