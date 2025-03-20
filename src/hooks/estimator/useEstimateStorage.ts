
import { useState } from 'react';
import { toast } from 'sonner';
import { 
  EstimatorSummary, 
  ContactInfo
} from '@/types/estimator';
import { saveEstimate } from '@/lib/supabase';

export const useEstimateStorage = () => {
  const [estimateSaved, setEstimateSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveEstimate = async (contactInfo: ContactInfo, summary: EstimatorSummary) => {
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

  const handleReset = (resetCallback: () => void) => {
    if (window.confirm('Are you sure you want to reset your estimate? All data will be lost.')) {
      resetCallback();
      setEstimateSaved(false);
      toast.info('Estimate reset successfully');
    }
  };

  return {
    estimateSaved,
    isLoading,
    handleSaveEstimate,
    handleReset,
    setEstimateSaved,
  };
};
