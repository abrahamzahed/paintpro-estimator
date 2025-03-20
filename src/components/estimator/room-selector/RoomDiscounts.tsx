
import React from 'react';
import { Label } from '@/components/ui/label';
import { RoomOption } from './RoomOption';
import { RoomDetail } from '@/types/estimator';

interface RoomDiscountsProps {
  options: RoomDetail['options'];
  handleOptionChange: (option: keyof RoomDetail['options'], checked: boolean) => void;
  shouldDisableMillworkPriming: boolean;
}

export const RoomDiscounts: React.FC<RoomDiscountsProps> = ({
  options,
  handleOptionChange,
  shouldDisableMillworkPriming
}) => {
  return (
    <div className="form-input-wrapper">
      <Label className="form-label">Room Discounts & Options</Label>
      <div className="border border-gray-200 rounded-lg p-4 space-y-3">
        <RoomOption 
          option="emptyRoom" 
          checked={options.emptyRoom}
          onChange={handleOptionChange}
          label="Empty House (15% discount)"
        />
        
        <RoomOption 
          option="noFloorCovering" 
          checked={options.noFloorCovering}
          onChange={handleOptionChange}
          label="No Floor Covering (5% discount)"
        />
        
        <RoomOption 
          option="twoColors" 
          checked={options.twoColors}
          onChange={handleOptionChange}
          label="Walls & Ceilings: Two Different Colors (+10%)"
        />
        
        <RoomOption 
          option="millworkPriming" 
          checked={options.millworkPriming}
          onChange={handleOptionChange}
          label="Millwork/Doors Need Priming (+50%)"
          disabled={shouldDisableMillworkPriming}
        />
      </div>
    </div>
  );
};
