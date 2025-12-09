import { useState, useEffect } from 'react';
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
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchRating() {
      setLoading(true);
      setError(false);
      try {
        const data = await getRatingByProductId(productId);
        if (!cancelled) {
          setRating(data ?? null);
        }
      } catch {
        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchRating();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  // Skeleton loading state
  if (loading) {
    return (
      <div className={className}>
        <div className="flex items-center gap-1 animate-pulse">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-5 h-5 bg-gray-200 rounded" />
            ))}
          </div>
          <div className="w-20 h-4 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  // Hide on error (graceful degradation)
  if (error || !rating) {
    return null;
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
