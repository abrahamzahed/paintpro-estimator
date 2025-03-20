
import React from 'react';
import { Label } from '@/components/ui/label';
import { NumberInputField } from './NumberInputField';
import { RoomDetail } from '@/types/estimator';

interface ClosetSectionProps {
  closets: RoomDetail['closets'];
  handleClosetCountChange: (type: 'walkInCount' | 'regularCount', e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ClosetSection: React.FC<ClosetSectionProps> = ({
  closets,
  handleClosetCountChange
}) => {
  return (
    <div className="form-input-wrapper">
      <Label className="form-label">Closets</Label>
      <div className="grid grid-cols-2 gap-4">
        <NumberInputField
          id="walkInClosetCount"
          label="Walk-in Closet Count"
          value={closets.walkInCount}
          onChange={(e) => handleClosetCountChange('walkInCount', e)}
        />
        <NumberInputField
          id="regularClosetCount"
          label="Regular Closet Count"
          value={closets.regularCount}
          onChange={(e) => handleClosetCountChange('regularCount', e)}
        />
      </div>
    </div>
  );
};
