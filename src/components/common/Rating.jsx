import React from 'react';
import { Star } from 'lucide-react';

export const Rating = ({ rating = 4.5, count, size = 'sm', className = '' }) => {
  const isCompact = size === 'sm';
  
  return (
    <div
      className={`inline-flex items-center gap-1 font-bold text-white rounded-md ${
        rating >= 4.0 ? 'bg-emerald-600' : rating >= 3.0 ? 'bg-amber-500' : 'bg-rose-500'
      } ${isCompact ? 'px-1.5 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'} ${className}`}
    >
      <span>{Number(rating).toFixed(1)}</span>
      <Star className={`${isCompact ? 'w-3 h-3' : 'w-3.5 h-3.5'} fill-current`} />
      {count && (
        <span className="text-emerald-100 font-normal ml-0.5">
          ({count})
        </span>
      )}
    </div>
  );
};
