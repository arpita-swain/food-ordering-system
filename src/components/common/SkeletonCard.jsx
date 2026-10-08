import React from 'react';

export const RestaurantSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 p-3 space-y-3 animate-pulse">
      <div className="w-full h-44 bg-slate-200 rounded-xl" />
      <div className="space-y-2 px-1">
        <div className="h-5 bg-slate-200 rounded-md w-3/4" />
        <div className="h-4 bg-slate-200 rounded-md w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-4 bg-slate-200 rounded w-1/4" />
          <div className="h-4 bg-slate-200 rounded w-1/3" />
        </div>
      </div>
    </div>
  );
};

export const FoodSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex gap-4 animate-pulse">
      <div className="flex-1 space-y-2">
        <div className="w-5 h-5 bg-slate-200 rounded" />
        <div className="h-5 bg-slate-200 rounded w-2/3" />
        <div className="h-4 bg-slate-200 rounded w-1/4" />
        <div className="h-3 bg-slate-200 rounded w-5/6" />
      </div>
      <div className="w-28 h-28 bg-slate-200 rounded-xl shrink-0" />
    </div>
  );
};
