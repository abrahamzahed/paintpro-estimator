
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RoomDetail } from '@/types/estimator';

interface RoomCeilingOptionsProps {
  options: RoomDetail['options'];
  onOptionChange: (option: keyof RoomDetail['options'], checked: boolean) => void;
}

export const RoomCeilingOptions: React.FC<RoomCeilingOptionsProps> = ({
  options,
  onOptionChange,
}) => {
  // Generate unique IDs for the checkboxes to ensure they work independently for each room
  const highCeilingId = React.useId();
  const paintCeilingId = React.useId();
  
  return (
    <div className="form-input-wrapper">
      <Label className="form-label">Ceiling Options</Label>
      <div className="border border-gray-200 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Checkbox 
            id={highCeilingId}
            checked={options.highCeiling}
            onCheckedChange={(checked) => onOptionChange('highCeiling', checked as boolean)}
          />
          <Label htmlFor={highCeilingId} className="cursor-pointer">High Ceiling (+$600)</Label>
        </div>
        
        <div className="flex items-center gap-2">
          <Checkbox 
            id={paintCeilingId}
            checked={options.paintCeiling}
            onCheckedChange={(checked) => onOptionChange('paintCeiling', checked as boolean)}
          />
          <Label htmlFor={paintCeilingId} className="cursor-pointer">Paint Ceiling (+40%)</Label>
        </div>
      </div>
    </div>
  );
};
