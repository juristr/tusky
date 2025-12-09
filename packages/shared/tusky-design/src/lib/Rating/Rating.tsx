import { clsx } from 'clsx';
import { Star, StarHalf } from 'lucide-react';

export type RatingSize = 'sm' | 'md' | 'lg';

export interface RatingProps {
  value: number;
  showCount?: boolean;
  count?: number;
  size?: RatingSize;
  className?: string;
}

const sizeStyles: Record<RatingSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const textSizeStyles: Record<RatingSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export function Rating({
  value,
  showCount = false,
  count,
  size = 'md',
  className,
}: RatingProps) {
  const fullStars = Math.floor(value);
  const hasHalfStar = value - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={clsx('flex items-center gap-1', className)}>
      <div className="flex items-center" data-testid="rating-stars">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            className={clsx(
              sizeStyles[size],
              'fill-yellow-400 text-yellow-400'
            )}
            data-testid="star-filled"
          />
        ))}
        {hasHalfStar && (
          <StarHalf
            key="half"
            className={clsx(
              sizeStyles[size],
              'fill-yellow-400 text-yellow-400'
            )}
            data-testid="star-half"
          />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={clsx(sizeStyles[size], 'text-gray-300')}
            data-testid="star-empty"
          />
        ))}
      </div>
      {showCount && count !== undefined && (
        <span className={clsx('text-gray-600', textSizeStyles[size])}>
          {value} ({count} reviews)
        </span>
      )}
    </div>
  );
}

export default Rating;
