import { clsx } from 'clsx';
import { Star } from 'lucide-react';

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
  const stars = [...Array(5)].map((_, i) => i < Math.floor(value));

  return (
    <div className={clsx('flex items-center gap-1', className)}>
      <div className="flex items-center" data-testid="rating-stars">
        {stars.map((filled, i) => (
          <Star
            key={i}
            className={clsx(
              sizeStyles[size],
              filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            )}
            data-testid={filled ? 'star-filled' : 'star-empty'}
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
