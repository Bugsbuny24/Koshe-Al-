import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-bg-deep border border-white/10 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500',
              'focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/30',
              'transition-all duration-200 text-sm',
              icon && 'pl-10',
              error && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
