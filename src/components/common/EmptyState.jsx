import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  icon = '🍽️',
  title = 'Nothing here yet',
  description = 'Looks like there are no items to display at this moment.',
  actionText = 'Explore Restaurants',
  actionLink = '/',
  onAction
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center p-8 sm:p-12 my-6 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-md mx-auto"
    >
      <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center text-4xl mb-4 shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 mb-6 max-w-xs">{description}</p>
      
      {onAction ? (
        <button
          onClick={onAction}
          className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold rounded-full shadow-lg shadow-orange-500/20 transition-all text-sm"
        >
          {actionText}
        </button>
      ) : actionLink ? (
        <Link
          to={actionLink}
          className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold rounded-full shadow-lg shadow-orange-500/20 transition-all text-sm inline-block"
        >
          {actionText}
        </Link>
      ) : null}
    </motion.div>
  );
};
