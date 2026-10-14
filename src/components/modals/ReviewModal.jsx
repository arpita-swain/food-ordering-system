import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Camera, Check, ThumbsUp } from 'lucide-react';
import { orderApi } from '../../api/orderApi';
import { useToast } from '../../context/ToastContext';

export const ReviewModal = ({ isOpen, onClose, order, onReviewSubmitted }) => {
  const [restaurantRating, setRestaurantRating] = useState(5);
  const [foodRating, setFoodRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [selectedTags, setSelectedTags] = useState(['Food was hot & fresh']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  const tagsList = [
    'Food was hot & fresh',
    'Superfast delivery',
    'Great packaging',
    'Generous portion',
    'Value for money',
    'Tasty & hygienic'
  ];

  if (!isOpen || !order) return null;

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await orderApi.rateOrder(order.id, {
        restaurantRating,
        foodRating,
        review: reviewText,
        tags: selectedTags
      });
      addToast('Thank you for rating your feast! ⭐');
      if (onReviewSubmitted) onReviewSubmitted();
      onClose();
    } catch {
      addToast('Failed to save review', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Rate your experience</h3>
              <p className="text-xs text-slate-500 mt-0.5">Order #{order.id} • {order.restaurantName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
            {/* Restaurant Star Rating */}
            <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Rate Restaurant Experience
              </label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={`rest-star-${star}`}
                    type="button"
                    onClick={() => setRestaurantRating(star)}
                    className="p-1.5 focus:outline-none hover:scale-110 active:scale-95 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= restaurantRating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Food Star Rating */}
            <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Rate Food Quality & Taste
              </label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={`food-star-${star}`}
                    type="button"
                    onClick={() => setFoodRating(star)}
                    className="p-1.5 focus:outline-none hover:scale-110 active:scale-95 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= foodRating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick feedback tags */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                What did you love most?
              </label>
              <div className="flex flex-wrap gap-2">
                {tagsList.map((tag, idx) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={`review-tag-${tag}-${idx}`}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        isSelected
                          ? 'bg-orange-50 border-orange-500 text-orange-600 shadow-sm font-semibold'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Text review */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                Write your review
              </label>
              <textarea
                rows={3}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your thoughts on food freshness, aroma, packaging..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Photo upload mock */}
            <div className="p-3 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-slate-500 cursor-pointer hover:bg-slate-50 transition-colors">
              <Camera className="w-5 h-5 text-orange-500" />
              <span className="text-xs font-semibold">Attach Food Photos</span>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 transition-all text-sm"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
