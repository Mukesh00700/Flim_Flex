import React from 'react';
import ReviewCard from './ReviewCard';

const ReviewsSection = () => {
  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      comment: "Amazing experience! Easy booking and great movie selection.",
      avatar: "SJ"
    },
    {
      id: 2,
      name: "Mike Chen",
      rating: 4,
      comment: "Love the interface and quick booking process. Highly recommended!",
      avatar: "MC"
    },
    {
      id: 3,
      name: "Emily Davis",
      rating: 5,
      comment: "Best movie booking platform I've used. Clean and user-friendly.",
      avatar: "ED"
    }
  ];

  return (
    <section id="reviews" className="mb-32 bg-slate-800/50 py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-bold mb-6 text-white">What Our Customers Say</h3>
          <div className="w-24 h-1 bg-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Real experiences from movie lovers just like you
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
