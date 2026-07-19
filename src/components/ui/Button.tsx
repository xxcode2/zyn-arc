'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]';

    const variants = {
      default: 'bg-gradient-to-r from-cyan-600 to-blue-600 text-gray-950 hover:from-cyan-500 hover:to-blue-500 hover:shadow-[0_0_20px_rgba(95,191,255,0.4)] shadow-lg shadow-cyan-500/20',
      outline: 'border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400',
      ghost: 'text-cyan-300 hover:bg-cyan-500/10',
      destructive: 'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] shadow-lg shadow-red-500/20',
      secondary: 'bg-gray-800/50 border border-gray-700/50 text-white hover:bg-gray-700/50 hover:border-gray-600/50',
    };

    const sizes = {
      default: 'h-11 px-6 rounded-xl text-sm',
      sm: 'h-9 px-4 rounded-lg text-xs',
      lg: 'h-13 px-8 rounded-2xl text-base',
      icon: 'h-11 w-11 rounded-xl',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    )
  }
);

Button.displayName = 'Button';

export { Button };