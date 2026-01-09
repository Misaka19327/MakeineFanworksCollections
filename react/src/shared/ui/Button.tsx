import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
}

const base = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed';
const variants: Record<Variant, string> = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600',
  secondary: 'bg-warm-100 text-warm-800 hover:bg-warm-200 dark:bg-warm-800 dark:text-warm-100 dark:hover:bg-warm-700',
  ghost: 'bg-transparent text-warm-800 hover:bg-warm-100 dark:text-warm-100 dark:hover:bg-warm-800',
};
const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  icon: 'h-10 w-10',
};

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', icon, className = '', children, ...rest }) => {
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {icon && <span className="mr-2 inline-flex items-center">{icon}</span>}
      {children}
    </button>
  );
};
