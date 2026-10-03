import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC<{ label?: string }> = ({ label = 'Loading TechNova catalog...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <Loader2 className="w-10 h-10 text-brand-600 animate-spin mb-3" />
      <p className="text-sm font-medium text-gray-600">{label}</p>
    </div>
  );
};

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm animate-pulse flex flex-col justify-between">
      <div>
        <div className="w-full h-48 bg-gray-200 rounded-xl mb-4" />
        <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-4/5 mb-3" />
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
      </div>
      <div>
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-10 bg-gray-200 rounded-xl w-full" />
      </div>
    </div>
  );
};
