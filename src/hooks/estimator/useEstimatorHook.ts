
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
import { validateContactInfo, validateRooms } from './validationUtils';
import { saveEstimatorDataToStorage, loadRoomsFromStorage, loadContactInfoFromStorage, clearEstimatorStorage } from './persistenceUtils';
import { createDefaultRoom } from './roomUtils';
import { calculateEstimatorSummary } from './summaryUtils';
import { processPricingData } from './paintUtils';
import { handleEstimatorSteps } from './navigationUtils';
import { useRoomManagement } from './roomManagementUtils';

// Add this to the global Window interface
declare global {
  interface Window {
    handleNextStep?: () => void;
  }
}

export const useEstimatorHook = () => {
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

  // Get room management functions from the new utility
  const { handleAddRoom, handleUpdateRoom, handleDeleteRoom } = useRoomManagement({
    rooms,
    setRooms,
    pricingData
  });

  const { handleNextStep, handlePreviousStep } = handleEstimatorSteps({
    currentStep,
    setCurrentStep,
    contactInfo,
    rooms,
    setRooms,
    loadRoomsFromStorage,
    saveEstimatorDataToStorage
  });

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
