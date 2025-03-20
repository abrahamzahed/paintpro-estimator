
import { ContactInfo, RoomDetail } from "@/types/estimator";
import { validateContactInfo, validateRooms } from "./validationUtils";
import { toast } from "sonner";

interface NavigationProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  contactInfo: ContactInfo;
  rooms: RoomDetail[];
  setRooms: (rooms: RoomDetail[]) => void;
  loadRoomsFromStorage: () => RoomDetail[] | null;
  saveEstimatorDataToStorage: (rooms: RoomDetail[], contactInfo: ContactInfo) => void;
}

export const handleEstimatorSteps = ({
  currentStep,
  setCurrentStep,
  contactInfo,
  rooms,
  setRooms,
  loadRoomsFromStorage,
  saveEstimatorDataToStorage
}: NavigationProps) => {
  
  const handleNextStep = () => {
    // This function can be overridden by the ContactForm component
    if (window.handleNextStep) {
      window.handleNextStep();
      return;
    }
    
    // Default validation for step 1 (fallback)
    if (currentStep === 1) {
      // Validate contact info
      const validation = validateContactInfo(
        contactInfo.fullName,
        contactInfo.email,
        contactInfo.phone,
        contactInfo.address,
        contactInfo.projectName
      );
      
      if (!validation.isValid && validation.errorMessage) {
        toast.error(validation.errorMessage);
        return;
      }
    } else if (currentStep === 2) {
      // Validate that there's at least one room
      const validation = validateRooms(rooms.length);
      
      if (!validation.isValid && validation.errorMessage) {
        toast.error(validation.errorMessage);
        return;
      }
    }
    
    // Store the current rooms and selections in localStorage for persistence
    saveEstimatorDataToStorage(rooms, contactInfo);
    
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };

  const handlePreviousStep = () => {
    // When going back from step 3 to step 2, make sure to load all rooms from storage
    if (currentStep === 3) {
      const storedRooms = loadRoomsFromStorage();
      if (storedRooms) {
        setRooms(storedRooms);
      }
    }
    
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  return {
    handleNextStep,
    handlePreviousStep
  };
};
