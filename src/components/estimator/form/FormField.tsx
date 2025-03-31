
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  error,
  type = 'text',
  placeholder,
  required = true
}) => {
  return (
    <div className="form-input-wrapper">
      <Label 
        htmlFor={id} 
        className={required ? "form-label after:content-['*'] after:ml-0.5 after:text-red-500" : "form-label"}
      >
        {label}
      </Label>
      <Input
        id={id}
        name={name}
        type={type}
        className={`form-input ${error ? 'border-red-500' : ''}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};
