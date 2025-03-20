
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { BaseboardType } from '@/types/estimator';

interface RoomBaseboardOptionsProps {
  roomId: string;
  baseboardType: BaseboardType;
  baseboardInstallationFeet: number;
  onBaseboardChange: (value: BaseboardType) => void;
  onBaseboardInstallationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RoomBaseboardOptions: React.FC<RoomBaseboardOptionsProps> = ({
  roomId,
  baseboardType,
  baseboardInstallationFeet,
  onBaseboardChange,
  onBaseboardInstallationChange,
}) => {
  return (
    <>
      <div className="form-input-wrapper">
        <Label className="form-label">Baseboard Selection</Label>
        <Select 
          value={baseboardType} 
          onValueChange={(value) => onBaseboardChange(value as BaseboardType)}
        >
          <SelectTrigger className="form-select">
            <SelectValue placeholder="Select baseboard type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="No Baseboards">No Baseboards</SelectItem>
            <SelectItem value="Brushed Baseboards">Brushed Baseboards (+25%)</SelectItem>
            <SelectItem value="Sprayed Baseboards">Sprayed Baseboards (+50%)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="form-input-wrapper">
        <Label htmlFor={`baseboardInstallation-${roomId}`} className="form-label">Baseboard Installation (LF)</Label>
        <Input
          id={`baseboardInstallation-${roomId}`}
          type="number"
          min="0"
          value={baseboardInstallationFeet}
          onChange={onBaseboardInstallationChange}
          className="form-input"
        />
      </div>
    </>
  );
};
