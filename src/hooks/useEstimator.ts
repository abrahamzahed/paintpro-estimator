
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  EstimatorSummary, 
  RoomDetail, 
  ContactInfo, 
  PricingData,
  SpecialCondition,
  Extra
} from '@/types/estimator';
import { fetchPricingData, saveEstimate } from '@/lib/supabase';
import { validateContactInfo, validateRooms } from './estimator/validationUtils';
import { saveEstimatorDataToStorage, loadRoomsFromStorage, loadContactInfoFromStorage, clearEstimatorStorage } from './estimator/persistenceUtils';
import { createDefaultRoom } from './estimator/roomUtils';
import { calculateEstimatorSummary } from './estimator/summaryUtils';
import { processPricingData } from './estimator/paintUtils';

// Add this to the global Window interface
declare global {
  interface Window {
    handleNextStep?: () => void;
  }
}

export const useEstimator = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    projectName: '',
  });
  const [rooms, setRooms] = useState<RoomDetail[]>([]);
  const [summary, setSummary] = useState<EstimatorSummary>({
    subtotal: 0,
    volumeDiscount: 0,
    total: 0,
    rooms: [],
    contactInfo: contactInfo,
  });
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [estimateSaved, setEstimateSaved] = useState(false);
  const [specialConditions, setSpecialConditions] = useState<SpecialCondition[]>([]);
  const [extras, setExtras] = useState<Extra[]>([]);

  // Fetch pricing data on component mount
  useEffect(() => {
    const loadPricingData = async () => {
      try {
        const data = await fetchPricingData();
        
        // Process pricing data to ensure all required options are present
        const processedData = processPricingData(data);
        
        setPricingData(processedData);
        
        // Set specialized data
        if (data.specialConditions) {
          setSpecialConditions(data.specialConditions);
        }
        
        if (data.extras) {
          setExtras(data.extras);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching pricing data:', error);
        toast.error('Failed to load pricing data. Please try again.');
        setIsLoading(false);
      }
    };

    loadPricingData();
  }, []);

  // Calculate summary whenever rooms or contact info change
  useEffect(() => {
    if (pricingData) {
      const updatedSummary = calculateEstimatorSummary(rooms, contactInfo, pricingData);
      setSummary(updatedSummary);
    }
  }, [rooms, contactInfo, pricingData]);

  const handleAddRoom = () => {
    if (!pricingData) return;
    
    const newRoom = createDefaultRoom(pricingData);
    if (newRoom) {
      setRooms([...rooms, newRoom]);
    }
  };

  const handleUpdateRoom = (updatedRoom: RoomDetail) => {
    setRooms(rooms.map((room) => (room.id === updatedRoom.id ? updatedRoom : room)));
  };

  const handleDeleteRoom = (roomId: string) => {
    setRooms(rooms.filter((room) => room.id !== roomId));
    toast.success('Room removed successfully');
  };

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

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your estimate? All data will be lost.')) {
      setRooms([]);
      setCurrentStep(1);
      setContactInfo({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        projectName: '',
      });
      setEstimateSaved(false);
      clearEstimatorStorage();
      toast.info('Estimate reset successfully');
    }
  };

  const handleSaveEstimate = async () => {
    try {
      setIsLoading(true);
      await saveEstimate(contactInfo, summary);
      setEstimateSaved(true);
      setIsLoading(false);
      toast.success('Estimate saved successfully!');
    } catch (error) {
      console.error('Error saving estimate:', error);
      setIsLoading(false);
      toast.error('Failed to save estimate. Please try again.');
    }
  };

  return {
    currentStep,
    contactInfo,
    rooms,
    summary,
    pricingData,
    isLoading,
    estimateSaved,
    specialConditions,
    extras,
    setContactInfo,
    handleAddRoom,
    handleUpdateRoom,
    handleDeleteRoom,
    handleNextStep,
    handlePreviousStep,
    handleReset,
    handleSaveEstimate
  };
};
