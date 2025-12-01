import { clsx } from 'clsx';
import { type ReactNode } from 'react';

export type BadgeVariant = 'sale' | 'discount' | 'info';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  sale: 'bg-red-500 text-white',
  discount: 'bg-transparent text-green-600 font-semibold',
  info: 'bg-gray-100 text-gray-700',
};

export function Badge({ variant = 'info', children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-block px-2 py-1 text-xs font-semibold rounded',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
