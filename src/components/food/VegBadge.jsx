import React from 'react';

export const VegBadge = ({ isVeg, size = 'sm' }) => {
  const boxSize = size === 'lg' ? 'w-5 h-5 border-2' : 'w-4 h-4 border-[1.5px]';
  const dotSize = size === 'lg' ? 'w-2.5 h-2.5' : 'w-2 h-2';

  if (isVeg) {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-sm border-emerald-600 bg-white p-0.5 ${boxSize}`}
        title="Pure Vegetarian"
      >
        <span className={`rounded-full bg-emerald-600 ${dotSize}`} />
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center rounded-sm border-rose-600 bg-white p-0.5 ${boxSize}`}
      title="Non-Vegetarian"
    >
      <span className={`rounded-full bg-rose-600 ${dotSize}`} />
    </div>
  );
};
