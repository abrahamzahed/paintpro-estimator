
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RoomDetail } from '@/types/estimator';
import { mockFireplaceOptions } from '../constants/roomOptions';

interface RoomFireplaceStairProps {
  roomId: string;
  fireplace: string;
  options: RoomDetail['options'];
  onFireplaceChange: (value: string) => void;
  onOptionChange: (option: keyof RoomDetail['options'], checked: boolean) => void;
}

export const RoomFireplaceStair: React.FC<RoomFireplaceStairProps> = ({
  roomId,
  fireplace,
  options,
  onFireplaceChange,
  onOptionChange,
}) => {
  return (
    <>
      <div className="form-input-wrapper">
        <Label className="form-label">Fireplace Mantel</Label>
        <Select 
          value={fireplace} 
          onValueChange={onFireplaceChange}
        >
          <SelectTrigger className="form-select">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            {mockFireplaceOptions.map((option) => (
              <SelectItem key={option.id} value={option.name}>
                {option.name} {option.cost > 0 && `(+$${option.cost})`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="form-input-wrapper">
        <Label className="form-label">Stair Railing</Label>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Checkbox 
              id={`stairRailing-${roomId}`}
              checked={options.stairRailing}
              onCheckedChange={(checked) => onOptionChange('stairRailing', checked as boolean)}
            />
            <Label htmlFor={`stairRailing-${roomId}`} className="cursor-pointer">Staircase Railing to Paint (+$250)</Label>
          </div>
        </div>
      </div>
    </>
  );
};
