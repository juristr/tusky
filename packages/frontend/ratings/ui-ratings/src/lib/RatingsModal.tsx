import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Rating } from '@tusky/tusky-design';
import {
  getAllRatingsByProductId,
  UserRating,
} from '@tusky/data-access-ratings';

export interface RatingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
}

export function RatingsModal({
  isOpen,
  onClose,
  productId,
}: RatingsModalProps) {
  const [ratings, setRatings] = useState<UserRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    setError(null);
    getAllRatingsByProductId(productId)
      .then((data) => setRatings(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [isOpen, productId]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      data-testid="ratings-modal"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        data-testid="ratings-modal-backdrop"
      />
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Customer Reviews</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          {loading && (
            <div
              className="text-center py-8"
              data-testid="ratings-modal-loading"
            >
              Loading reviews...
            </div>
          )}
          {error && (
            <div
              className="text-center py-8 text-red-600"
              data-testid="ratings-modal-error"
            >
              Error: {error}
            </div>
          )}
          {!loading && !error && ratings.length === 0 && (
            <div
              className="text-center py-8 text-gray-500"
              data-testid="ratings-modal-empty"
            >
              No reviews yet
            </div>
          )}
          {!loading && !error && ratings.length > 0 && (
            <div className="space-y-4" data-testid="ratings-modal-list">
              {ratings.map((rating) => (
                <div
                  key={rating.id}
                  className="border-b pb-4 last:border-b-0"
                  data-testid="rating-item"
                >
                  <div className="flex items-center gap-2">
                    <Rating value={rating.rating} size="sm" />
                    <span className="text-sm text-gray-600">
                      {rating.rating}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-700">{rating.review}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default RatingsModal;
