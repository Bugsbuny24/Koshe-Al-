import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'gold' | 'blue' | 'green' | 'default';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
          {
            'bg-[rgba(240,165,0,0.1)] text-[#F0A500]': variant === 'gold',
            'bg-[rgba(61,123,255,0.1)] text-[#3D7BFF]': variant === 'blue',
            'bg-[rgba(0,209,108,0.1)] text-[#00D16C]': variant === 'green',
            'bg-[rgba(255,255,255,0.05)] text-[#8A8680]': variant === 'default',
          },
          className
        )
      )}
    >
      {children}
    </span>
  );
}
