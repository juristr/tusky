import { X } from 'lucide-react';
import { Rating } from '@tusky/tusky-design';
import { UserRating } from '@tusky/api-types';

export interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviews: UserRating[];
  productName?: string;
}

export function ReviewsModal({
  isOpen,
  onClose,
  reviews,
  productName,
}: ReviewsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {productName ? `Reviews for ${productName}` : 'Customer Reviews'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-4">
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No reviews yet.</p>
          ) : (
            <ul className="space-y-4">
              {reviews.map((review, index) => (
                <li
                  key={index}
                  className="border-b border-gray-100 pb-4 last:border-0"
                >
                  <Rating value={review.rating} size="sm" />
                  <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReviewsModal;
