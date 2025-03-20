
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { SelectFieldProps } from './types';

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onValueChange,
  options,
  placeholder = "Select option",
  disabled = false
}) => {
  return (
    <div className="form-input-wrapper">
      <Label className="form-label">{label}</Label>
      <Select 
        value={value} 
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger className="form-select">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.id} value={typeof option.name === 'string' ? option.name : String(option.id)}>
              {option.name}
              {option.cost !== undefined && option.cost > 0 && ` (+$${option.cost})`}
              {option.upcharge_percentage !== undefined && option.upcharge_amount !== undefined && 
               option.upcharge_percentage === 0 && option.upcharge_amount === 0 ? 
                ' (no upcharge)' : 
                option.upcharge_percentage !== undefined && option.upcharge_amount !== undefined && 
                option.upcharge_percentage > 0 && option.upcharge_amount > 0 ? 
                  ` (+${option.upcharge_percentage}%) (+$${option.upcharge_amount.toFixed(2)})` :
                  option.upcharge_percentage !== undefined && option.upcharge_percentage > 0 ? 
                    ` (+${option.upcharge_percentage}%)` : 
                    option.upcharge_amount !== undefined && option.upcharge_amount > 0 ?
                      ` (+$${option.upcharge_amount.toFixed(2)})` : ''
              }
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
