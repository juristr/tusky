import { useEffect, useState } from 'react';
import { Rating, RatingSize, Modal } from '@tusky/tusky-design';
import { ProductRating, IndividualRating } from '@tusky/api-types';
import {
  getRatingByProductId,
  getAllRatingsForProduct,
} from '@tusky/data-access-ratings';

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
  const [modalOpen, setModalOpen] = useState(false);
  const [allRatings, setAllRatings] = useState<IndividualRating[]>([]);
  const [loadingRatings, setLoadingRatings] = useState(false);

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

  const handleReviewsClick = async () => {
    setModalOpen(true);
    if (allRatings.length === 0) {
      setLoadingRatings(true);
      try {
        const ratings = await getAllRatingsForProduct(productId);
        setAllRatings(ratings);
      } catch {
        // Error handling - ratings stay empty
      } finally {
        setLoadingRatings(false);
      }
    }
  };

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
    <>
      <Rating
        value={rating.averageRating}
        showCount
        count={rating.totalRatings}
        size={size}
        className={className}
        onReviewsClick={handleReviewsClick}
      />
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="All Reviews"
      >
        {loadingRatings ? (
          <p className="text-gray-500">Loading reviews...</p>
        ) : allRatings.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {allRatings.map((r) => (
              <div key={r.id} className="border-b pb-3 last:border-b-0">
                <Rating value={r.value} size="sm" />
                <p className="mt-1 text-gray-700">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </>
  );
}

export default ProductRatingDisplay;
