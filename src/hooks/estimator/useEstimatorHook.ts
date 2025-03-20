
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
import { fetchPricingData, saveEstimate, sendEstimateEmail } from '@/lib/supabase';
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
  const [savedEstimateId, setSavedEstimateId] = useState<string | null>(null);
  // Flag to track if rooms have been modified since last save
  const [roomsModified, setRoomsModified] = useState(false);

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

  // Modified roomManagement hook to track modifications
  const roomManagement = useRoomManagement({
    rooms,
    setRooms,
    pricingData
  });

  // Make sure handleAddRoom can work both with and without a parameter
  const handleAddRoom = (room?: RoomDetail) => {
    roomManagement.handleAddRoom(room);
    setRoomsModified(true);
    setEstimateSaved(false);
    setEmailSent(false);
  };

  const handleUpdateRoom = (updatedRoom: RoomDetail) => {
    roomManagement.handleUpdateRoom(updatedRoom);
    setRoomsModified(true);
    setEstimateSaved(false);
    setEmailSent(false);
  };

  const handleDeleteRoom = (roomId: string) => {
    roomManagement.handleDeleteRoom(roomId);
    setRoomsModified(true);
    setEstimateSaved(false);
    setEmailSent(false);
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
      
      // When going from step 2 to step 3, always reset the saved state
      // so users can save again if they've made changes
      if (roomsModified) {
        setEstimateSaved(false);
        setEmailSent(false);
      }
    }
    
    // Store the current rooms and selections in localStorage for persistence
    saveEstimatorDataToStorage(rooms, contactInfo);
    
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };

  const handlePreviousStep = () => {
    // When going back from step 3 to step 2, flag that we might make changes
    if (currentStep === 3) {
      setRoomsModified(false);
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
      setEmailSent(false);
      setSavedEstimateId(null);
      setRoomsModified(false);
      clearEstimatorStorage();
      toast.info('Estimate reset successfully');
    }
  };

  const handleSaveEstimateAndEmail = async () => {
    try {
      setIsLoading(true);
      setSendingEmail(true);
      console.log("Saving estimate...", { contactInfo, summary });
      
      const { estimateData, leadData, projectData } = await saveEstimate(contactInfo, summary);
      
      setSavedEstimateId(estimateData.id);
      setEstimateSaved(true);
      setRoomsModified(false);
      
      // Now automatically send the email
      const emailData = {
        estimateData: summary,
        contactInfo: contactInfo,
      };

      try {
        console.log("Sending email with estimate ID:", estimateData.id);
        const data = await sendEstimateEmail(estimateData.id, emailData);
        console.log("Email response:", data);
        
        if (data && data.success) {
          setEmailSent(true);
          toast.success('Estimate saved and sent to your email!');
        } else {
          // If email failed but save succeeded
          console.error("Email sending failed:", data);
          toast.error('Estimate saved but email sending failed. Please try again later.');
          setEmailSent(false);
        }
      } catch (emailError) {
        console.error('Error sending estimate email:', emailError);
        toast.error('Estimate saved but email sending failed. Please try again later.');
        setEmailSent(false);
      } finally {
        setSendingEmail(false);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error saving estimate:', error);
      setSendingEmail(false);
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
    sendingEmail,
    emailSent,
    savedEstimateId,
    setContactInfo,
    handleAddRoom,
    handleUpdateRoom,
    handleDeleteRoom,
    handleNextStep,
    handlePreviousStep,
    handleReset,
    handleSaveEstimate: handleSaveEstimateAndEmail,
    handleSendEstimateEmail: handleSaveEstimateAndEmail // Keep the same function for compatibility
  };
};
