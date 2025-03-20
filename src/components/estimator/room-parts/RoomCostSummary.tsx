
import React from 'react';
import { RoomDetail } from '@/types/estimator';

interface RoomCostSummaryProps {
  room: RoomDetail;
}

export const RoomCostSummary: React.FC<RoomCostSummaryProps> = ({ room }) => {
  const formatKey = (key: string) => {
    if (key === 'basePrice') return 'Base Price';
    if (key === 'paintUpcharge') return 'Paint Upcharge';
    if (key === 'baseboardUpcharge') return 'Baseboards';
    if (key === 'highCeiling') return 'High Ceiling';
    if (key === 'twoColors') return 'Two-Color';
    if (key === 'millworkPriming') return 'Millwork Priming';
    if (key === 'closets') return 'Closets';
    if (key === 'fireplace') return 'Fireplace';
    if (key === 'stairRailing') return 'Stair Railing';
    if (key === 'repairs') return 'Repairs';
    if (key === 'baseboardInstall') return 'Baseboard Install';
    if (key === 'emptyRoomDiscount') return 'Empty Room Discount';
    if (key === 'noFloorCoveringDiscount') return 'No Floor Covering Discount';
    
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h4 className="font-medium text-lg mb-3">Cost Summary</h4>
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h5 className="font-semibold">{room.name}</h5>
          <span className="font-semibold">${room.price.toFixed(2)}</span>
        </div>
        
        <div className="space-y-1 text-sm">
          {Object.entries(room.priceDetails).map(([key, value]) => {
            // Skip displaying items with zero value
            if (value === 0) return null;
            
            // Format negative values as discounts in green
            const isDiscount = value < 0;
            const formattedValue = `${isDiscount ? '-' : '+'}$${Math.abs(value).toFixed(2)}`;
            
            return (
              <div key={key} className="flex justify-between">
                <span>{formatKey(key)}:</span>
                <span className={isDiscount ? 'text-green-600 font-medium' : undefined}>
                  {formattedValue}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
