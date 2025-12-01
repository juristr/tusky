import { clsx } from 'clsx';

export type PriceSize = 'sm' | 'md' | 'lg';

export interface PriceProps {
  price: number;
  originalPrice?: number;
  showDiscount?: boolean;
  size?: PriceSize;
  className?: string;
}

const sizeStyles: Record<PriceSize, { price: string; original: string }> = {
  sm: { price: 'text-base font-bold', original: 'text-sm' },
  md: { price: 'text-xl font-bold', original: 'text-base' },
  lg: { price: 'text-3xl font-bold', original: 'text-xl' },
};

export function Price({
  price,
  originalPrice,
  showDiscount = false,
  size = 'md',
  className,
}: PriceProps) {
  const isOnSale = originalPrice !== undefined && originalPrice > price;
  const discount = isOnSale
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div
      className={clsx('flex items-baseline gap-2 flex-wrap', className)}
      data-testid="price-container"
    >
      <span
        className={clsx('text-gray-900', sizeStyles[size].price)}
        data-testid="current-price"
      >
        ${price.toFixed(2)}
      </span>
      {isOnSale && (
        <>
          <span
            className={clsx(
              'text-gray-500 line-through',
              sizeStyles[size].original
            )}
            data-testid="original-price"
          >
            ${originalPrice.toFixed(2)}
          </span>
          {showDiscount && (
            <span
              className="text-sm font-semibold text-green-600"
              data-testid="discount-badge"
            >
              {discount}% off
            </span>
          )}
        </>
      )}
    </div>
  );
}

export default Price;
