
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RoomOptionProps } from './types';

export const RoomOption: React.FC<RoomOptionProps> = ({
  option,
  checked,
  onChange,
  label,
  disabled = false
}) => {
  return (
    <div className="flex items-center gap-2">
      <Checkbox 
        id={option} 
        checked={checked}
        onCheckedChange={(checked) => onChange(option, checked as boolean)}
        disabled={disabled}
        className={disabled ? "opacity-50" : ""}
      />
      <Label 
        htmlFor={option} 
        className={`cursor-pointer ${disabled ? "text-gray-400" : ""}`}
      >
        {label}
      </Label>
    </div>
  );
};
