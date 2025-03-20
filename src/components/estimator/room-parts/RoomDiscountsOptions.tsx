
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RoomDetail } from '@/types/estimator';

interface RoomDiscountsOptionsProps {
  roomId: string;
  options: RoomDetail['options'];
  shouldDisableMillworkPriming: boolean;
  onOptionChange: (option: keyof RoomDetail['options'], checked: boolean) => void;
}

export const RoomDiscountsOptions: React.FC<RoomDiscountsOptionsProps> = ({
  roomId,
  options,
  shouldDisableMillworkPriming,
  onOptionChange,
}) => {
  return (
    <div className="form-input-wrapper">
      <Label className="form-label">Room Discounts & Options</Label>
      <div className="border border-gray-200 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Checkbox 
            id={`emptyRoom-${roomId}`}
            checked={options.emptyRoom}
            onCheckedChange={(checked) => onOptionChange('emptyRoom', checked as boolean)}
          />
          <Label htmlFor={`emptyRoom-${roomId}`} className="cursor-pointer">Empty Room (15% discount)</Label>
        </div>
        
        <div className="flex items-center gap-2">
          <Checkbox 
            id={`noFloorCovering-${roomId}`}
            checked={options.noFloorCovering}
            onCheckedChange={(checked) => onOptionChange('noFloorCovering', checked as boolean)}
          />
          <Label htmlFor={`noFloorCovering-${roomId}`} className="cursor-pointer">No Floor Covering (5% discount)</Label>
        </div>
        
        <div className="flex items-center gap-2">
          <Checkbox 
            id={`twoColors-${roomId}`}
            checked={options.twoColors}
            onCheckedChange={(checked) => onOptionChange('twoColors', checked as boolean)}
          />
          <Label htmlFor={`twoColors-${roomId}`} className="cursor-pointer">Walls & Ceilings: Two Different Colors (+10%)</Label>
        </div>
        
        <div className="flex items-center gap-2">
          <Checkbox 
            id={`millworkPriming-${roomId}`}
            checked={options.millworkPriming}
            disabled={shouldDisableMillworkPriming}
            onCheckedChange={(checked) => onOptionChange('millworkPriming', checked as boolean)}
            className={shouldDisableMillworkPriming ? "opacity-50" : ""}
          />
          <Label 
            htmlFor={`millworkPriming-${roomId}`}
            className={`cursor-pointer ${shouldDisableMillworkPriming ? "text-gray-400" : ""}`}
          >
            Millwork/Doors Need Priming (+50%)
          </Label>
        </div>
      </div>
    </div>
  );
};
