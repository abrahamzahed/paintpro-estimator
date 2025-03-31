
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ContactInfo } from '@/types/estimator';
import AddressAutocomplete from './AddressAutocomplete';
import { toast } from 'sonner';

interface ContactFormProps {
  contactInfo: ContactInfo;
  setContactInfo: React.Dispatch<React.SetStateAction<ContactInfo>>;
}

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Phone validation regex (US format)
const PHONE_REGEX = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

export const ContactForm: React.FC<ContactFormProps> = ({ contactInfo, setContactInfo }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddressChange = (value: string) => {
    setContactInfo(prev => ({ ...prev, address: value }));
    
    // Clear error when user types
    if (errors.address) {
      setErrors(prev => ({ ...prev, address: '' }));
    }
  };

  const validateField = (name: string, value: string): string => {
    if (!value.trim()) {
      return `${name} is required`;
    }
    
    if (name === 'Email' && !EMAIL_REGEX.test(value)) {
      return 'Please enter a valid email address';
    }
    
    if (name === 'Phone' && !PHONE_REGEX.test(value)) {
      return 'Please enter a valid phone number (XXX-XXX-XXXX)';
    }
    
    return '';
  };

  // Format phone number as user types
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    let formattedValue = value;
    if (value.length > 3 && value.length <= 6) {
      formattedValue = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else if (value.length > 6) {
      formattedValue = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6, 10)}`;
    }
    
    setContactInfo(prev => ({ ...prev, phone: formattedValue }));
    
    // Clear error when user types
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  // Validate all fields before form submission
  const validateAllFields = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validate each field
    const fields = [
      { name: 'Project Name', key: 'projectName', value: contactInfo.projectName },
      { name: 'Address', key: 'address', value: contactInfo.address },
      { name: 'Full Name', key: 'fullName', value: contactInfo.fullName },
      { name: 'Email', key: 'email', value: contactInfo.email },
      { name: 'Phone', key: 'phone', value: contactInfo.phone }
    ];
    
    fields.forEach(field => {
      const error = validateField(field.name, field.value);
      if (error) {
        newErrors[field.key] = error;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    // Add form validation to the parent component
    const originalNextStep = window.handleNextStep;
    
    // Expose validation function to window for the parent component
    window.handleNextStep = () => {
      if (validateAllFields()) {
        if (typeof originalNextStep === 'function') {
          originalNextStep();
        }
      } else {
        toast.error("Please correct the errors in the form");
      }
    };
    
    return () => {
      window.handleNextStep = originalNextStep;
    };
  }, [contactInfo]);

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="form-input-wrapper">
        <Label htmlFor="projectName" className="form-label after:content-['*'] after:ml-0.5 after:text-red-500">
          Project Name
        </Label>
        <Input
          id="projectName"
          name="projectName"
          className={`form-input ${errors.projectName ? 'border-red-500' : ''}`}
          value={contactInfo.projectName}
          onChange={handleChange}
          placeholder="Enter your project name"
        />
        {errors.projectName && (
          <p className="text-red-500 text-sm mt-1">{errors.projectName}</p>
        )}
      </div>

      <div className="form-input-wrapper">
        <AddressAutocomplete
          id="address"
          value={contactInfo.address}
          onChange={handleAddressChange}
          label="Address"
          placeholder="Enter your full address"
          required={true}
          error={errors.address}
        />
      </div>

      <div className="form-input-wrapper">
        <Label htmlFor="fullName" className="form-label after:content-['*'] after:ml-0.5 after:text-red-500">
          Full Name
        </Label>
        <Input
          id="fullName"
          name="fullName"
          className={`form-input ${errors.fullName ? 'border-red-500' : ''}`}
          value={contactInfo.fullName}
          onChange={handleChange}
          placeholder="Enter your full name"
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
        )}
      </div>

      <div className="form-input-wrapper">
        <Label htmlFor="email" className="form-label after:content-['*'] after:ml-0.5 after:text-red-500">
          Email Address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          className={`form-input ${errors.email ? 'border-red-500' : ''}`}
          value={contactInfo.email}
          onChange={handleChange}
          placeholder="Enter your email address"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div className="form-input-wrapper">
        <Label htmlFor="phone" className="form-label after:content-['*'] after:ml-0.5 after:text-red-500">
          Phone Number
        </Label>
        <Input
          id="phone"
          name="phone"
          className={`form-input ${errors.phone ? 'border-red-500' : ''}`}
          value={contactInfo.phone}
          onChange={handlePhoneChange}
          placeholder="XXX-XXX-XXXX"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
        )}
      </div>
    </div>
  );
};
