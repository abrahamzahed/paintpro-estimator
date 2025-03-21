
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
  // Prevent default checkbox behavior that might cause page jumps
  const handleCheckboxChange = (option: keyof RoomDetail['options'], checked: boolean) => {
    // Prevent default browser behavior
    onOptionChange(option, checked);
  };

  return (
    <div className="form-input-wrapper">
      <Label className="form-label">Ceiling Options</Label>
      <div className="border border-gray-200 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Checkbox 
            id="highCeiling" 
            checked={options.highCeiling}
            onCheckedChange={(checked) => handleCheckboxChange('highCeiling', checked as boolean)}
          />
          <Label htmlFor="highCeiling" className="cursor-pointer">High Ceiling (+$600)</Label>
        </div>
        
        <div className="flex items-center gap-2">
          <Checkbox 
            id="paintCeiling" 
            checked={options.paintCeiling}
            onCheckedChange={(checked) => handleCheckboxChange('paintCeiling', checked as boolean)}
          />
          <Label htmlFor="paintCeiling" className="cursor-pointer">Paint Ceiling (+40%)</Label>
        </div>
      </div>
    </div>
  );
};
