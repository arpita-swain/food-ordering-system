import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Phone, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';

export const Login = () => {
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [email, setEmail] = useState('arpit@foodiego.com');
  const [password, setPassword] = useState('password123');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch {
      // handled by toast
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      await authApi.sendOtp(phone);
      setOtpSent(true);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.verifyOtp({ phone, otp });
      await login(phone + '@foodiego.com', 'otp_login');
      navigate('/');
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-slate-50">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-xl max-w-md w-full space-y-6">
        {/* Brand */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-400 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-orange-500/20">
              🍕
            </div>
            <span className="text-2xl font-black text-slate-900">
              Foodie<span className="text-orange-500">Go</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-slate-900">Welcome Back</h2>
          <p className="text-xs text-slate-400 mt-1">Log in to track orders, save favorites & more</p>
        </div>

        {/* Toggle Mode: Password or OTP */}
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setIsOtpMode(false)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              !isOtpMode ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Password Login
          </button>
          <button
            type="button"
            onClick={() => setIsOtpMode(true)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              isOtpMode ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            OTP Login
          </button>
        </div>

        {!isOtpMode ? (
          /* Password Form */
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 text-sm transition-all"
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>
        ) : (
          /* OTP Form */
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all"
              >
                {loading ? 'Sending OTP...' : 'Send OTP (Code: 1234)'}
              </button>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Enter 4-Digit OTP</label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={4}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="1234"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-[10px] text-slate-400 text-center mt-1">
                    Demo OTP is <span className="font-bold text-orange-600">1234</span>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl shadow-lg text-sm"
                >
                  {loading ? 'Verifying...' : 'Verify OTP & Login'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Google Login Demo Button */}
        <div className="pt-2">
          <div className="relative flex items-center justify-center mb-4">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase">
              Or continue with
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              login('google.user@foodiego.com', 'google_auth');
              navigate('/');
            }}
            className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <span className="font-bold text-blue-600">G</span>
            <span>Sign in with Google</span>
          </button>
        </div>

        {/* Footer Link */}
        <div className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-orange-600 hover:text-orange-700">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};
