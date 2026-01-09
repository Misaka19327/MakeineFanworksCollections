import React from 'react';

export const PageTransition: React.FC<{ children: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...rest }) => {
  return (
    <div className={`animate-page-enter ${className}`} {...rest}>
      {children}
    </div>
  );
};

export default PageTransition;
