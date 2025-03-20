
import React from 'react';
import { Label } from '@/components/ui/label';
import { NumberInputField } from './NumberInputField';
import { SelectField } from './SelectField';
import { RoomDetail } from '@/types/estimator';

// Mock paint methods for door painting
const mockPaintMethods = [
  { id: 1, name: 'Spray' },
  { id: 2, name: 'Brush' },
  { id: 3, name: 'Roll' }
];

interface DoorSectionProps {
  doors: RoomDetail['doors'];
  handleDoorCountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDoorPaintMethodChange: (value: string) => void;
}

export const DoorSection: React.FC<DoorSectionProps> = ({
  doors,
  handleDoorCountChange,
  handleDoorPaintMethodChange
}) => {
  return (
    <div className="form-input-wrapper">
      <Label className="form-label">Door Painting</Label>
      <div className="grid grid-cols-2 gap-4">
        <NumberInputField
          id="doorCount"
          label="Door Count"
          value={doors.count}
          onChange={handleDoorCountChange}
        />
        <div>
          <Label htmlFor="doorPaintMethod" className="text-sm text-gray-600 mb-1 block">Paint Method</Label>
          <SelectField
            label=""
            value={doors.paintMethod}
            onValueChange={handleDoorPaintMethodChange}
            options={mockPaintMethods}
            placeholder="Select method"
          />
        </div>
      </div>
    </div>
  );
};
