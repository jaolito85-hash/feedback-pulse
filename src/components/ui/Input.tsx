import { cn } from '@/lib/utils';
import React from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-10 w-full rounded-md border border-[#2a2a3a] bg-[#1a1a24] px-3 py-2 text-sm text-white ring-offset-[#0a0a0f] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#6b6b80] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";

export { Input };
