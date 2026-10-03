import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  maxStock: number;
  onChange: (newQty: number) => void;
  disabled?: boolean;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  maxStock,
  onChange,
  disabled = false,
}) => {
  const handleDecrement = () => {
    if (quantity > 1) onChange(quantity - 1);
  };

  const handleIncrement = () => {
    if (quantity < maxStock) onChange(quantity + 1);
  };

  return (
    <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || quantity <= 1}
        className="p-2 text-gray-600 hover:text-brand-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="w-10 text-center font-semibold text-gray-900 text-sm">
        {quantity}
      </span>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || quantity >= maxStock}
        className="p-2 text-gray-600 hover:text-brand-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};
