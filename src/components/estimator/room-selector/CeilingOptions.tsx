
import React from 'react';
import { Label } from '@/components/ui/label';
import { RoomOption } from './RoomOption';
import { RoomDetail } from '@/types/estimator';

interface CeilingOptionsProps {
  options: RoomDetail['options'];
  handleOptionChange: (option: keyof RoomDetail['options'], checked: boolean) => void;
}

export const CeilingOptions: React.FC<CeilingOptionsProps> = ({
  options,
  handleOptionChange
}) => {
  return (
    <div className="form-input-wrapper">
      <Label className="form-label">Ceiling Options</Label>
      <div className="border border-gray-200 rounded-lg p-4 space-y-3">
        <RoomOption 
          option="highCeiling" 
          checked={options.highCeiling}
          onChange={handleOptionChange}
          label="High Ceiling (+$600)"
        />
        
        <RoomOption 
          option="paintCeiling" 
          checked={options.paintCeiling}
          onChange={handleOptionChange}
          label="Paint Ceiling (+40%)"
        />
      </div>
    </div>
  );
};
