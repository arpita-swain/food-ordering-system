import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, Bike, Utensils, Sparkles } from 'lucide-react';

export const RoleSwitcher = () => {
  const { activeRole, switchRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleSelect = (role, targetRoute) => {
    switchRole(role);
    navigate(targetRoute);
  };

  return (
    <div className="bg-slate-900 text-white text-xs py-1.5 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium text-[11px] sm:text-xs">
            Role Switcher (Evaluation Demo):
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => handleRoleSelect('Customer', '/')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 transition-all ${
              activeRole === 'Customer' && !location.pathname.startsWith('/admin') && !location.pathname.startsWith('/delivery')
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Utensils className="w-3 h-3" />
            <span>Customer View</span>
          </button>

          <button
            onClick={() => handleRoleSelect('Delivery Partner', '/delivery')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 transition-all ${
              location.pathname.startsWith('/delivery')
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Bike className="w-3 h-3" />
            <span>Delivery Partner</span>
          </button>

          <button
            onClick={() => handleRoleSelect('Admin', '/admin')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 transition-all ${
              location.pathname.startsWith('/admin')
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-3 h-3" />
            <span>Admin Console</span>
          </button>
        </div>
      </div>
    </div>
  );
};
