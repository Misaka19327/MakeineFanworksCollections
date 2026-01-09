import React from 'react';

export interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
}

export const Select: React.FC<SelectProps> = ({ options, className = '', children, ...rest }) => {
  const base = 'w-full h-10 px-3 rounded-lg border border-warm-200 dark:border-warm-700 bg-white dark:bg-warm-900 text-warm-900 dark:text-warm-100 focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-600';
  return (
    <select className={`${base} ${className}`} {...rest}>
      {children}
      {options.map((opt) => (
        <option key={String(opt.value)} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
};

export default Select;
