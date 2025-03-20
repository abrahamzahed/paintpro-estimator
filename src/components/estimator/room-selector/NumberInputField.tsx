
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NumberInputFieldProps } from './types';

export const NumberInputField: React.FC<NumberInputFieldProps> = ({
  label,
  value,
  onChange,
  min = 0,
  id
}) => {
  return (
    <div>
      <Label htmlFor={id} className="text-sm text-gray-600 mb-1 block">{label}</Label>
      <Input
        id={id}
        type="number"
        min={min}
        value={value}
        onChange={onChange}
        className="form-input"
      />
    </div>
  );
};
