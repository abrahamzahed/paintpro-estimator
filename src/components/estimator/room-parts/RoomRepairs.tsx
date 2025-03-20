
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { mockRepairOptions } from '../constants/roomOptions';

interface RoomRepairsProps {
  repairs: string;
  onRepairsChange: (value: string) => void;
}

export const RoomRepairs: React.FC<RoomRepairsProps> = ({
  repairs,
  onRepairsChange,
}) => {
  return (
    <div className="form-input-wrapper">
      <Label className="form-label">Repairs</Label>
      <Select 
        value={repairs} 
        onValueChange={onRepairsChange}
      >
        <SelectTrigger className="form-select">
          <SelectValue placeholder="Select repair option" />
        </SelectTrigger>
        <SelectContent>
          {mockRepairOptions.map((option) => (
            <SelectItem key={option.id} value={option.name}>
              {option.name} {option.cost > 0 && `(+$${option.cost})`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
