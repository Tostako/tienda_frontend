import { cn } from '../../lib/utils';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-montserrat font-medium transition-all duration-300 cursor-pointer',
          {
            'bg-luxe-black text-white hover:bg-luxe-blue': variant === 'primary',
            'bg-luxe-blue text-white hover:bg-luxe-black': variant === 'secondary',
            'border-2 border-luxe-black text-luxe-black hover:bg-luxe-black hover:text-white': variant === 'outline',
            'text-luxe-black hover:text-luxe-blue': variant === 'ghost',
            'px-4 py-2 text-sm': size === 'sm',
            'px-6 py-3 text-sm tracking-wide uppercase': size === 'md',
            'px-8 py-4 text-base tracking-wide uppercase': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
