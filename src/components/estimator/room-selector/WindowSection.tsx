
import React from 'react';
import { Label } from '@/components/ui/label';
import { NumberInputField } from './NumberInputField';
import { SelectField } from './SelectField';
import { RoomDetail } from '@/types/estimator';

// Mock paint methods for window painting
const mockPaintMethods = [
  { id: 1, name: 'Spray' },
  { id: 2, name: 'Brush' },
  { id: 3, name: 'Roll' }
];

interface WindowSectionProps {
  windows: RoomDetail['windows'];
  handleWindowCountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleWindowPaintMethodChange: (value: string) => void;
}

export const WindowSection: React.FC<WindowSectionProps> = ({
  windows,
  handleWindowCountChange,
  handleWindowPaintMethodChange
}) => {
  return (
    <div className="form-input-wrapper">
      <Label className="form-label">Windows</Label>
      <div className="grid grid-cols-2 gap-4">
        <NumberInputField
          id="windowCount"
          label="Window Count"
          value={windows.count}
          onChange={handleWindowCountChange}
        />
        <div>
          <Label htmlFor="windowPaintMethod" className="text-sm text-gray-600 mb-1 block">Paint Method</Label>
          <SelectField
            label=""
            value={windows.paintMethod}
            onValueChange={handleWindowPaintMethodChange}
            options={mockPaintMethods}
            placeholder="Select method"
          />
        </div>
      </div>
    </div>
  );
};
