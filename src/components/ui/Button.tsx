import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { ButtonVariant, ButtonSize } from '../../types';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles =
      'inline-flex items-center justify-center font-medium tracking-tight rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed select-none whitespace-nowrap cursor-pointer';

    // Size variants
    const sizeStyles = {
      sm: 'text-xs px-3.5 py-2 gap-1.5 font-medium',
      md: 'text-sm px-5 py-2.5 gap-2 font-semibold',
      lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold',
    };

    // Visual variants
    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        'bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-md shadow-blue-600/25 border border-blue-500/30 hover:from-blue-500 hover:to-blue-600 hover:shadow-lg hover:shadow-blue-600/35 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm focus-visible:ring-blue-500 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none',
      secondary:
        'bg-white/80 backdrop-blur-md text-blue-900 border border-blue-200/80 shadow-xs hover:bg-blue-50/80 hover:border-blue-300 hover:text-blue-700 hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-blue-400 disabled:opacity-50 disabled:hover:translate-y-0',
      glass:
        'bg-white/60 backdrop-blur-xl text-slate-800 border border-white/90 shadow-sm hover:bg-white/90 hover:border-blue-200 hover:text-blue-600 hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-blue-400 disabled:opacity-50',
      ghost:
        'bg-transparent text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 active:bg-blue-100/60 focus-visible:ring-blue-400 disabled:opacity-50',
      danger:
        'bg-red-600 text-white shadow-sm hover:bg-red-500 hover:shadow-red-600/20 active:bg-red-700 focus-visible:ring-red-500 disabled:opacity-50',
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
        {...props}
      >
        {isLoading && (
          <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
        )}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5">
            {rightIcon}
          </span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
