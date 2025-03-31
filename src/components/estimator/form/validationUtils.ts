
// Email validation regex
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Phone validation regex (US format)
export const PHONE_REGEX = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

export const validateField = (name: string, value: string): string => {
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

export const validateAllFields = (
  projectName: string,
  address: string,
  fullName: string,
  email: string,
  phone: string
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  // Validate each field
  const fields = [
    { name: 'Project Name', key: 'projectName', value: projectName },
    { name: 'Address', key: 'address', value: address },
    { name: 'Full Name', key: 'fullName', value: fullName },
    { name: 'Email', key: 'email', value: email },
    { name: 'Phone', key: 'phone', value: phone }
  ];
  
  fields.forEach(field => {
    const error = validateField(field.name, field.value);
    if (error) {
      errors[field.key] = error;
    }
  });
  
  return { isValid: Object.keys(errors).length === 0, errors };
};
