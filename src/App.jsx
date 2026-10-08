import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { CartProvider } from './context/CartContext';

import { RoleSwitcher } from './components/common/RoleSwitcher';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { CartWarningModal } from './components/modals/CartWarningModal';
import { LocationModal } from './components/modals/LocationModal';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <LocationProvider>
            <FavoritesProvider>
              <CartProvider>
                <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
                  {/* Demo Persona Role Switcher for instant evaluator switching */}
                  <RoleSwitcher />
                  
                  {/* Sticky Global Header */}
                  <Header />

                  {/* Main Routing View */}
                  <main className="flex-1">
                    <AppRoutes />
                  </main>

                  {/* Global Modals */}
                  <CartWarningModal />
                  <LocationModal />

                  {/* Mobile Bottom Navigation & Sticky Cart Bar */}
                  <MobileBottomNav />

                  {/* Global Footer */}
                  <Footer />
                </div>
              </CartProvider>
            </FavoritesProvider>
          </LocationProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
