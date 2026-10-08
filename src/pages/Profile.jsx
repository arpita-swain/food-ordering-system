import React, { useState } from 'react';
import {
  User,
  MapPin,
  CreditCard,
  Bell,
  LogOut,
  Plus,
  Trash2,
  CheckCircle,
  Home,
  Briefcase,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AddressModal } from '../components/modals/AddressModal';

export const Profile = () => {
  const { user, addresses, logout, removeAddress, setDefaultAddress } = useAuth();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('addresses'); // 'addresses' | 'payments' | 'notifications'

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Profile Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="relative">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'}
              alt={user?.name || 'User'}
              className="w-20 h-20 rounded-full object-cover border-4 border-orange-100 shadow-md"
            />
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
          </div>

          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {user?.name || 'Foodie Explorer'}
              </h1>
              <span className="text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full">
                {user?.role || 'Customer'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {user?.email || 'arpit@foodiego.com'} • {user?.phone || '+91 98765 43210'}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2.5 rounded-2xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors shrink-0"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('addresses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'addresses'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Addresses ({addresses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'payments'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Payment Methods</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'notifications'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
        </button>
      </div>

      {/* Tab: Saved Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800">Delivery Addresses</h3>
            <button
              onClick={() => setIsAddressModalOpen(true)}
              className="px-3.5 py-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {addr.type === 'Home' ? (
                        <Home className="w-4 h-4 text-orange-500" />
                      ) : (
                        <Briefcase className="w-4 h-4 text-orange-500" />
                      )}
                      <span className="font-black text-xs uppercase tracking-wider text-slate-900">
                        {addr.type}
                      </span>
                    </div>

                    {addr.isDefault && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>

                  <div className="text-xs font-bold text-slate-800">{addr.name}</div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {addr.house}, {addr.street}, {addr.landmark ? `${addr.landmark}, ` : ''}
                    {addr.city} - {addr.pincode}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Phone: {addr.phone}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  {!addr.isDefault && (
                    <button
                      onClick={() => setDefaultAddress(addr.id)}
                      className="text-xs font-bold text-orange-600 hover:text-orange-700"
                    >
                      Set as Default
                    </button>
                  )}
                  {addr.isDefault && <div />}

                  <button
                    onClick={() => removeAddress(addr.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Delete address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Payment Methods */}
      {activeTab === 'payments' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-800">Saved Payment Methods</h3>
          <div className="space-y-3">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📱</span>
                <div>
                  <div className="text-xs font-bold text-slate-900">Default UPI Account</div>
                  <div className="text-[11px] text-slate-400 font-mono">arpit@okaxis (Verified)</div>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Active
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💳</span>
                <div>
                  <div className="text-xs font-bold text-slate-900">HDFC Regalia Credit Card</div>
                  <div className="text-[11px] text-slate-400 font-mono">•••• •••• •••• 4242 (Tokenized)</div>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-medium">Expires 12/28</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Card information encrypted with RBI-compliant tokenization.</span>
          </div>
        </div>
      )}

      {/* Tab: Notifications */}
      {activeTab === 'notifications' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-800">Notification Preferences</h3>
          <div className="space-y-3">
            {[
              { title: 'Order Tracking Updates', desc: 'Real-time SMS & push alerts when food is prepared & dispatched' },
              { title: 'Exclusive Promo Codes', desc: 'Alerts when SAVE50 or FLAT ₹100 offers are available in Dantan' },
              { title: 'Kitchen & Chef Recommendations', desc: 'Weekend recommendations from top trending restaurants' }
            ].map((n, idx) => (
              <label key={idx} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer">
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900">{n.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{n.desc}</div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500"
                />
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Address modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
      />
    </div>
  );
};
