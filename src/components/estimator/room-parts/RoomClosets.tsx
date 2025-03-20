
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RoomDetail } from '@/types/estimator';

interface RoomClosetsProps {
  roomId: string;
  closets: RoomDetail['closets'];
  onClosetCountChange: (type: 'walkInCount' | 'regularCount', e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RoomClosets: React.FC<RoomClosetsProps> = ({
  roomId,
  closets,
  onClosetCountChange,
}) => {
  return (
    <div className="form-input-wrapper">
      <Label className="form-label">Closets</Label>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`walkInClosetCount-${roomId}`} className="text-sm text-gray-600 mb-1 block">Walk-in Closet Count</Label>
          <Input
            id={`walkInClosetCount-${roomId}`}
            type="number"
            min="0"
            value={closets.walkInCount}
            onChange={(e) => onClosetCountChange('walkInCount', e)}
            className="form-input"
          />
        </div>
        <div>
          <Label htmlFor={`regularClosetCount-${roomId}`} className="text-sm text-gray-600 mb-1 block">Regular Closet Count</Label>
          <Input
            id={`regularClosetCount-${roomId}`}
            type="number"
            min="0"
            value={closets.regularCount}
            onChange={(e) => onClosetCountChange('regularCount', e)}
            className="form-input"
          />
        </div>
      </div>
    </div>
  );
};
