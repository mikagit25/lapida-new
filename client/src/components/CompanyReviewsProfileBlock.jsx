import React from 'react';
import CompanyReviewForm from './CompanyReviewForm';
import ReviewsFeed from './ReviewsFeed';

function CompanyReviewsProfileBlock({ companyId, reviews, reviewsLoading, reviewsError, onReviewAdded }) {
  return (
    <div className="mt-12">
      <h2 className="font-semibold text-xl mb-4">Отзывы о компании</h2>
      <CompanyReviewForm companyId={companyId} onReviewAdded={onReviewAdded} />
      {reviewsLoading && <div className="text-gray-500">Загрузка отзывов...</div>}
      {reviewsError && <div className="text-red-600 mb-2">{reviewsError}</div>}
      {reviews.length === 0 && !reviewsLoading ? (
        <div className="text-gray-500">Пока нет отзывов</div>
      ) : (
        <ReviewsFeed reviews={reviews} />
      )}
    </div>
  );
}

export default CompanyReviewsProfileBlock;
