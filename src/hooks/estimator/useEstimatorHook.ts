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
  const [roomsModified, setRoomsModified] = useState(false);
  const [emailNotification, setEmailNotification] = useState<string | null>(null);

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

  const roomManagement = useRoomManagement({
    rooms,
    setRooms,
    pricingData
  });

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
    if (window.handleNextStep) {
      window.handleNextStep();
      return;
    }
    
    if (currentStep === 1) {
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
      const validation = validateRooms(rooms.length);
      
      if (!validation.isValid && validation.errorMessage) {
        toast.error(validation.errorMessage);
        return;
      }
      
      if (roomsModified) {
        setEstimateSaved(false);
        setEmailSent(false);
      }
    }
    
    saveEstimatorDataToStorage(rooms, contactInfo);
    
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };

  const handlePreviousStep = () => {
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
      setEmailNotification(null);
      console.log("Saving estimate...", { contactInfo, summary });
      
      const { estimateData, leadData, projectData } = await saveEstimate(contactInfo, summary);
      
      setSavedEstimateId(estimateData.id);
      setEstimateSaved(true);
      setRoomsModified(false);
      
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
          
          if (data.isRedirected) {
            setEmailNotification(`Email could not be sent to ${contactInfo.email} due to development restrictions. It was sent to ${data.actualRecipient} instead.`);
            toast.info('Estimate saved! Note: In development mode, emails are sent to verified addresses only.');
          } else {
            toast.success('Estimate saved and sent to your email!');
          }
        } else {
          console.error("Email sending failed:", data);
          if (data && data.details) {
            setEmailNotification(data.details);
          }
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
    emailNotification,
    setContactInfo,
    handleAddRoom,
    handleUpdateRoom,
    handleDeleteRoom,
    handleNextStep,
    handlePreviousStep,
    handleReset,
    handleSaveEstimate: handleSaveEstimateAndEmail,
    handleSendEstimateEmail: handleSaveEstimateAndEmail
  };
};
