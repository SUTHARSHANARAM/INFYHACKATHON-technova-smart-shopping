import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = 'Loading Admin SaaS Data...',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <Loader2 className={`${sizeClasses[size]} text-sky-500 animate-spin mb-3`} />
      {label && <p className="text-xs font-semibold text-slate-400">{label}</p>}
    </div>
  );
};
