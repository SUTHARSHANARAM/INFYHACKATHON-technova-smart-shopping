import React from 'react';
import { Check, Clock, PackageCheck, Truck, CheckCircle2 } from 'lucide-react';
import { OrderStatus } from '../../types';

interface OrderStatusTimelineProps {
  currentStatus: OrderStatus;
}

export const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({ currentStatus }) => {
  const steps: { status: OrderStatus; label: string; icon: React.ElementType }[] = [
    { status: 'PENDING', label: 'Order Placed', icon: Clock },
    { status: 'CONFIRMED', label: 'Confirmed', icon: Check },
    { status: 'PROCESSING', label: 'Processing', icon: PackageCheck },
    { status: 'SHIPPED', label: 'Shipped', icon: Truck },
    { status: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 },
  ];

  const statusOrder: Record<OrderStatus, number> = {
    PENDING: 0,
    CONFIRMED: 1,
    PROCESSING: 2,
    SHIPPED: 3,
    DELIVERED: 4,
  };

  const currentIndex = statusOrder[currentStatus] ?? 0;

  return (
    <div className="py-6 px-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="relative flex items-center justify-between max-w-2xl mx-auto">
        {/* Background Connection Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.status} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isCompleted
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-md'
                    : 'bg-gray-100 text-gray-400 border border-gray-300'
                } ${isCurrent ? 'scale-110 ring-emerald-200 font-bold' : ''}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-[10px] sm:text-xs mt-2 font-semibold text-center max-w-[65px] sm:max-w-[80px] leading-tight ${
                  isCompleted ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
