import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className = '', ...rest }) => {
  const base = 'w-full h-10 px-3 rounded-lg border border-warm-200 dark:border-warm-700 bg-white dark:bg-warm-900 text-warm-900 dark:text-warm-100 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-600';
  return <input className={`${base} ${className}`} {...rest} />;
};

export default Input;
