
import { useState } from 'react';
import { ContactInfo } from '@/types/estimator';

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const useContactInfo = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    projectName: '',
  });

  const validateContactInfo = () => {
    if (!contactInfo.projectName || !contactInfo.fullName || !contactInfo.email || !contactInfo.phone || !contactInfo.address) {
      return false;
    }
    
    // Validate email format
    if (!EMAIL_REGEX.test(contactInfo.email)) {
      return false;
    }
    
    return true;
  };

  return {
    contactInfo,
    setContactInfo,
    validateContactInfo,
  };
};
