
import React from 'react';
import { formatPrice } from '@/hooks/estimator/formatUtils';

interface TotalCostSummaryProps {
  subtotal: number;
  volumeDiscount: number;
  total: number;
}

export const TotalCostSummary: React.FC<TotalCostSummaryProps> = ({
  subtotal,
  volumeDiscount,
  total
}) => {
  return (
    <div className="bg-blue-50 rounded-lg border border-blue-100 p-6 mb-8">
      <h3 className="text-xl font-semibold mb-5">Cost Summary</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center pb-3">
          <span className="font-medium">Subtotal (before volume discount)</span>
          <span className="font-semibold">{formatPrice(subtotal)}</span>
        </div>
        
        {volumeDiscount > 0 && (
          <div className="flex justify-between items-center pb-3 text-green-600">
            <span className="font-medium">Volume Discount</span>
            <span className="font-semibold">-{formatPrice(volumeDiscount)}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center pt-3 border-t border-blue-200">
          <span className="text-lg font-bold">Total Estimate</span>
          <span className="text-xl font-bold text-blue-600">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
};
