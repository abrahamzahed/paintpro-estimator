
import React from 'react';
import { Label } from '@/components/ui/label';
import { RoomOption } from './RoomOption';
import { RoomDetail } from '@/types/estimator';

interface StairRailingOptionProps {
  options: RoomDetail['options'];
  handleOptionChange: (option: keyof RoomDetail['options'], checked: boolean) => void;
}

export const StairRailingOption: React.FC<StairRailingOptionProps> = ({
  options,
  handleOptionChange
}) => {
  return (
    <div className="form-input-wrapper">
      <Label className="form-label">Stair Railing</Label>
      <div className="border border-gray-200 rounded-lg p-4">
        <RoomOption 
          option="stairRailing" 
          checked={options.stairRailing}
          onChange={handleOptionChange}
          label="Staircase Railing to Paint (+$250)"
        />
      </div>
    </div>
  );
};
