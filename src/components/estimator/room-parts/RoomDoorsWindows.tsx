
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RoomDetail } from '@/types/estimator';
import { mockPaintMethods } from '../constants/roomOptions';

interface RoomDoorsWindowsProps {
  roomId: string;
  doors: RoomDetail['doors'];
  windows: RoomDetail['windows'];
  onDoorCountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDoorPaintMethodChange: (value: string) => void;
  onWindowCountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onWindowPaintMethodChange: (value: string) => void;
}

export const RoomDoorsWindows: React.FC<RoomDoorsWindowsProps> = ({
  roomId,
  doors,
  windows,
  onDoorCountChange,
  onDoorPaintMethodChange,
  onWindowCountChange,
  onWindowPaintMethodChange,
}) => {
  return (
    <>
      <div className="form-input-wrapper">
        <Label className="form-label">Door Painting</Label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`doorCount-${roomId}`} className="text-sm text-gray-600 mb-1 block">Door Count</Label>
            <Input
              id={`doorCount-${roomId}`}
              type="number"
              min="0"
              value={doors.count}
              onChange={onDoorCountChange}
              className="form-input"
              autoSelectOnFocus={true}
              integerOnly={true}
            />
          </div>
          <div>
            <Label htmlFor={`doorPaintMethod-${roomId}`} className="text-sm text-gray-600 mb-1 block">Paint Method</Label>
            <Select 
              value={doors.paintMethod} 
              onValueChange={onDoorPaintMethodChange}
            >
              <SelectTrigger className="form-select">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                {mockPaintMethods.map((method) => (
                  <SelectItem key={method.id} value={method.name}>
                    {method.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="form-input-wrapper">
        <Label className="form-label">Windows</Label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`windowCount-${roomId}`} className="text-sm text-gray-600 mb-1 block">Window Count</Label>
            <Input
              id={`windowCount-${roomId}`}
              type="number"
              min="0"
              value={windows.count}
              onChange={onWindowCountChange}
              className="form-input"
              autoSelectOnFocus={true}
              integerOnly={true}
            />
          </div>
          <div>
            <Label htmlFor={`windowPaintMethod-${roomId}`} className="text-sm text-gray-600 mb-1 block">Paint Method</Label>
            <Select 
              value={windows.paintMethod} 
              onValueChange={onWindowPaintMethodChange}
            >
              <SelectTrigger className="form-select">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                {mockPaintMethods.map((method) => (
                  <SelectItem key={method.id} value={method.name}>
                    {method.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </>
  );
};
