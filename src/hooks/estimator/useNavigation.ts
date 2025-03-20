
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

// Add this to the global Window interface
declare global {
  interface Window {
    handleNextStep?: () => void;
  }
}

export const useNavigation = (validateContactInfo: () => boolean, roomsCount: number) => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => {
    // This function can be overridden by the ContactForm component
    if (window.handleNextStep) {
      window.handleNextStep();
      return;
    }
    
    // Default validation for step 1 (fallback)
    if (currentStep === 1) {
      // Validate contact info
      if (!validateContactInfo()) {
        toast.error('Please fill in all required fields correctly');
        return;
      }
    } else if (currentStep === 2) {
      // Validate that there's at least one room
      if (roomsCount === 0) {
        toast.error('Please add at least one room');
        return;
      }
    }
    
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  return {
    currentStep,
    setCurrentStep,
    handleNextStep,
    handlePreviousStep,
  };
};
