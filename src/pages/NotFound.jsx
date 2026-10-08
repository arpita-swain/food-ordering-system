import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-24 h-24 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center text-5xl mb-4 shadow-inner">
        🍽️
      </div>
      <span className="text-xs font-black uppercase tracking-widest text-orange-600 bg-orange-100/80 px-3 py-1 rounded-full">
        404 — Page Not Found
      </span>
      <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 mb-2">
        Craving got lost in transit?
      </h1>
      <p className="text-sm text-slate-500 max-w-md mb-8">
        We couldn't find the page or food item you were looking for. Let's get you back to the feast.
      </p>

      <Link
        to="/"
        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 active:scale-95 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 flex items-center gap-2 text-sm transition-all"
      >
        <Home className="w-4 h-4" />
        <span>Return to FoodieGo Home</span>
      </Link>
    </div>
  );
};
