import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-[#F0EDE6]">{label}</label>}
      <input
        className={twMerge(
          clsx(
            'w-full rounded-xl border border-[rgba(240,165,0,0.12)] bg-[#111116] px-4 py-3 text-[#F0EDE6] placeholder:text-[#4A4845] focus:border-[#F0A500] focus:outline-none transition-colors',
            { 'border-red-500': error },
            className
          )
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
