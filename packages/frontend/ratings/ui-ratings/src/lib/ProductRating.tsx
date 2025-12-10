import { useState, useEffect } from 'react';
import { Rating } from '@tusky/tusky-design';
import { getRatingSummary, RatingSummary } from '@tusky/data-access-ratings';

export interface ProductRatingProps {
  productId: number;
  onReviewCountClick?: () => void;
  className?: string;
}

export function ProductRating({
  productId,
  onReviewCountClick,
  className,
}: ProductRatingProps) {
  const [ratingSummary, setRatingSummary] = useState<RatingSummary | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRatingSummary(productId)
      .then((data) => setRatingSummary(data ?? null))
      .catch(() => setRatingSummary(null))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return <div className="animate-pulse h-5 w-32 bg-gray-200 rounded" />;
  }

  if (!ratingSummary) {
    return null;
  }

  return (
    <Rating
      value={ratingSummary.rating}
      showCount
      count={ratingSummary.totalRatings}
      onReviewCountClick={onReviewCountClick}
      className={className}
    />
  );
}

export default ProductRating;
