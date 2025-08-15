import React from 'react';
export default function CompanyReviews({ reviews }) {
  if (!reviews || reviews.length === 0) return null;
  return (
    <div className="mb-8">
      <h2 className="font-semibold text-xl mb-2">Отзывы</h2>
      <ul>
        {reviews.map(review => (
          <li key={review._id} className="mb-2">
            <div className="font-bold">{review.author}</div>
            <div className="text-gray-600">{review.text}</div>
            <div className="text-xs text-gray-400">{review.date}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
