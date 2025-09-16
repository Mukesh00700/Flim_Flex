import React from 'react';

const ReviewCard = ({ review }) => {
  return (
    <div className="bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700 hover:border-blue-500/50 transition-all">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
          {review.avatar}
        </div>
        <div>
          <h4 className="text-white font-semibold">{review.name}</h4>
          <div className="flex text-yellow-400">
            {[...Array(review.rating)].map((_, i) => (
              <span key={i}>⭐</span>
            ))}
          </div>
        </div>
      </div>
      <p className="text-slate-300 italic text-lg leading-relaxed">"{review.comment}"</p>
    </div>
  );
};

export default ReviewCard;
