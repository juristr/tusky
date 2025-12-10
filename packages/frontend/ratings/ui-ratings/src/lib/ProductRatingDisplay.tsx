import { useEffect, useState } from 'react';
import { Rating, RatingSize } from '@tusky/tusky-design';
import { ProductRating } from '@tusky/api-types';
import { getRatingByProductId } from '@tusky/data-access-ratings';

export interface ProductRatingDisplayProps {
  productId: number;
  size?: RatingSize;
  className?: string;
}

export function ProductRatingDisplay({
  productId,
  size = 'md',
  className,
}: ProductRatingDisplayProps) {
  const [rating, setRating] = useState<ProductRating | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchRating() {
      setLoading(true);
      setError(null);
      try {
        const data = await getRatingByProductId(productId);
        if (!cancelled) {
          setRating(data ?? null);
        }
      } catch (err) {
        if (!cancelled) {
          setError('Failed to load rating');
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

  if (loading) {
    return (
      <div className={className}>
        <Rating value={0} showCount count={0} size={size} />
      </div>
    );
  }

  if (error || !rating) {
    return (
      <div className={className}>
        <Rating value={0} showCount count={0} size={size} />
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

export default ProductRatingDisplay;
