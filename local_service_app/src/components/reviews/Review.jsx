import React, { useState } from 'react';

const Review = ({ booking, onSubmit, onClose }) => {
  const [review, setReview] = useState({
    rating: 5,
    comment: '',
    wouldRecommend: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReview(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (review.comment.trim() === '') {
      alert('Please provide a comment for your review.');
      return;
    }
    onSubmit(review);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Rate Your Experience</h2>
          <p className="text-gray-600 mb-6">
            How was your experience with {booking.service.name}?
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Rating
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReview(prev => ({ ...prev, rating: star }))}
                    className="text-2xl focus:outline-none"
                  >
                    {star <= review.rating ? '⭐' : '☆'}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">{review.rating} out of 5 stars</p>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Review
              </label>
              <textarea
                name="comment"
                value={review.comment}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Share details of your experience..."
                rows="4"
                required
              />
            </div>

            {/* Recommendation */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="wouldRecommend"
                checked={review.wouldRecommend}
                onChange={handleChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                I would recommend this service to others
              </label>
            </div>

            {/* Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-secondary transition-colors font-semibold"
              >
                Submit Review
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Review;