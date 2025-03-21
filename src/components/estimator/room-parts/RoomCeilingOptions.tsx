
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
  const handleCheckboxChange = (option: keyof RoomDetail['options'], checked: boolean, e: React.MouseEvent) => {
    // Prevent default browser behavior
    e.preventDefault();
    onOptionChange(option, checked);
  };

  return (
    <div className="form-input-wrapper">
      <Label className="form-label">Ceiling Options</Label>
      <div className="border border-gray-200 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Checkbox 
            id={`highCeiling-${Math.random().toString(36).substring(7)}`} 
            checked={options.highCeiling}
            onCheckedChange={(checked) => onOptionChange('highCeiling', checked as boolean)}
            onClick={(e) => handleCheckboxChange('highCeiling', !options.highCeiling, e)}
          />
          <Label htmlFor="highCeiling" className="cursor-pointer" onClick={(e) => {
            e.preventDefault();
            onOptionChange('highCeiling', !options.highCeiling);
          }}>High Ceiling (+$600)</Label>
        </div>
        
        <div className="flex items-center gap-2">
          <Checkbox 
            id={`paintCeiling-${Math.random().toString(36).substring(7)}`} 
            checked={options.paintCeiling}
            onCheckedChange={(checked) => onOptionChange('paintCeiling', checked as boolean)}
            onClick={(e) => handleCheckboxChange('paintCeiling', !options.paintCeiling, e)}
          />
          <Label htmlFor="paintCeiling" className="cursor-pointer" onClick={(e) => {
            e.preventDefault();
            onOptionChange('paintCeiling', !options.paintCeiling);
          }}>Paint Ceiling (+40%)</Label>
        </div>
      </div>
    </div>
  );
};
