import { useEffect, useState } from 'react';
import { Rating, RatingSize } from '@tusky/tusky-design';
import {
  getRatingByProductId,
  ProductRating,
} from '@tusky/data-access-ratings';

export interface SmartRatingProps {
  productId: number;
  size?: RatingSize;
  className?: string;
}

export function SmartRating({ productId, size, className }: SmartRatingProps) {
  const [rating, setRating] = useState<ProductRating | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getRatingByProductId(productId)
      .then((data) => setRating(data ?? null))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <div className={className} data-testid="smart-rating-loading">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className={className} data-testid="smart-rating-error">
        Error loading rating
      </div>
    );
  }

  if (!rating) {
    return (
      <div className={className} data-testid="smart-rating-empty">
        No ratings yet
      </div>
    );
  }

  return (
    <Rating
      value={rating.averageRating}
      showCount
      count={rating.totalRatings}
      size={size}
      className={className}
    />
  );
}

export default SmartRating;
