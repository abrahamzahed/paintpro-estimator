
import { useRooms } from './estimator/useRooms';
import { useContactInfo } from './estimator/useContactInfo';
import { usePricingData } from './estimator/usePricingData';
import { useSummary } from './estimator/useSummary';
import { useEstimateStorage } from './estimator/useEstimateStorage';
import { useNavigation } from './estimator/useNavigation';

export const useEstimator = () => {
  // Load pricing data
  const { pricingData, specialConditions, extras, isLoading: pricingDataLoading } = usePricingData();
  
  // Handle contact info
  const { contactInfo, setContactInfo, validateContactInfo } = useContactInfo();
  
  // Handle rooms
  const { rooms, setRooms, handleAddRoom, handleUpdateRoom, handleDeleteRoom } = useRooms(pricingData);
  
  // Calculate summary
  const { summary } = useSummary(rooms, contactInfo, pricingData);
  
  // Handle estimate storage
  const { 
    estimateSaved, 
    isLoading: saveLoading, 
    handleSaveEstimate,
    handleReset: baseHandleReset, 
    setEstimateSaved 
  } = useEstimateStorage();
  
  // Handle navigation
  const { currentStep, handleNextStep, handlePreviousStep } = useNavigation(
    validateContactInfo,
    rooms.length
  );

  // Reset functionality
  const handleReset = () => {
    baseHandleReset(() => {
      setRooms([]);
      setContactInfo({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        projectName: '',
      });
    });
  };

  // Combine loading states
  const isLoading = pricingDataLoading || saveLoading;

  // Handle saving estimate
  const saveEstimate = async () => {
    await handleSaveEstimate(contactInfo, summary);
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
    handleSaveEstimate: saveEstimate
  };
};
