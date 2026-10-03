import React from 'react';
import { ArrowUpDown } from 'lucide-react';

interface SortingSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const SortingSelect: React.FC<SortingSelectProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:inline">Sort:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white border border-gray-200 text-gray-800 text-xs sm:text-sm font-medium py-2 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
      >
        <option value="">Default (Featured)</option>
        <option value="price-asc">Price: Low → High</option>
        <option value="price-desc">Price: High → Low</option>
        <option value="rating">Highest Rated</option>
        <option value="popular">Most Popular</option>
        <option value="discount">Biggest Discount</option>
        <option value="newest">Newest Arrivals</option>
      </select>
    </div>
  );
};
