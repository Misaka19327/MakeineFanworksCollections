import React from 'react';

interface IconPillProps {
  icon: React.ReactNode;
  label: string | number;
  className?: string;
}

export const IconPill: React.FC<IconPillProps> = ({ icon, label, className = '' }) => {
  return (
    <div className={`flex items-center gap-1.5 text-xs font-medium text-warm-800/70 ${className}`}>
      {icon}
      <span>{label}</span>
    </div>
  );
};