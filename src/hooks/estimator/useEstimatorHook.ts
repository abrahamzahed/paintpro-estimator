
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
import { supabase } from '@/integrations/supabase/client';

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
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const loadPricingData = async () => {
      try {
        const data = await fetchPricingData();
        
        const processedData = processPricingData(data);
        
        setPricingData(processedData);
        
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

  useEffect(() => {
    if (pricingData) {
      const updatedSummary = calculateEstimatorSummary(rooms, contactInfo, pricingData);
      setSummary(updatedSummary);
    }
  }, [rooms, contactInfo, pricingData]);

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
      setEmailSent(false);
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

  const handleSendEstimateEmail = async () => {
    if (!estimateSaved) {
      toast.error('Please save the estimate before sending via email');
      return;
    }

    try {
      setSendingEmail(true);
      
      const { data, error } = await supabase.functions.invoke('send-estimate', {
        body: {
          estimateData: summary,
          contactInfo: contactInfo,
        },
      });

      if (error) {
        throw error;
      }

      setEmailSent(true);
      setSendingEmail(false);
      toast.success('Estimate sent to client via email');
    } catch (error) {
      console.error('Error sending estimate email:', error);
      setSendingEmail(false);
      toast.error('Failed to send estimate. Please try again.');
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
    sendingEmail,
    emailSent,
    setContactInfo,
    handleAddRoom,
    handleUpdateRoom,
    handleDeleteRoom,
    handleNextStep,
    handlePreviousStep,
    handleReset,
    handleSaveEstimate,
    handleSendEstimateEmail
  };
};
