
// Email validation regex
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Validates contact information fields
 */
export const validateContactInfo = (
  fullName: string,
  email: string,
  phone: string,
  address: string,
  projectName: string
): { isValid: boolean; errorMessage?: string } => {
  if (!projectName || !fullName || !email || !phone || !address) {
    return { isValid: false, errorMessage: 'Please fill in all required fields' };
  }
  
  // Validate email format
  if (!EMAIL_REGEX.test(email)) {
    return { isValid: false, errorMessage: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

/**
 * Validates if rooms have been added to the estimate
 */
export const validateRooms = (roomsLength: number): { isValid: boolean; errorMessage?: string } => {
  if (roomsLength === 0) {
    return { isValid: false, errorMessage: 'Please add at least one room' };
  }
  
  return { isValid: true };
};
