import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          'rounded-2xl border border-[rgba(240,165,0,0.12)] bg-[#111116] p-6',
          { 'hover:bg-[#16161E] hover:border-[rgba(240,165,0,0.35)] transition-all cursor-pointer': hover },
          className
        )
      )}
    >
      {children}
    </div>
  );
}
