import React from 'react';
import { RoomDetail } from '@/types/estimator';
import { formatKeyName, formatPriceValue, formatPrice } from '@/hooks/estimator/formatUtils';

interface RoomDetailCardProps {
  room: RoomDetail;
  index: number;
}

export const RoomDetailCard: React.FC<RoomDetailCardProps> = ({ room, index }) => {
  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
      <div className="flex justify-between items-start mb-3">
        <h5 className="text-lg font-medium">{room.name} (Room {index + 1})</h5>
        <span className="text-lg font-semibold">{formatPrice(room.price)}</span>
      </div>
      
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-3">
        <div>
          <p className="text-sm text-gray-600">Size:</p>
          <p>{room.size.size}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Paint Type:</p>
          <p>{room.paintType.name}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Ceiling:</p>
          <p>{room.options.highCeiling ? 'High ceiling' : 'Standard'}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Wall Colors:</p>
          <p>{room.options.twoColors ? 'Two colors' : 'Single color'}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Closets:</p>
          <p>{room.closets.walkInCount} walk-in, {room.closets.regularCount} regular</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Doors:</p>
          <p>{room.doors.count} doors</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Windows:</p>
          <p>{room.windows.count} windows</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Fireplace:</p>
          <p>{room.fireplace}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Repairs:</p>
          <p>{room.repairs}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Stair Railing:</p>
          <p>{room.options.stairRailing ? 'Included' : 'Not included'}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Baseboards:</p>
          <p>{room.baseboardType}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Baseboard Installation:</p>
          <p>{room.baseboardInstallationFeet > 0 ? `${room.baseboardInstallationFeet} linear feet` : 'None'}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Millwork Priming:</p>
          <p>{room.options.millworkPriming ? 'Included' : 'Not needed'}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Empty Room:</p>
          <p>{room.options.emptyRoom ? 'Yes (Discounted)' : 'No'}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">No Floor Covering:</p>
          <p>{room.options.noFloorCovering ? 'Yes (Discounted)' : 'No'}</p>
        </div>
      </div>
      
      <div className="mt-5 pt-4 border-t border-gray-200">
        <h6 className="font-medium mb-2">Price Breakdown:</h6>
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
