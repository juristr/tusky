import { clsx } from 'clsx';
import { type ReactNode, type ButtonHTMLAttributes } from 'react';

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label?: string;
  active?: boolean;
}

export function IconButton({
  icon,
  label,
  active = false,
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={clsx(
        'flex items-center gap-2 transition-colors',
        label
          ? 'text-gray-600 hover:text-gray-900'
          : 'bg-white p-1.5 rounded-full shadow-sm hover:bg-gray-100',
        active && 'text-red-500',
        className
      )}
      {...props}
    >
      <span className={clsx(label ? 'w-5 h-5' : '')}>{icon}</span>
      {label && <span className="text-sm">{label}</span>}
    </button>
  );
}

export default IconButton;
