import { clsx } from 'clsx';
import { Star, StarHalf } from 'lucide-react';

export type RatingSize = 'sm' | 'md' | 'lg';

export interface RatingProps {
  value: number;
  showCount?: boolean;
  count?: number;
  size?: RatingSize;
  className?: string;
  onReviewCountClick?: () => void;
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

type StarType = 'full' | 'half' | 'empty';

function getStarTypes(value: number): StarType[] {
  const fullStars = Math.floor(value);
  const decimal = value - fullStars;
  const hasHalfStar = decimal >= 0.25;

  return [...Array(5)].map((_, i) => {
    if (i < fullStars) return 'full';
    if (i === fullStars && hasHalfStar) return 'half';
    return 'empty';
  });
}

export function Rating({
  value,
  showCount = false,
  count,
  size = 'md',
  className,
  onReviewCountClick,
}: RatingProps) {
  const starTypes = getStarTypes(value);

  return (
    <div className={clsx('flex items-center gap-1', className)}>
      <div className="flex items-center" data-testid="rating-stars">
        {starTypes.map((type, i) => {
          if (type === 'full') {
            return (
              <Star
                key={i}
                className={clsx(
                  sizeStyles[size],
                  'fill-yellow-400 text-yellow-400'
                )}
                data-testid="star-filled"
              />
            );
          }
          if (type === 'half') {
            return (
              <div key={i} className="relative" data-testid="star-half">
                <Star className={clsx(sizeStyles[size], 'text-gray-300')} />
                <StarHalf
                  className={clsx(
                    sizeStyles[size],
                    'fill-yellow-400 text-yellow-400 absolute top-0 left-0'
                  )}
                />
              </div>
            );
          }
          return (
            <Star
              key={i}
              className={clsx(sizeStyles[size], 'text-gray-300')}
              data-testid="star-empty"
            />
          );
        })}
      </div>
      {showCount &&
        count !== undefined &&
        (onReviewCountClick ? (
          <button
            type="button"
            onClick={onReviewCountClick}
            className={clsx(
              'text-gray-600 hover:text-blue-600 hover:underline cursor-pointer',
              textSizeStyles[size]
            )}
          >
            {value} ({count} reviews)
          </button>
        ) : (
          <span className={clsx('text-gray-600', textSizeStyles[size])}>
            {value} ({count} reviews)
          </span>
        ))}
    </div>
  );
}

export default Rating;
