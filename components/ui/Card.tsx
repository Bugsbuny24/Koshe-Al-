import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: 'blue' | 'green' | 'gold' | 'none';
  hover?: boolean;
}

export function Card({ className, glow = 'none', hover = false, children, ...props }: CardProps) {
  const glows = {
    blue: 'border-accent-blue/20 shadow-accent-blue/10',
    green: 'border-accent-green/20 shadow-accent-green/10',
    gold: 'border-pi-gold/20 shadow-pi-gold/10',
    none: 'border-white/5',
  };

  return (
    <div
      className={cn(
        'bg-bg-card border rounded-xl shadow-lg',
        glows[glow],
        hover && 'hover:bg-bg-card-hover hover:border-accent-blue/30 transition-all duration-200 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
