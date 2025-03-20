
import React from 'react';
import { RoomDetail } from '@/types/estimator';
import { formatKeyName, formatPriceValue, formatPrice } from '@/hooks/estimator/formatUtils';

interface RoomCostSummaryProps {
  room: RoomDetail;
}

export const RoomCostSummary: React.FC<RoomCostSummaryProps> = ({ room }) => {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h4 className="font-medium text-lg mb-3">Cost Summary</h4>
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h5 className="font-semibold">{room.name}</h5>
          <span className="font-semibold">{formatPrice(room.price)}</span>
        </div>
        
        <div className="space-y-1 text-sm">
          {Object.entries(room.priceDetails).map(([key, value]) => {
            // Skip displaying items with zero value
            if (value === 0) return null;
            
            // Determine if this is a discount (negative value)
            const isDiscount = value < 0;
            
            return (
              <div key={key} className="flex justify-between">
                <span>{formatKeyName(key)}:</span>
                <span className={isDiscount ? 'text-green-600 font-medium' : undefined}>
                  {formatPriceValue(value)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
