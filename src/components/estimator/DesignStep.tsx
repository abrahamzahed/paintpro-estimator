
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, RefreshCw, PaintBucket } from 'lucide-react';
import { RoomSelector } from './RoomSelector';
import { RoomDetail, PricingData } from '@/types/estimator';
import { TotalCostSummary } from './TotalCostSummary';

interface DesignStepProps {
  rooms: RoomDetail[];
  pricingData: PricingData;
  onUpdateRoom: (room: RoomDetail) => void;
  onDeleteRoom: (roomId: string) => void;
  onAddRoom: () => void;
  onReset: () => void;
  onPreviousStep: () => void;
}

export const DesignStep: React.FC<DesignStepProps> = ({
  rooms,
  pricingData,
  onUpdateRoom,
  onDeleteRoom,
  onAddRoom,
  onReset,
  onPreviousStep
}) => {
  // Calculate subtotal
  const subtotal = rooms.reduce((total, room) => total + room.price, 0);
  
  // Calculate volume discount
  let volumeDiscount = 0;
  if (pricingData && subtotal > 0) {
    for (let i = pricingData.volumeDiscounts.length - 1; i >= 0; i--) {
      if (subtotal >= pricingData.volumeDiscounts[i].threshold) {
        volumeDiscount = (subtotal * pricingData.volumeDiscounts[i].discount_percentage) / 100;
        break;
      }
    }
  }
  
  // Calculate final total
  const total = subtotal - volumeDiscount;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Design Your Painting Project</h2>
        <p className="text-gray-600 mt-1">Add rooms and customize your painting needs.</p>
      </div>
      
      <div className="flex gap-3 mb-8">
        <Button 
          variant="outline" 
          className="inline-flex items-center gap-2"
          onClick={onPreviousStep}
        >
          <ChevronLeft size={18} /> Back
        </Button>
        <Button 
          variant="outline" 
          className="inline-flex items-center gap-2"
          onClick={onReset}
        >
          <RefreshCw size={18} /> Reset
        </Button>
      </div>
      
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Paint Cost Calculator</h3>
        
        <Button 
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 mb-6"
          onClick={onAddRoom}
        >
          <PaintBucket size={18} /> Add Room
        </Button>
        
        {rooms.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">No rooms added yet. Click "Add Room" to begin.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {rooms.map((room) => (
              <RoomSelector
                key={room.id}
                room={room}
                pricingData={pricingData}
                onUpdateRoom={onUpdateRoom}
                onDeleteRoom={onDeleteRoom}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Add the total cost summary when rooms exist */}
      {rooms.length > 0 && (
        <TotalCostSummary 
          subtotal={subtotal} 
          volumeDiscount={volumeDiscount} 
          total={total} 
        />
      )}
    </div>
  );
};
