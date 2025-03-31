
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ContactInfo } from '@/types/estimator';
import { validateAllFields } from './validationUtils';

export const useContactForm = (
  contactInfo: ContactInfo,
  setContactInfo: React.Dispatch<React.SetStateAction<ContactInfo>>
) => {
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

  const validateForm = (): boolean => {
    const { isValid, errors: newErrors } = validateAllFields(
      contactInfo.projectName,
      contactInfo.address,
      contactInfo.fullName,
      contactInfo.email,
      contactInfo.phone
    );
    
    setErrors(newErrors);
    
    if (!isValid) {
      toast.error("Please correct the errors in the form");
    }
    
    return isValid;
  };

  useEffect(() => {
    // Add form validation to the parent component
    const originalNextStep = window.handleNextStep;
    
    // Expose validation function to window for the parent component
    window.handleNextStep = () => {
      if (validateForm()) {
        if (typeof originalNextStep === 'function') {
          originalNextStep();
        }
      }
    };
    
    return () => {
      window.handleNextStep = originalNextStep;
    };
  }, [contactInfo]);

  return {
    errors,
    handleChange,
    handleAddressChange,
    handlePhoneChange
  };
};
